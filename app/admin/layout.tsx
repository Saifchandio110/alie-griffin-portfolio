import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

const backdrop = {
  backgroundImage:
    'radial-gradient(40rem 28rem at 10% -10%, rgba(139,92,246,0.28), transparent 60%), radial-gradient(36rem 26rem at 100% 0%, rgba(255,61,154,0.16), transparent 60%)',
} as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-void px-4 py-8 sm:px-6" style={backdrop}>
      <main id="main" className="mx-auto max-w-4xl">
        {children}
      </main>
    </div>
  );
}
