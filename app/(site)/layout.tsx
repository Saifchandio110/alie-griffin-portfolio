import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import SiteBackdrop from '@/components/3d/SiteBackdrop';
import WelcomeGate from '@/components/welcome/WelcomeGate';
import { getPortfolioName } from '@/lib/settings';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const name = await getPortfolioName();
  return (
    <>
      <div id="site-root" className="relative z-10">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bubblegum focus:px-5 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader name={name} />
        <main id="main">{children}</main>
        <SiteFooter name={name} />
      </div>
      <SiteBackdrop />
      <WelcomeGate name={name} />
    </>
  );
}
