// Shimeji-style behaviour for the edge characters. Pure logic (no DOM) so it can be tested on its own.

export type Surface = 'floor' | 'wallL' | 'wallR' | 'ceiling' | 'air' | 'held';
export type Pose = 'idle' | 'walk' | 'sit' | 'wave' | 'climb' | 'cling' | 'hang' | 'fall' | 'drag' | 'react';
export type Rand = () => number;

export const HEADER_HEIGHT = 64; // characters hang from the bottom edge of the site header
const EDGE = 2;
const GRAVITY = 1600;
const WALK_SPEED = 54;
const CLIMB_SPEED = 42;

export type Bounds = { left: number; right: number; floor: number; ceil: number };
export type Pointer = { x: number; y: number };

export type ActorState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  dir: 1 | -1;
  surface: Surface;
  pose: Pose;
  until: number;
  cooldown: number;
  seekWall: boolean;
  grabDX: number;
  grabDY: number;
  moved: number;
  tvx: number;
  tvy: number;
  lastX: number;
  lastY: number;
  prevSurface: Surface;
  prevPose: Pose;
};

export function makeBounds(vw: number, vh: number, w: number, h: number): Bounds {
  return {
    left: EDGE,
    right: Math.max(EDGE, vw - w - EDGE),
    floor: Math.max(HEADER_HEIGHT, vh - h - EDGE),
    ceil: HEADER_HEIGHT,
  };
}

