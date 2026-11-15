'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CATEGORIES, type PublicArtwork } from '@/lib/artwork';
import ArtworkCard from '@/components/gallery/ArtworkCard';
import Lightbox from '@/components/gallery/Lightbox';

export default function GalleryClient({ artworks }: { artworks: PublicArtwork[] }) {
  const reduce = useReducedMotion();
  const [category, setCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const chips = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        value: c.value as string,
        label: c.label as string,
        count: artworks.filter((a) => a.category === c.value).length,
      })).filter((c) => c.count > 0),
    [artworks],
  );

  const visible = useMemo(
    () => (category === 'all' ? artworks : artworks.filter((a) => a.category === category)),
    [artworks, category],
  );

  function chooseCategory(value: string) {
    setCategory(value);
    setOpenIndex(null);
  }

  return (
    <div>
      {chips.length > 1 && (
        <div role="group" aria-label="Filter by category" className="mb-8 flex flex-wrap gap-2">
          {[{ value: 'all', label: 'All', count: artworks.length }, ...chips].map((c) => {
            const active = category === c.value;
            return (
              <button
                key={c.value}
                type="button"
                aria-pressed={active}
                onClick={() => chooseCategory(c.value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'border-transparent bg-gradient-to-r from-bubblegum to-orchid text-moon shadow-glow'
                    : 'border-white/20 text-lavender hover:border-blush hover:text-moon'
                }`}
              >
                {c.label} <span className="opacity-70">{c.count}</span>
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={category}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-3 md:gap-x-5 md:gap-y-9"
        >
          {visible.map((art, i) => (
            <ArtworkCard key={art.id} artwork={art} index={i} onOpen={() => setOpenIndex(i)} />
          ))}
        </motion.ul>
      </AnimatePresence>

      {openIndex !== null && visible[openIndex] && (
        <Lightbox
          artworks={visible}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </div>
  );
}
