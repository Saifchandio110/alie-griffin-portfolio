'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import ChibiRig, { type ChibiVariant } from '@/components/mascots/ChibiRig';
import { startEdgeActors } from '@/lib/edgeActors';
import { useWelcomeStatus } from '@/lib/welcome';

// Tailwind needs the full class names written out, so each size is spelled here.
const ACTORS: { variant: ChibiVariant; size: string }[] = [
  { variant: 'yuki', size: 'w-[56px] sm:w-[66px]' },
  { variant: 'momo', size: 'hidden w-[60px] sm:block sm:w-[70px]' },
  { variant: 'hana', size: 'hidden w-[64px] lg:block lg:w-[74px]' },
];

/**
 * Shimeji-style desktop pets: they walk along the bottom of the window, sit, wave, climb the side
 * walls, hang from the bottom edge of the header, fall, and can be picked up and thrown.
 * Shown on the home and About pages only, never on the gallery.
 */
export default function EdgeMascots() {
  const pathname = usePathname();
  const welcome = useWelcomeStatus();
  const rootRef = useRef<HTMLDivElement>(null);
  const enabled = (pathname === '/' || pathname === '/about') && welcome === 'closed';

  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return startEdgeActors(root, reduce);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="scene-fade-in pointer-events-none fixed inset-0 z-20 overflow-hidden"
    >
      {ACTORS.map((a) => (
        <div
          key={a.variant}
          data-actor
          data-pose="idle"
          data-surface="floor"
          className={`edge-actor absolute left-0 top-0 ${a.size}`}
        >
          <span className="actor-bubble">♡</span>
          <div className="actor-inner">
            <div className="actor-flip">
              <ChibiRig variant={a.variant} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