function between(rng: Rand, min: number, max: number) {
  return min + rng() * (max - min);
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

export function createActor(x: number, w: number, h: number, b: Bounds, now: number, rng: Rand): ActorState {
  return {
    x: clamp(x, b.left, b.right),
    y: b.floor,
    vx: 0,
    vy: 0,
    w,
    h,
    dir: rng() < 0.5 ? 1 : -1,
    surface: 'floor',
    pose: 'idle',
    until: now + between(rng, 600, 1800),
    cooldown: now + 2500,
    seekWall: false,
    grabDX: 0,
    grabDY: 0,
    moved: 0,
    tvx: 0,
    tvy: 0,
    lastX: x,
    lastY: b.floor,
    prevSurface: 'floor',
    prevPose: 'idle',
  };
}

function chooseFloorAction(a: ActorState, now: number, b: Bounds, rng: Rand) {
  const r = rng();
  if (r < 0.5) {
    a.dir = rng() < 0.5 ? 1 : -1;
    a.pose = 'walk';
    a.until = now + between(rng, 3500, 8000);
  } else if (r < 0.65) {
    a.pose = 'idle';
    a.until = now + between(rng, 1500, 3500);
  } else if (r < 0.8) {
    a.pose = 'sit';
    a.until = now + between(rng, 3000, 6500);
  } else if (r < 0.9) {
    a.pose = 'wave';
    a.until = now + 2000;
  } else {
    // head for the nearest wall and climb it
    a.seekWall = true;
    a.dir = a.x < (b.left + b.right) / 2 ? -1 : 1;
    a.pose = 'walk';
    a.until = now + 20000;
  }
}

function letGo(a: ActorState, side: -1 | 0 | 1, rng: Rand) {
  a.surface = 'air';
  a.pose = 'fall';
  a.vx = side === 0 ? 0 : -side * between(rng, 40, 120);
  a.vy = 0;
}

function reachWall(a: ActorState, side: 'L' | 'R', now: number, rng: Rand) {
  if (a.seekWall || rng() < 0.35) {
    a.seekWall = false;
    a.surface = side === 'L' ? 'wallL' : 'wallR';
    a.pose = 'climb';
    a.until = now + between(rng, 1500, 3500);
  } else {
    a.dir = side === 'L' ? 1 : -1;
  }
}

export function stepActor(a: ActorState, now: number, dt: number, b: Bounds, pointer: Pointer, rng: Rand) {
  a.w = a.w || 1;

  if (a.surface === 'held') {
    const safeDt = Math.max(dt, 0.001);
    a.x = clamp(pointer.x - a.grabDX, b.left, b.right);
    a.y = clamp(pointer.y - a.grabDY, 0, b.floor);
    const ivx = (a.x - a.lastX) / safeDt;
    const ivy = (a.y - a.lastY) / safeDt;
    a.tvx = a.tvx * 0.7 + ivx * 0.3;
    a.tvy = a.tvy * 0.7 + ivy * 0.3;
    a.moved += Math.abs(a.x - a.lastX) + Math.abs(a.y - a.lastY);
    a.lastX = a.x;
    a.lastY = a.y;
    return;
  }

  switch (a.surface) {
    case 'floor': {
      a.y = b.floor;
      const cx = a.x + a.w / 2;
      const cy = a.y + a.h / 2;
      const near = Math.hypot(pointer.x - cx, pointer.y - cy) < Math.max(110, a.w * 1.6);
      if (near && now > a.cooldown && a.pose !== 'react') {
        a.dir = pointer.x >= cx ? 1 : -1; // look at the cursor
        a.pose = 'react';
        a.until = now + 1300;
        a.cooldown = now + 7000;
      }
      if (a.pose === 'walk') {
        a.x += a.dir * WALK_SPEED * dt;
        if (a.x <= b.left) {
          a.x = b.left;
          reachWall(a, 'L', now, rng);
        } else if (a.x >= b.right) {
          a.x = b.right;
          reachWall(a, 'R', now, rng);
        }
      }
      if (a.surface === 'floor' && now > a.until) chooseFloorAction(a, now, b, rng);
      break;
    }
    case 'wallL':
    case 'wallR': {
      const side = a.surface === 'wallL' ? 'L' : 'R';
      a.x = side === 'L' ? b.left : b.right;
      if (a.pose === 'climb') {
        a.y -= CLIMB_SPEED * dt;
        if (a.y <= b.ceil) {
          a.y = b.ceil;
          a.surface = 'ceiling';
          a.pose = 'hang';
          a.dir = side === 'L' ? 1 : -1; // crawl away from the wall
          a.until = now + between(rng, 4000, 8000);
          break;
        }
      }
      if (now > a.until) {
        if (a.pose === 'climb') {
          if (rng() < 0.5) {
            a.pose = 'cling';
            a.until = now + between(rng, 1500, 3000);
          } else {
            a.until = now + between(rng, 1500, 3500);
          }
        } else if (rng() < 0.3) {
          letGo(a, side === 'L' ? -1 : 1, rng);
        } else {
          a.pose = 'climb';
          a.until = now + between(rng, 2000, 4000);
        }
      }
      break;
    }
    case 'ceiling': {
      a.y = b.ceil;
      a.x += a.dir * WALK_SPEED * 0.9 * dt;
      if (a.x <= b.left) {
        a.x = b.left;
        a.dir = 1;
      } else if (a.x >= b.right) {
        a.x = b.right;
        a.dir = -1;
      }
      if (now > a.until) letGo(a, 0, rng);
      break;
    }
    case 'air': {
      a.vy += GRAVITY * dt;
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      if (a.x < b.left) {
        a.x = b.left;
        a.vx = Math.abs(a.vx) * 0.4;
      } else if (a.x > b.right) {
        a.x = b.right;
        a.vx = -Math.abs(a.vx) * 0.4;
      }
      if (a.y < b.ceil) {
        a.y = b.ceil;
        a.vy = Math.abs(a.vy) * 0.3;
      }
      if (a.y >= b.floor) {
        a.y = b.floor;
        if (a.vy > 600) {
          a.vy = -a.vy * 0.25; // small bounce
          a.vx *= 0.6;
        } else {
          a.surface = 'floor';
          a.vx = 0;
          a.vy = 0;
          a.pose = 'idle';
          a.until = now + between(rng, 500, 1200);
          a.seekWall = false;
        }
      }
      break;
    }
    default:
      break;
  }

  // keep everyone inside the window if it was resized
  a.x = clamp(a.x, b.left, b.right);
  a.y = clamp(a.y, 0, b.floor);
}

export function grabActor(a: ActorState, px: number, py: number) {
  if (a.surface === 'held') return;
  a.prevSurface = a.surface;
  a.prevPose = a.pose;
  a.surface = 'held';
  a.pose = 'drag';
  a.grabDX = px - a.x;
  a.grabDY = py - a.y;
  a.moved = 0;
  a.lastX = a.x;
  a.lastY = a.y;
  a.tvx = 0;
  a.tvy = 0;
}

/** Let go: a quick tap gives a little wave, a drag throws the character. */
export function releaseActor(a: ActorState, now: number) {
  if (a.surface !== 'held') return;
  if (a.moved < 6) {
    a.surface = a.prevSurface;
    a.pose = a.prevSurface === 'floor' ? 'react' : a.prevPose;
    if (a.prevSurface === 'floor') a.until = now + 1300;
    return;
  }
  a.surface = 'air';
  a.pose = 'fall';
  a.vx = clamp(a.tvx, -900, 900);
  a.vy = clamp(a.tvy, -900, 900);
}
