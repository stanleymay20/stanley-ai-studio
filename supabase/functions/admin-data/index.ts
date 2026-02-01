import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, table, data, id, secret } = await req.json();
    
    // Verify admin secret
    const adminSecret = Deno.env.get('ADMIN_SECRET');
    if (!adminSecret || secret !== adminSecret) {
      console.error('Unauthorized admin data access attempt');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const validTables = ['profile', 'projects', 'books', 'videos'];
    if (!validTables.includes(table)) {
      return new Response(
        JSON.stringify({ error: 'Invalid table' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result;

    switch (action) {
      case 'list':
        console.log(`Admin: Listing ${table}`);
        result = await supabase.from(table).select('*').order('created_at', { ascending: false });
        break;

      case 'get':
        console.log(`Admin: Getting ${table} id=${id}`);
        result = await supabase.from(table).select('*').eq('id', id).single();
        break;

      case 'create':
        console.log(`Admin: Creating ${table}`, data);
        result = await supabase.from(table).insert(data).select().single();
        break;

      case 'update':
        console.log(`Admin: Updating ${table} id=${id}`, data);
        result = await supabase.from(table).update(data).eq('id', id).select().single();
        break;

      case 'delete':
        console.log(`Admin: Deleting ${table} id=${id}`);
        result = await supabase.from(table).delete().eq('id', id);
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    if (result.error) {
      console.error(`Admin data error:`, result.error);
      return new Response(
        JSON.stringify({ error: result.error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ data: result.data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin data error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
