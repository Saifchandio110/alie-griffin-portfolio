import {
  createActor,
  grabActor,
  makeBounds,
  releaseActor,
  stepActor,
  type ActorState,
  type Pointer,
} from './shimeji';

type Entry = {
  el: HTMLElement;
  flip: HTMLElement;
  state: ActorState;
  pose: string;
  surface: string;
};

function sync(en: Entry) {
  const s = en.state;
  if (s.pose !== en.pose) {
    en.pose = s.pose;
    en.el.dataset.pose = s.pose;
  }
  if (s.surface !== en.surface) {
    en.surface = s.surface;
    en.el.dataset.surface = s.surface;
  }
  en.el.style.transform = `translate3d(${s.x.toFixed(1)}px,${s.y.toFixed(1)}px,0)`;
  let flip: string;
  if (s.surface === 'wallL') flip = 'rotate(-8deg)';
  else if (s.surface === 'wallR') flip = 'rotate(8deg)';
  else flip = `scaleX(${s.dir})`;
  en.flip.style.transform = flip;
}

/** Brings the [data-actor] elements inside `root` to life. Returns a cleanup function. */
export function startEdgeActors(root: HTMLElement, reducedMotion: boolean): () => void {
  const rng = Math.random;
  const pointer: Pointer = { x: -9999, y: -9999 };
  const cleanups: Array<() => void> = [];

  const start = performance.now();
  const vw0 = document.documentElement.clientWidth;
  const vh0 = window.innerHeight;

  const entries: Entry[] = Array.from(root.querySelectorAll<HTMLElement>('[data-actor]')).map((el, i) => {
    const w = el.offsetWidth || 64;
    const h = el.offsetHeight || 90;
    const bounds = makeBounds(vw0, vh0, w, h);
    return {
      el,
      flip: el.querySelector<HTMLElement>('.actor-flip') ?? el,
      state: createActor(vw0 * (0.12 + 0.28 * i), w, h, bounds, start, rng),
      pose: '',
      surface: '',
    };
  });

  if (reducedMotion) {
    // Calm version: characters stand still on the floor.
    for (const en of entries) sync(en);
    return () => undefined;
  }

  const onMove = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  cleanups.push(() => window.removeEventListener('pointermove', onMove));

  for (const en of entries) {
    const down = (ev: PointerEvent) => {
      ev.preventDefault();
      try {
        en.el.setPointerCapture(ev.pointerId);
      } catch {
        // pointer capture is optional
      }
      pointer.x = ev.clientX;
      pointer.y = ev.clientY;
      grabActor(en.state, ev.clientX, ev.clientY);
    };
    const up = () => releaseActor(en.state, performance.now());
    en.el.addEventListener('pointerdown', down);
    en.el.addEventListener('pointerup', up);
    en.el.addEventListener('pointercancel', up);
    cleanups.push(() => {
      en.el.removeEventListener('pointerdown', down);
      en.el.removeEventListener('pointerup', up);
      en.el.removeEventListener('pointercancel', up);
    });
  }

  let raf = 0;
  let last = start;
  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    for (const en of entries) {
      if (en.el.offsetParent === null) continue; // hidden at this screen size
      en.state.w = en.el.offsetWidth;
      en.state.h = en.el.offsetHeight;
      stepActor(en.state, now, dt, makeBounds(vw, vh, en.state.w, en.state.h), pointer, rng);
      sync(en);
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  cleanups.push(() => cancelAnimationFrame(raf));

  return () => cleanups.forEach((fn) => fn());
}
