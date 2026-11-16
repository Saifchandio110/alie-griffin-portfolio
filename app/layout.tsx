import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Nunito, Pacifico } from 'next/font/google';
import './globals.css';
import { getPortfolioName } from '@/lib/settings';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const script = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script',
  display: 'swap',
});

const body = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// Re-check the portfolio name from Supabase at most once a minute; admin saves also refresh it instantly.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const name = await getPortfolioName();
  return {
    title: { default: name, template: `%s · ${name}` },
    description: `${name}: digital illustrations and paintings.`,
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a0b2e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${script.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
