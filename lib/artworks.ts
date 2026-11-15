import { cache } from 'react';
import { createSupabasePublicClient } from '@/lib/supabase/public';
import type { PublicArtwork } from '@/lib/artwork';

export type PublishedArtworksResult =
  | { status: 'ok'; artworks: PublicArtwork[] }
  | { status: 'error' | 'unconfigured' };

/** Published artwork only (the database also enforces this with Row Level Security). */
export const getPublishedArtworks = cache(async (): Promise<PublishedArtworksResult> => {
  const supabase = createSupabasePublicClient();
  if (!supabase) return { status: 'unconfigured' };
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select('id, title, description, category, image_url, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    if (error) return { status: 'error' };
    return { status: 'ok', artworks: (data ?? []) as PublicArtwork[] };
  } catch {
    return { status: 'error' };
  }
});
