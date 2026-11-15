export type SceneMode = 'pending' | 'full' | 'lite' | 'static';

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/** Decides how much 3D this device should get. 'static' means a lightweight CSS scene instead of WebGL. */
export function detectSceneMode(): Exclude<SceneMode, 'pending'> {
  if (typeof window === 'undefined') return 'static';
  const nav = navigator as NavigatorHints;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static';
  if (nav.connection?.saveData) return 'static';

  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return 'static';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    return 'static';
  }

  const memory = nav.deviceMemory;
  const cores = nav.hardwareConcurrency ?? 4;
  if ((memory !== undefined && memory <= 2) || cores <= 2) return 'static';

  const smallScreen = window.innerWidth < 768;
  if (smallScreen || cores <= 4 || (memory !== undefined && memory <= 4)) return 'lite';
  return 'full';
}
