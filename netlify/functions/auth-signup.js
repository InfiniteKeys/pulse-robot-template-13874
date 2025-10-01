export async function handler(event, context) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
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
    const { email, password, redirectUrl } = JSON.parse(event.body);
    
    const supabaseUrl = 'https://woosegomxvbgzelyqvoj.supabase.co';
    const authUrl = `${supabaseUrl}/auth/v1/signup`;
    
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb3NlZ29teHZiZ3plbHlxdm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Nzg3OTAsImV4cCI6MjA3NDI1NDc5MH0.htpKQLRZjqwochLN7MBVI8tA5F-AAwktDd5SLq6vUSc'
      },
      body: JSON.stringify({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      })
    });
    
    const data = await response.json();
    
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
}
