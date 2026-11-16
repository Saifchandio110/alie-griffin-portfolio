'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { signOutAction } from '@/app/admin/actions';
import type { Artwork } from '@/lib/artwork';
import type { AboutContent } from '@/lib/about';
import NameForm from '@/components/admin/NameForm';
import AboutForm from '@/components/admin/AboutForm';
import UploadForm from '@/components/admin/UploadForm';
import ArtworkList from '@/components/admin/ArtworkList';
import { smallBtn } from '@/components/admin/styles';
import type { Notify } from '@/components/admin/types';

type Toast = { id: number; kind: 'success' | 'error'; text: string };

export default function AdminDashboard({
  email,
  portfolioName,
  artworks,
  about,
  aboutReady,
  loadError,
}: {
  email: string;
  portfolioName: string;
  artworks: Artwork[];
  about: AboutContent;
  aboutReady: boolean;
  loadError: string | null;
}) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify: Notify = useCallback((kind: 'success' | 'error', text: string) => {
    if (timer.current) clearTimeout(timer.current);
    const id = Date.now();
    setToast({ id, kind, text });
    timer.current = setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 6000);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-semibold text-blush">Admin</h1>
          <p className="text-sm text-lavender">Signed in as {email}</p>
        </div>
        <div className="flex gap-2">
          <a href="/" className={smallBtn}>
            View site
          </a>
          <form action={signOutAction}>
            <button type="submit" className={smallBtn}>
              Log out
            </button>
          </form>
        </div>
      </header>

      {loadError && (
        <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {loadError}
        </p>
      )}

      <NameForm initialName={portfolioName} notify={notify} />
      <AboutForm key={JSON.stringify(about)} initial={about} ready={aboutReady} notify={notify} />
      <UploadForm notify={notify} />
      <ArtworkList artworks={artworks} notify={notify} />

      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[110] flex justify-center px-4"
        aria-live="polite"
      >
        {toast && (
          <p
            role={toast.kind === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto max-w-md rounded-2xl border px-5 py-3 text-sm font-semibold shadow-soft ${
              toast.kind === 'success'
                ? 'border-emerald-300/40 bg-emerald-900/90 text-emerald-100'
                : 'border-red-300/40 bg-red-900/90 text-red-100'
            }`}
          >
            {toast.text}
          </p>
        )}
      </div>
    </div>
  );
}
