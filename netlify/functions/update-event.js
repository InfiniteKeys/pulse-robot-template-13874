import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://woosegomxvbgzelyqvoj.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'PUT, OPTIONS',
  'Content-Type': 'application/json'
};

export async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const { id, name, description, date, time, location, participants } = JSON.parse(event.body);

    // ✅ Extract user token from header
    const authHeader = event.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    // Create Supabase client using service key
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // ✅ Validate the user making this request
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Unauthorized user' })
      };
    }

    // ✅ Check if user is admin
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!roleData || roleData.role !== 'admin') {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Forbidden — Admins only' })
      };
    }

    // ✅ Perform the update
    const { data, error } = await supabaseAdmin
      .from('events')
      .update({ name, description, date, time, location, participants })
      .eq('id', id)
      .select();

    if (error) throw error;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error updating event:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
}
