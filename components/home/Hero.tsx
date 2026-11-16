'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function Hero({ name }: { name: string }) {
  const reduce = useReducedMotion();
  const words = name.trim().split(/\s+/);

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-5 py-16 text-center">
      {/* soft shade behind the text so it stays readable over the 3D scene */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(closest-side at 50% 50%, rgba(11,6,20,0.6), transparent 80%)' }}
      />

      <h1
        aria-label={name}
        className="font-script text-[clamp(3rem,13vw,8rem)] leading-[1.15] text-blush"
      >
        {words.map((word, wi) => (
          <Fragment key={wi}>
            {wi > 0 && ' '}
            <motion.span
              className="inline-block whitespace-nowrap px-[0.04em]"
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0, y: 36, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.1 + wi * 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          </Fragment>
        ))}
      </h1>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="mt-6 max-w-xl text-lg text-lavender sm:text-xl"
      >
        A little world of imagination, colors and creativity.
      </motion.p>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        className="mt-10"
      >
        <Link href="/gallery" className="btn-primary px-9 py-4 text-lg">
          Explore My Art
        </Link>
      </motion.div>
    </section>
  );
}
