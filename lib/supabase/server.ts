import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { hasSupabaseEnv, supabaseAnonKey, supabaseUrl } from '@/lib/env';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/** Server client that reads the admin's login session from cookies. */
export async function createSupabaseServerClient() {
  if (!hasSupabaseEnv) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component: safe to ignore, middleware refreshes sessions.
        }
      },
    },
  });
}
