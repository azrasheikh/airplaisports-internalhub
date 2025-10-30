import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  // Check if we're in the browser and if environment variables are set
  if (typeof window === 'undefined') {
    console.log('[Supabase] Server-side render detected, returning null');
    return null;
  }

  console.log('[Supabase] Creating browser client...');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase] Missing environment variables');
    return null;
  }

  console.log('[Supabase] Client created successfully with URL:', supabaseUrl);
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
