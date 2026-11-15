import { cache } from 'react';
import { createSupabasePublicClient } from '@/lib/supabase/public';

export const DEFAULT_PORTFOLIO_NAME = 'Alie Griffin';

/** Reads the portfolio name from Supabase. Falls back to the default if Supabase is missing or unreachable. */
export const getPortfolioName = cache(async (): Promise<string> => {
  const supabase = createSupabasePublicClient();
  if (!supabase) return DEFAULT_PORTFOLIO_NAME;
  try {
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('portfolio_name')
      .eq('id', 1)
      .maybeSingle();
    if (error || !data?.portfolio_name) return DEFAULT_PORTFOLIO_NAME;
    return String(data.portfolio_name);
  } catch {
    return DEFAULT_PORTFOLIO_NAME;
  }
});
