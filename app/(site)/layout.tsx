import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { getPortfolioName } from '@/lib/settings';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const name = await getPortfolioName();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bubblegum focus:px-5 focus:py-2"
      >
        Skip to content
      </a>
      <SiteHeader name={name} />
      <main id="main">{children}</main>
      <SiteFooter name={name} />
    </>
  );
}
