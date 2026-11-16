'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { startEdgeActors } from '@/lib/edgeActors';
import { useWelcomeStatus } from '@/lib/welcome';

// The four roaming characters. Their artwork lives in /public/mascots (transparent WebP files).
// w and h are the real pixel size of each image; they keep every character in proportion.
// Tailwind needs full class names written out, so the visibility classes are spelled here:
// phones show 2 characters, tablets 3, desktops all 4.
const ACTORS = [
  {
    id: 'pink',
    src: '/mascots/shimeji-pink.webp',
    alt: 'A chibi girl with long pink hair and a bow',
    w: 311,
    h: 233,
    show: '',
  },
  {
    id: 'bunny',
    src: '/mascots/shimeji-bunny.webp',
    alt: 'A chibi girl in a white bunny hood holding a bunny plush',
    w: 247,
    h: 283,
    show: '',
  },
  {
    id: 'glasses',
    src: '/mascots/shimeji-glasses.webp',
    alt: 'A chibi girl with round glasses holding a black cat plush',
    w: 245,
    h: 286,
    show: 'hidden sm:block',
  },
  {
    id: 'headphones',
    src: '/mascots/shimeji-headphones.webp',
    alt: 'A chibi girl wearing cat-ear headphones',
    w: 314,
    h: 225,
    show: 'hidden lg:block',
  },
] as const;

// The unit the sizes are based on (the height of a "standard" character image, in image pixels).
const SIZE_BASE = 280;

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
      className="edge-actors scene-fade-in pointer-events-none fixed inset-0 z-20 overflow-hidden"
    >
      {ACTORS.map((a) => (
        <div
          key={a.id}
          data-actor
          data-pose="idle"
          data-surface="floor"
          className={`edge-actor absolute left-0 top-0 ${a.show}`}
          style={{
            width: `calc(var(--shim-u) * ${(a.w / SIZE_BASE).toFixed(3)})`,
            aspectRatio: `${a.w} / ${a.h}`,
          }}
        >
          <span className="actor-bubble">♡</span>
          <span className="actor-pin" />
          <span className="actor-shadow" />
          <div className="actor-inner">
            <div className="actor-flip">
              <div className="actor-body">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="actor-sprite"
                  src={a.src}
                  alt=""
                  width={a.w}
                  height={a.h}
                  draggable={false}
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
