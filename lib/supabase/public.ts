import { createClient } from '@supabase/supabase-js';
import { hasSupabaseEnv, supabaseAnonKey, supabaseUrl } from '@/lib/env';

/** Cookie-free client for public reads (published artwork, portfolio name). Returns null if not configured. */
export function createSupabasePublicClient() {
  if (!hasSupabaseEnv) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
