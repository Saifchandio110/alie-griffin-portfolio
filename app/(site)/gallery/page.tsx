import type { Metadata } from 'next';
import { getPublishedArtworks } from '@/lib/artworks';
import GalleryClient from '@/components/gallery/GalleryClient';
import GalleryEmpty from '@/components/gallery/GalleryEmpty';

export const metadata: Metadata = { title: 'Gallery' };

export default async function GalleryPage() {
  const result = await getPublishedArtworks();
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <h1 className="font-display text-5xl font-semibold text-blush sm:text-6xl">Gallery</h1>
      <p className="mt-3 max-w-xl text-lavender">Tap any piece to see it full screen.</p>
      <div className="mt-10">
        {result.status === 'ok' && result.artworks.length > 0 ? (
          <GalleryClient artworks={result.artworks} />
        ) : (
          <GalleryEmpty status={result.status} />
        )}
      </div>
    </section>
  );
}
