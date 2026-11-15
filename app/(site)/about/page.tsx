import type { Metadata } from 'next';
import { getPortfolioName } from '@/lib/settings';

export const metadata: Metadata = { title: 'About' };

export default async function AboutPage() {
  const name = await getPortfolioName();
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-5xl font-semibold text-blush">About {name}</h1>
      <div className="glass mt-10 space-y-4 rounded-3xl p-8">
        <p className="text-lavender">[Artist introduction will go here.]</p>
        <p className="text-lavender">[Profile picture placeholder.]</p>
        <p className="text-lavender">[Social media links will go here.]</p>
      </div>
    </section>
  );
}
