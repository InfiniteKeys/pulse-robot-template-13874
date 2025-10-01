export async function handler(event, context) {
  const path = event.path.replace('/.netlify/functions/proxy', '');
  
  // Handle contact form submission
  if (path === '/api/submit-contact' && event.httpMethod === 'POST') {
    try {
      const supabaseUrl = 'https://woosegomxvbgzelyqvoj.supabase.co';
      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/submit-contact`;
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb3NlZ29teHZiZ3plbHlxdm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Nzg3OTAsImV4cCI6MjA3NDI1NDc5MH0.htpKQLRZjqwochLN7MBVI8tA5F-AAwktDd5SLq6vUSc'}`
        },
        body: event.body
      });
      
      const data = await response.text();
      
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: data
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Internal server error' })
      };
    }
  }

  // Handle preflight OPTIONS requests (CORS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      },
      body: "",
    }
  }

  try {
    // Parse the request body to get the Supabase request details
    const requestBody = event.body ? JSON.parse(event.body) : {};
    const { endpoint, method = 'GET', body: supabaseBody, headers: supabaseHeaders = {} } = requestBody;

    if (!endpoint) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "Missing endpoint parameter" }),
      }
    }

    // Build the full Supabase URL
    const supabaseUrl = `${process.env.SUPABASE_URL}${endpoint}`;

    // Prepare headers for Supabase request
    const fetchHeaders = {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_ANON_KEY,
    };

    // Only add Authorization header if one was provided and is properly formatted
    const authHeader = supabaseHeaders.Authorization || supabaseHeaders.authorization;
    if (authHeader && authHeader.startsWith('Bearer ') && authHeader.split('.').length === 3) {
      fetchHeaders.Authorization = authHeader;
    }

    // Add other non-auth headers
    Object.keys(supabaseHeaders).forEach(key => {
      if (key.toLowerCase() !== 'authorization' && key.toLowerCase() !== 'content-type' && key.toLowerCase() !== 'apikey') {
        fetchHeaders[key] = supabaseHeaders[key];
      }
    });

    // Make the request to Supabase
    const fetchOptions = {
      method: method,
      headers: fetchHeaders,
    };

    if (supabaseBody && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = typeof supabaseBody === 'string' ? supabaseBody : JSON.stringify(supabaseBody);
    }

    const response = await fetch(supabaseUrl, fetchOptions);
    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
      },
      body: data,
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: err.message }),
    }
  }
}