import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { endpoint, method, body, headers } = await req.json()
    
    // Get Supabase client using service role key from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, serviceKey)
    
    // Parse the endpoint to determine the table and operation
    const pathParts = endpoint.split('/')
    const tableName = pathParts[3] // /rest/v1/[table_name]
    
    let result
    
    if (method === 'GET') {
      // Handle GET requests (select queries)
      const urlParams = new URLSearchParams(endpoint.split('?')[1] || '')
      const selectParam = urlParams.get('select') || '*'
      const orderParam = urlParams.get('order')
      
      let query = supabase.from(tableName).select(selectParam)
      
      if (orderParam) {
        const [column, direction] = orderParam.split('.')
        query = query.order(column, { ascending: direction === 'asc' })
      }
      
      result = await query
    } else {
      // For other methods, return error as we only proxy read operations for security
      throw new Error('Only GET requests are supported through proxy')
    }

    return new Response(
      JSON.stringify(result.data),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Proxy error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    )
  }
})