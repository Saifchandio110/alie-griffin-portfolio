'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cssVars } from '@/lib/cssVars';

const heart = 'M12 21s-7-4.6-9.5-9C.8 9 2.4 5.5 5.8 5.5c2 0 3.5 1.1 4.2 2.4.7-1.3 2.2-2.4 4.2-2.4 3.4 0 5 3.5 3.3 6.5C19 16.4 12 21 12 21z';
const star = 'M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z';

const decor = [
  { p: heart, c: '#ff3d9a', s: 34, style: { left: '-14px', top: '8%' }, d: '0s', r: '-12deg' },
  { p: star, c: '#fff7fb', s: 26, style: { right: '-10px', top: '4%' }, d: '1s', r: '8deg' },
  { p: heart, c: '#cdb4ff', s: 28, style: { right: '-18px', bottom: '16%' }, d: '1.8s', r: '10deg' },
  { p: star, c: '#ffd6e8', s: 22, style: { left: '-8px', bottom: '8%' }, d: '0.6s', r: '-6deg' },
] as const;

const socialPlaceholders = ['Social link placeholder', 'Social link placeholder', 'Social link placeholder'];

export default function AboutSection({ name }: { name: string }) {
  const reduce = useReducedMotion();
  const reveal = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 20 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '0px 0px -10% 0px' },
    transition: { duration: 0.6, delay, ease: 'easeOut' as const },
  });

  return (
    <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
      <h1 className="font-display text-5xl font-semibold text-blush sm:text-6xl">About {name}</h1>

      <div className="mt-12 grid items-center gap-12 md:grid-cols-[18rem_1fr]">
        {/* profile presentation */}
        <motion.div {...reveal(0)} className="relative mx-auto w-64 sm:w-72">
          <div className="relative overflow-hidden rounded-[2rem] p-[3px] shadow-soft">
            <div className="spin-ring absolute -inset-[60%]" aria-hidden="true" />
            <div className="relative flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-[calc(2rem-3px)] bg-midnight px-6 text-center">
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-bubblegum" fill="currentColor" aria-hidden="true">
                <path d="M12 2l1.8 5.7L19.5 9l-5.7 1.8L12 16.5l-1.8-5.7L4.5 9l5.7-1.3L12 2zm7 11l.9 2.6 2.6.9-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13z" />
              </svg>
              <p className="font-display text-2xl text-moon">Profile picture placeholder</p>
              <p className="text-sm text-lavender">The artist’s photo will appear here.</p>
            </div>
          </div>
          {decor.map((d, i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="float-y absolute"
              style={cssVars(
                {
                  ...d.style,
                  width: d.s,
                  height: d.s,
                  color: d.c,
                  filter: 'drop-shadow(0 0 8px rgba(255,61,154,0.5))',
                },
                { '--d': d.d, '--r': d.r },
              )}
              fill="currentColor"
            >
              <path d={d.p} />
            </svg>
          ))}
        </motion.div>

        {/* text */}
        <div className="space-y-8">
          <motion.div {...reveal(0.05)}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-lavender">Artist</h2>
            <p className="mt-1 font-display text-4xl font-semibold text-moon">{name}</p>
            <p className="mt-1 text-lavender">Digital illustrations and paintings</p>
          </motion.div>

          <motion.div {...reveal(0.1)}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-lavender">Introduction</h2>
            <p className="mt-2 rounded-2xl border border-dashed border-lavender/40 bg-white/[0.03] px-5 py-4 text-lavender">
              [The artist’s introduction will go here once it has been written.]
            </p>
          </motion.div>

          <motion.div {...reveal(0.15)}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-lavender">Find me online</h2>
            <ul className="mt-3 flex flex-wrap gap-3">
              {socialPlaceholders.map((label, i) => (
                <li key={i}>
                  <span
                    aria-disabled="true"
                    className="inline-flex cursor-not-allowed items-center rounded-full border border-dashed border-lavender/40 px-5 py-2 text-sm font-semibold text-lavender/80"
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
