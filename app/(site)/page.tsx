import Hero from '@/components/home/Hero';
import { getPortfolioName } from '@/lib/settings';

export default async function HomePage() {
  const name = await getPortfolioName();
  return <Hero name={name} />;
}
