import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://woosegomxvbgzelyqvoj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb3NlZ29teHZiZ3plbHlxdm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Nzg3OTAsImV4cCI6MjA3NDI1NDc5MH0.htpKQLRZjqwochLN7MBVI8tA5F-AAwktDd5SLq6vUSc';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

export async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const { id, accessToken } = JSON.parse(event.body);
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } }
    });

    const { error } = await supabase
      .from('public_events')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error deleting event:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
}
