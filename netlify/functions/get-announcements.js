import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://woosegomxvbgzelyqvoj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb3NlZ29teHZiZ3plbHlxdm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Nzg3OTAsImV4cCI6MjA3NDI1NDc5MH0.htpKQLRZjqwochLN7MBVI8tA5F-AAwktDd5SLq6vUSc';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

export async function handler(event, context) {
  console.log('get-announcements function called');
  
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    console.log('Creating Supabase client...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    console.log('Querying classroom_announcements table...');
    const { data, error } = await supabase
      .from('classroom_announcements')
      .select('id, title, text, creator_name, creation_time, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify([])
      };
    }

    console.log('Successfully fetched announcements:', data?.length || 0);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data || [])
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify([])
    };
  }
}
