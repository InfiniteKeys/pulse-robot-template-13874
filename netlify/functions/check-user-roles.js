export async function handler(event, context) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    }
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method not allowed" }),
    }
  }

  try {
    const { userId, accessToken } = JSON.parse(event.body);
    
    if (!userId || !accessToken) {
      return {
        statusCode: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Missing userId or accessToken' })
      };
    }
    
    const supabaseUrl = 'https://woosegomxvbgzelyqvoj.supabase.co';
    const rolesUrl = `${supabaseUrl}/rest/v1/user_roles?user_id=eq.${userId}&select=role`;
    
    const response = await fetch(rolesUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb3NlZ29teHZiZ3plbHlxdm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Nzg3OTAsImV4cCI6MjA3NDI1NDc5MH0.htpKQLRZjqwochLN7MBVI8tA5F-AAwktDd5SLq6vUSc',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const roles = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ roles: roles || [] })
    };
  } catch (error) {
    console.error('Error checking roles:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message, roles: [] })
    };
  }
}
