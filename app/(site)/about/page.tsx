import type { Metadata } from 'next';
import AboutSection from '@/components/about/AboutSection';
import { getAbout } from '@/lib/aboutData';
import { getPortfolioName } from '@/lib/settings';

export const metadata: Metadata = { title: 'About' };

export default async function AboutPage() {
  const [name, about] = await Promise.all([getPortfolioName(), getAbout()]);
  return <AboutSection name={name} about={about} />;
}
