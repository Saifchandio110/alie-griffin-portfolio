import type { Metadata } from 'next';
import AboutSection from '@/components/about/AboutSection';
import { getPortfolioName } from '@/lib/settings';

export const metadata: Metadata = { title: 'About' };

export default async function AboutPage() {
  const name = await getPortfolioName();
  return <AboutSection name={name} />;
}
