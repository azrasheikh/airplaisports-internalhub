import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Check if we're in the browser and if environment variables are set
  if (typeof window === 'undefined') {
    // Return a mock client for SSR/build time
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
