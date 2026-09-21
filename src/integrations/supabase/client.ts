import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Vite injects VITE_* values at build time. The production portfolio keeps a
 * fallback for the same public browser configuration so the app can still boot
 * if a host fails to inject those values. These are publishable client values,
 * never a Supabase service-role key.
 */
const FALLBACK_SUPABASE_URL = 'https://cupsugqsijozesuythdn.supabase.co';
const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1cHN1Z3FzaWpvemVzdXl0aGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MTgzMjgsImV4cCI6MjA4NTQ5NDMyOH0.ZMNBxg0YC9Fz3PvCDsTo6qiTSwW6Z3eqz6KaPfIpbRU';

const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

const SUPABASE_URL = envUrl || FALLBACK_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = envKey || FALLBACK_SUPABASE_PUBLISHABLE_KEY;

// Import the Supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
