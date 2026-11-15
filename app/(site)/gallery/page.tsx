import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Gallery' };

export default function GalleryPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="font-display text-5xl font-semibold text-blush">Gallery</h1>
      <div className="glass mt-10 rounded-3xl p-10 text-center shadow-soft">
        <p className="font-display text-3xl text-moon">No artwork has been published yet.</p>
        <p className="mx-auto mt-3 max-w-md text-lavender">
          New pieces will show up here as soon as they are uploaded and published.
        </p>
        <Link href="/about" className="btn-ghost mt-8">
          Meet the artist
        </Link>
      </div>
    </section>
  );
}
