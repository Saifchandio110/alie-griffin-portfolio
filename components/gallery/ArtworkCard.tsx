'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useRef, type PointerEvent } from 'react';
import { categoryLabel, type PublicArtwork } from '@/lib/artwork';

export default function ArtworkCard({
  artwork,
  index,
  onOpen,
}: {
  artwork: PublicArtwork;
  index: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  // Tilt only for a real mouse, never for touch or when the visitor prefers reduced motion.
  function onPointerMove(e: PointerEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el || reduce || e.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty('--rx', `${((0.5 - py) * 8).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((px - 0.5) * 10).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
  }

  function onPointerLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease: 'easeOut' }}
    >
      <button
        ref={ref}
        type="button"
        onClick={onOpen}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        aria-label={`View ${artwork.title} full screen`}
        className="block w-full text-left"
      >
        <span className="tilt-card relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-orchid/25 to-bubblegum/10">
          <Image
            src={artwork.image_url}
            alt=""
            fill
            sizes="(min-width: 768px) 360px, 50vw"
            className="object-cover"
          />
          <span className="tilt-glare pointer-events-none absolute inset-0" aria-hidden="true" />
        </span>
        <span className="mt-3 block px-1">
          <span className="block truncate font-display text-xl font-semibold text-moon">
            {artwork.title}
          </span>
          <span className="block text-sm text-lavender">{categoryLabel(artwork.category)}</span>
        </span>
      </button>
    </motion.li>
  );
}
