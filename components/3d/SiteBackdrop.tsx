'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Component, useEffect, useState, type ReactNode } from 'react';
import StaticDreamscape from '@/components/3d/StaticDreamscape';
import { detectSceneMode, type SceneMode } from '@/lib/capabilities';
import { useWelcomeStatus } from '@/lib/welcome';

// The 3D code (three.js) is only downloaded on devices that will actually use it.
const SceneCanvas = dynamic(() => import('@/components/3d/SceneCanvas'), { ssr: false });

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * One shared dream scene behind the welcome screen and the home page.
 * Other pages (like the gallery) stay calm so the artwork is the focus.
 */
export default function SiteBackdrop() {
  const pathname = usePathname();
  const welcome = useWelcomeStatus();
  const [mode, setMode] = useState<SceneMode>('pending');
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setMode(detectSceneMode());
  }, []);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const welcomeActive = welcome !== 'closed';
  const active = welcomeActive || pathname === '/';
  if (!active || mode === 'pending') return null;

  return (
    <div
      aria-hidden="true"
      className={`scene-fade-in pointer-events-none fixed inset-0 ${welcomeActive ? 'z-[89]' : 'z-0'}`}
    >
      {mode === 'static' ? (
        <StaticDreamscape />
      ) : (
        <SceneBoundary fallback={<StaticDreamscape />}>
          <SceneCanvas mode={mode} paused={hidden} />
        </SceneBoundary>
      )}
    </div>
  );
}
