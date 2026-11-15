import { createBrowserClient } from '@supabase/ssr';
import { hasSupabaseEnv, supabaseAnonKey, supabaseUrl } from '@/lib/env';

/** Browser client (used by the admin panel for login and uploads). */
export function createSupabaseBrowserClient() {
  if (!hasSupabaseEnv) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
