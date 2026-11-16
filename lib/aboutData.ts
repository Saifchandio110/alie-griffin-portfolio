import { cache } from 'react';
import { createSupabasePublicClient } from '@/lib/supabase/public';
import { DEFAULT_ABOUT, parseAbout, type AboutContent } from '@/lib/about';

/** Public About content. Falls back to placeholders if the database is missing or unreachable. */
export const getAbout = cache(async (): Promise<AboutContent> => {
  const supabase = createSupabasePublicClient();
  if (!supabase) return DEFAULT_ABOUT;
  try {
    const { data, error } = await supabase
      .from('about_content')
      .select('tagline, intro, photo_url, socials')
      .eq('id', 1)
      .maybeSingle();
    if (error || !data) return DEFAULT_ABOUT;
    return parseAbout(data);
  } catch {
    return DEFAULT_ABOUT;
  }
});
