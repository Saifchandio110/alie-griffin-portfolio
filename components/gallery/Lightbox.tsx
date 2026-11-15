'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { categoryLabel, formatDate, type PublicArtwork } from '@/lib/artwork';

const arrowBtn =
  'flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-void/70 text-2xl text-moon backdrop-blur transition hover:bg-white/15';

export default function Lightbox({
  artworks,
  index,
  onIndexChange,
  onClose,
}: {
  artworks: PublicArtwork[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const titleId = useId();
  const [dir, setDir] = useState<number>(1);

  const art = artworks[index];
  const count = artworks.length;
  const shift = reduce ? 0 : 48;

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * shift }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -shift }),
  };

  const go = useCallback(
    (delta: number) => {
      if (count < 2) return;
      setDir(delta);
      onIndexChange((index + delta + count) % count);
    },
    [count, index, onIndexChange],
  );

  // Lock page scroll and return focus to the card that opened the viewer.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowRight') {
        go(1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        go(-1);
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const nodes = dialogRef.current.querySelectorAll<HTMLElement>('button, [href]');
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === dialogRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="fixed inset-0 z-[100] bg-void/95 backdrop-blur-md outline-none"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close viewer"
        className="absolute right-3 top-3 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-void/70 text-xl text-moon backdrop-blur hover:bg-white/15"
      >
        ✕
      </button>

      <div className="flex h-full flex-col lg:flex-row">
        <div
          className="relative min-h-0 flex-1"
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchStart.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!start) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - start.x;
            const dy = t.clientY - start.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
          }}
        >
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={art.id}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduce ? 0 : 0.28, ease: 'easeOut' }}
              className="absolute inset-0 p-3 pt-16 sm:p-6 sm:pt-16"
            >
              <div className="relative h-full w-full">
                <Image
                  src={art.image_url}
                  alt={art.title}
                  fill
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  quality={85}
                  className="object-contain"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous artwork"
                className={`${arrowBtn} absolute left-2 top-1/2 z-10 -translate-y-1/2 sm:left-4`}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next artwork"
                className={`${arrowBtn} absolute right-2 top-1/2 z-10 -translate-y-1/2 sm:right-4`}
              >
                ›
              </button>
            </>
          )}
        </div>

        <aside className="max-h-[36dvh] shrink-0 overflow-y-auto border-t border-white/10 p-5 lg:max-h-none lg:w-96 lg:border-l lg:border-t-0 lg:p-8 lg:pt-20">
          <p className="text-sm font-semibold text-lavender">
            {index + 1} of {count}
          </p>
          <h2 id={titleId} className="mt-2 font-display text-3xl font-semibold text-blush sm:text-4xl">
            {art.title}
          </h2>
          <p className="mt-2 text-sm text-lavender">
            {categoryLabel(art.category)} · Uploaded {formatDate(art.created_at)}
          </p>
          {art.description && (
            <p className="mt-4 whitespace-pre-line leading-relaxed text-moon">{art.description}</p>
          )}
        </aside>
      </div>
    </div>
  );
}
