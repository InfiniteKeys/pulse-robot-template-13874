import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

interface ClassroomAnnouncement {
  id: string;
  text?: string;
  materials?: any[];
  state: string;
  alternateLink: string;
  creationTime: string;
  updateTime: string;
  creatorUserId: string;
  creatorProfile?: {
    id: string;
    name: {
      fullName: string;
    };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting fetch-classroom-announcements function');
    
    const { courseId } = await req.json();
    
    if (!courseId) {
      console.error('Course ID is required');
      return new Response(
        JSON.stringify({ error: 'Course ID is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get Google service account credentials
    const googleCredentials = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS');
    if (!googleCredentials) {
      console.error('Google service account credentials not found');
      return new Response(
        JSON.stringify({ error: 'Google service account credentials not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const credentials: GoogleCredentials = JSON.parse(googleCredentials);
    
    // Get OAuth token using service account
    console.log('Getting OAuth token...');
    const tokenResponse = await getOAuthToken(credentials);
    if (!tokenResponse.access_token) {
      console.error('Failed to get OAuth token:', tokenResponse);
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate with Google' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch announcements from Google Classroom API
    console.log('Fetching announcements for course:', courseId);
    const announcementsUrl = `https://classroom.googleapis.com/v1/courses/${courseId}/announcements`;
    
    const classroomResponse = await fetch(announcementsUrl, {
      headers: {
        'Authorization': `Bearer ${tokenResponse.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!classroomResponse.ok) {
      const errorText = await classroomResponse.text();
      console.error('Classroom API error:', errorText);
      return new Response(
        JSON.stringify({ error: `Classroom API error: ${classroomResponse.status}` }), 
        { 
          status: classroomResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const classroomData = await classroomResponse.json();
    const announcements = classroomData.announcements || [];
    
    console.log(`Found ${announcements.length} announcements`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store/update announcements in database
    for (const announcement of announcements) {
      const announcementData = {
        classroom_id: courseId,
        announcement_id: announcement.id,
        title: '', // Announcements don't have titles in Classroom API
        text: announcement.text || '',
        creator_name: announcement.creatorProfile?.name?.fullName || 'Unknown',
        creation_time: announcement.creationTime,
        update_time: announcement.updateTime,
        attachments: announcement.materials || null,
      };

      // Use upsert to handle duplicates
      const { error: upsertError } = await supabase
        .from('classroom_announcements')
        .upsert(announcementData, { 
          onConflict: 'announcement_id',
          ignoreDuplicates: false 
        });

      if (upsertError) {
        console.error('Error upserting announcement:', upsertError);
      }
    }

    console.log('Successfully processed announcements');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        count: announcements.length,
        message: `Processed ${announcements.length} announcements` 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in fetch-classroom-announcements:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function getOAuthToken(credentials: GoogleCredentials) {
  const jwt = await createJWT(credentials);
  
  const tokenRequest = await fetch(credentials.token_uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  return await tokenRequest.json();
}

async function createJWT(credentials: GoogleCredentials): Promise<string> {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/classroom.announcements.readonly',
    aud: credentials.token_uri,
    exp: now + 3600, // 1 hour
    iat: now,
  };

  const encoder = new TextEncoder();
  const headerBytes = encoder.encode(JSON.stringify(header));
  const payloadBytes = encoder.encode(JSON.stringify(payload));
  
  const headerB64 = btoa(String.fromCharCode(...headerBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
    
  const payloadB64 = btoa(String.fromCharCode(...payloadBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const signingInput = `${headerB64}.${payloadB64}`;
  
  // Import the private key
  const privateKeyPem = credentials.private_key;
  const privateKeyDer = pemToDer(privateKeyPem);
  
  const key = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyDer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  // Sign the data
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    encoder.encode(signingInput)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${signingInput}.${signatureB64}`;
}

function pemToDer(pem: string): ArrayBuffer {
  const pemContents = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  
  const binaryString = atob(pemContents);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes.buffer;
}