'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * Shows real character artwork (a transparent WebP or PNG in /public/mascots) when it exists,
 * and the built-in drawn character when it does not. No code change is needed to switch:
 * just add the image files with the expected names.
 */
export default function CharacterArt({
  srcs,
  alt,
  className,
  fallback,
}: {
  srcs: string[];
  alt: string;
  className?: string;
  fallback: ReactNode;
}) {
  const [found, setFound] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const key = srcs.join('|');

  useEffect(() => {
    let alive = true;
    const list = key.split('|');
    const tryNext = (i: number) => {
      if (i >= list.length) {
        if (alive) setChecked(true);
        return;
      }
      const img = new window.Image();
      img.onload = () => {
        if (!alive) return;
        setFound(list[i]);
        setChecked(true);
      };
      img.onerror = () => tryNext(i + 1);
      img.src = list[i];
    };
    tryNext(0);
    return () => {
      alive = false;
    };
  }, [key]);

  if (found) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={found} alt={alt} className={className} draggable={false} decoding="async" />;
  }
  // While checking, the fallback reserves the space but stays invisible, so nothing flickers.
  return <div className={checked ? undefined : 'invisible'}>{fallback}</div>;
}
