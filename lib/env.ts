// NEXT_PUBLIC_* values are safe to expose; the anon key is protected by Row Level Security.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);
