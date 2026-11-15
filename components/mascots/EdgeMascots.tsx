'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import MascotMimi from '@/components/mascots/MascotMimi';
import MascotBun from '@/components/mascots/MascotBun';
import MascotPuff from '@/components/mascots/MascotPuff';
import CharacterArt from '@/components/mascots/CharacterArt';
import { useWelcomeStatus } from '@/lib/welcome';

type State = 'walk' | 'idle' | 'wave' | 'react';

type Actor = {
  el: HTMLElement;
  flip: HTMLElement;
  kind: 'walker' | 'floater';
  x: number;
  dir: 1 | -1;
  speed: number;
  state: State;
  until: number;
  cooldown: number;
  phase: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function setState(a: Actor, state: State, now: number, duration: number) {
  a.state = state;
  a.until = now + duration;
  a.el.dataset.state = state;
}

function nextAction(a: Actor, now: number) {
  if (a.kind === 'floater') {
    setState(a, 'idle', now, rand(3000, 6000));
    return;
  }
  const r = Math.random();
  if (r < 0.5) {
    a.dir = Math.random() < 0.5 ? 1 : -1;
    setState(a, 'walk', now, rand(4000, 9000));
  } else if (r < 0.75) {
    setState(a, 'idle', now, rand(2000, 4000));
  } else {
    setState(a, 'wave', now, 1800);
  }
}

/**
 * Tiny characters that wander along the bottom and right edges of the home and About pages.
 * They never take clicks (pointer-events: none), stay away from the header, and are not shown on the gallery.
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
    const pointer = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const start = performance.now();
    const actors: Actor[] = Array.from(root.querySelectorAll<HTMLElement>('[data-actor]')).map((el, i) => ({
      el,
      flip: el.querySelector<HTMLElement>('.actor-flip') ?? el,
      kind: el.dataset.kind === 'floater' ? 'floater' : 'walker',
      x: i === 0 ? window.innerWidth * 0.08 : i === 1 ? window.innerWidth * 0.78 : 0,
      dir: i === 1 ? -1 : 1,
      speed: rand(18, 30),
      state: 'idle',
      until: start + rand(800, 2000),
      cooldown: start + 2500,
      phase: rand(0, 6),
    }));

    function place(a: Actor, now: number, dt: number) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const size = a.el.offsetWidth;

      if (a.kind === 'walker') {
        const minX = 8;
        const maxX = Math.max(minX, vw - size - 8);
        const cx = a.x + size / 2;
        const cy = vh - size / 2 - 6;
        const near = Math.hypot(pointer.x - cx, pointer.y - cy) < 120;
        if (near && now > a.cooldown && a.state !== 'react') {
          a.dir = pointer.x >= cx ? 1 : -1; // turn to look at the cursor
          setState(a, 'react', now, 1300);
          a.cooldown = now + 7000;
        }
        if (a.state === 'walk') {
          a.x += a.dir * a.speed * dt;
          if (a.x <= minX) a.dir = 1;
          else if (a.x >= maxX) a.dir = -1;
        }
        if (now > a.until) nextAction(a, now);
        a.x = Math.min(Math.max(a.x, minX), maxX);
        a.el.style.transform = `translate3d(${a.x.toFixed(1)}px,0,0)`;
        a.flip.style.transform = `scaleX(${a.dir})`;
        return;
      }

      // Floater: drifts up and down the right edge, tucks shyly out of view when the cursor comes close.
      const t = now / 1000 + a.phase;
      const cy = vh * 0.5 + Math.sin(t * 0.35) * vh * 0.18;
      const cx = vw - size / 2 - 6;
      const near = Math.hypot(pointer.x - cx, pointer.y - cy) < 150;
      if (near && now > a.cooldown && a.state !== 'react') {
        setState(a, 'react', now, 1300);
        a.cooldown = now + 7000;
      }
      const target = near ? size * 0.85 : 0;
      a.x += (target - a.x) * Math.min(1, dt * 4);
      if (now > a.until) nextAction(a, now);
      a.el.style.transform = `translate3d(${a.x.toFixed(1)}px,${(cy - size / 2).toFixed(1)}px,0)`;
    }

    let raf = 0;
    if (reduce) {
      // Calm version: characters stay parked and still.
      actors.forEach((a) => place(a, start, 0));
    } else {
      let last = start;
      const tick = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        for (const a of actors) {
          if (a.el.offsetParent === null) continue; // hidden at this screen size
          place(a, now, dt);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} aria-hidden="true" className="scene-fade-in pointer-events-none fixed inset-0 z-20 overflow-hidden">
      <div data-actor data-kind="walker" data-state="idle" className="edge-actor absolute bottom-1.5 left-0 w-[50px] sm:w-[64px]">
        <span className="actor-bubble">♡</span>
        <div className="actor-inner">
          <div className="actor-flip">
            <CharacterArt
              srcs={['/mascots/edge-girl-1.webp', '/mascots/edge-girl-1.png']}
              alt=""
              className="block h-auto max-h-[140px] w-full object-contain object-bottom"
              fallback={<MascotMimi className="block w-full" />}
            />
          </div>
        </div>
      </div>

      <div data-actor data-kind="walker" data-state="idle" className="edge-actor absolute bottom-1.5 left-0 w-[46px] sm:w-[58px]">
        <span className="actor-bubble">♪</span>
        <div className="actor-inner">
          <div className="actor-flip">
            <CharacterArt
              srcs={['/mascots/edge-girl-2.webp', '/mascots/edge-girl-2.png']}
              alt=""
              className="block h-auto max-h-[140px] w-full object-contain object-bottom"
              fallback={<MascotBun className="block w-full" />}
            />
          </div>
        </div>
      </div>

      <div data-actor data-kind="floater" data-state="idle" className="edge-actor absolute right-1.5 top-0 hidden w-[68px] md:block">
        <span className="actor-bubble">✦</span>
        <div className="actor-inner">
          <div className="actor-flip">
            <CharacterArt
              srcs={['/mascots/edge-girl-3.webp', '/mascots/edge-girl-3.png']}
              alt=""
              className="block h-auto max-h-[140px] w-full object-contain object-bottom"
              fallback={<MascotPuff className="block w-full" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
