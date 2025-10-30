import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  // Check if we're in the browser and if environment variables are set
  if (typeof window === 'undefined') {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables not configured');
    return null;
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
