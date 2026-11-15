'use client';

import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import MascotMimi from '@/components/mascots/MascotMimi';
import { WELCOME_KEY, setWelcomeStatus, useWelcomeStatus } from '@/lib/welcome';

// Runs before first paint so visitors who already entered never see the welcome flash again.
const earlyScript = `try{if(sessionStorage.getItem('${WELCOME_KEY}')==='1')document.documentElement.setAttribute('data-welcome','seen')}catch(e){}`;

function possessive(name: string): string {
  const first = name.trim().split(/\s+/)[0] || name;
  return /s$/i.test(first) ? `${first}’` : `${first}’s`;
}

export default function WelcomeGate({ name }: { name: string }) {
  const status = useWelcomeStatus();
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const entering = useRef(false);

  const enter = useCallback(() => {
    if (entering.current) return;
    entering.current = true;
    setWelcomeStatus('leaving');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !bgRef.current || !contentRef.current) {
      setWelcomeStatus('closed');
      return;
    }
    const tl = gsap.timeline({ onComplete: () => setWelcomeStatus('closed') });
    tl.to(contentRef.current, { opacity: 0, y: -24, scale: 0.96, duration: 0.45, ease: 'power2.in' }).to(
      bgRef.current,
      { clipPath: 'circle(0% at 50% 62%)', duration: 0.9, ease: 'power3.inOut' },
      '-=0.15',
    );
  }, []);

  // While open: the page behind is inert, scrolling is locked, and Enter/Escape both work.
  useEffect(() => {
    if (status !== 'open') return;
    const root = document.getElementById('site-root');
    root?.setAttribute('inert', '');
    document.body.style.overflow = 'hidden';
    buttonRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') enter();
      if (e.key === 'Tab') {
        e.preventDefault();
        buttonRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      root?.removeAttribute('inert');
      document.body.style.overflow = '';
    };
  }, [status, enter]);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: earlyScript }} />
      <noscript>
        <style>{'.welcome-layer{display:none!important}'}</style>
      </noscript>
      {status !== 'closed' && (
        <div className="welcome-layer" role="dialog" aria-modal="true" aria-label="Welcome">
          <div
            ref={bgRef}
            className="fixed inset-0 z-[88]"
            style={{
              background:
                'radial-gradient(60rem 40rem at 20% 10%, rgba(255,140,198,0.45), transparent 60%), radial-gradient(50rem 36rem at 90% 90%, rgba(139,92,246,0.55), transparent 60%), linear-gradient(165deg, #2a0f4a 0%, #4c1d95 45%, #9d2a7f 100%)',
              clipPath: 'circle(150% at 50% 62%)',
            }}
          />
          <div
            ref={contentRef}
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-y-auto px-6 py-8 text-center"
          >
            <div className="welcome-rise relative" style={{ ['--d' as string]: '0s' }}>
              <MascotMimi className="w-36 sm:w-48" />
              <svg viewBox="0 0 24 24" className="twinkle absolute -left-4 top-4 h-6 w-6 text-moon" fill="currentColor" aria-hidden="true">
                <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
              </svg>
              <svg viewBox="0 0 24 24" className="twinkle absolute -right-5 top-16 h-5 w-5 text-blush" style={{ animationDelay: '0.7s' }} fill="currentColor" aria-hidden="true">
                <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
              </svg>
            </div>

            <p
              className="welcome-rise mt-4 font-display text-5xl font-bold text-moon sm:text-7xl"
              style={{ ['--d' as string]: '0.15s', textShadow: '0 0 28px rgba(255,61,154,0.7)' }}
            >
              Hey, you made it! ♡
            </p>
            <p
              className="welcome-rise mt-3 max-w-md font-display text-2xl text-blush sm:text-3xl"
              style={{ ['--d' as string]: '0.3s' }}
            >
              Welcome to {possessive(name)} little universe.
            </p>

            <button
              ref={buttonRef}
              type="button"
              onClick={enter}
              className="btn-primary welcome-rise welcome-pulse mt-9 px-9 py-4 text-lg tracking-[0.2em]"
              style={{ ['--d' as string]: '0.45s' }}
            >
              ENTER MY WORLD
            </button>
          </div>
        </div>
      )}
    </>
  );
}
