import Link from 'next/link';
import { getPortfolioName } from '@/lib/settings';

export default async function HomePage() {
  const name = await getPortfolioName();
  return (
    <section className="mx-auto flex min-h-[80dvh] max-w-4xl flex-col items-center justify-center px-5 text-center">
      <h1 className="font-display text-6xl font-bold leading-none text-blush sm:text-8xl">{name}</h1>
      <p className="mt-6 max-w-xl text-lg text-lavender">
        A little world of imagination, colors and creativity.
      </p>
      <Link href="/gallery" className="btn-primary mt-10">
        Explore My Art
      </Link>
    </section>
  );
}
