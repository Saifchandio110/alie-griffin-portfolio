'use client';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';

type Mode = 'full' | 'lite';
type Kind = 'heart' | 'star' | 'sphere';

type Spec = {
  kind: Kind;
  nx: number; // -1..1 across the screen width
  ny: number; // -1..1 across the screen height
  z: number;
  scale: number;
  color: string;
  speed: number;
  phase: number;
  spin: number;
};

// Positions are in screen-relative units so the layout adapts to phones, tablets and desktops.
// Everything sits toward the edges so the centre stays clear for text.
const SPECS: Spec[] = [
  { kind: 'heart', nx: -0.78, ny: 0.62, z: -1, scale: 1.3, color: '#ff3d9a', speed: 0.7, phase: 0.0, spin: 1.0 },
  { kind: 'heart', nx: 0.82, ny: -0.55, z: -0.5, scale: 1.0, color: '#ffb3d9', speed: 0.8, phase: 1.7, spin: 0.9 },
  { kind: 'heart', nx: -0.55, ny: -0.78, z: 0.5, scale: 0.8, color: '#ff6fb5', speed: 0.9, phase: 3.1, spin: 1.1 },
  { kind: 'heart', nx: 0.62, ny: 0.75, z: -1.5, scale: 0.9, color: '#ffd6e8', speed: 0.6, phase: 4.4, spin: 0.8 },
  { kind: 'heart', nx: -0.92, ny: -0.1, z: -2, scale: 1.0, color: '#cdb4ff', speed: 0.75, phase: 2.2, spin: 1.0 },
  { kind: 'star', nx: 0.9, ny: 0.2, z: -1, scale: 1.0, color: '#fff7fb', speed: 0.85, phase: 0.9, spin: 1.2 },
  { kind: 'star', nx: -0.7, ny: 0.9, z: -0.5, scale: 0.8, color: '#ffd6e8', speed: 0.7, phase: 2.8, spin: 1.0 },
  { kind: 'star', nx: 0.45, ny: -0.88, z: 0, scale: 0.9, color: '#cdb4ff', speed: 0.95, phase: 5.0, spin: 1.1 },
  { kind: 'star', nx: -0.95, ny: -0.7, z: -1.5, scale: 0.7, color: '#fff7fb', speed: 0.8, phase: 3.9, spin: 0.9 },
  { kind: 'sphere', nx: 0.72, ny: 0.45, z: 0.5, scale: 0.9, color: '#cdb4ff', speed: 0.6, phase: 1.3, spin: 0 },
  { kind: 'sphere', nx: -0.62, ny: 0.25, z: -2.5, scale: 1.4, color: '#ff8cc6', speed: 0.5, phase: 4.1, spin: 0 },
  { kind: 'sphere', nx: 0.35, ny: -0.7, z: -0.5, scale: 0.7, color: '#ffd6e8', speed: 0.7, phase: 2.5, spin: 0 },
  { kind: 'sphere', nx: -0.35, ny: 0.88, z: -1, scale: 0.6, color: '#8b5cf6', speed: 0.9, phase: 0.4, spin: 0 },
  { kind: 'sphere', nx: 0.95, ny: -0.9, z: -2, scale: 1.2, color: '#ff3d9a', speed: 0.55, phase: 5.5, spin: 0 },
];
const LITE_INDEXES = [0, 1, 2, 3, 5, 6, 9, 11];

function makeHeart(): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(0.25, 0.25);
  s.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0);
  s.bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35);
  s.bezierCurveTo(-0.3, 0.55, -0.1, 0.77, 0.25, 0.95);
  s.bezierCurveTo(0.6, 0.77, 0.8, 0.55, 0.8, 0.35);
  s.bezierCurveTo(0.8, 0.35, 0.8, 0, 0.5, 0);
  s.bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 5,
    curveSegments: 18,
  });
  g.rotateZ(Math.PI); // the base shape is upside down
  g.center();
  return g;
}

function makeStar(): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  const points = 5;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? 0.55 : 0.28;
    const a = (i / (points * 2)) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.08,
    bevelSegments: 4,
  });
  g.center();
  return g;
}

function makeRibbon(): THREE.TubeGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.6, -0.6, 0),
    new THREE.Vector3(-0.8, 0.5, 0.3),
    new THREE.Vector3(0, -0.4, -0.2),
    new THREE.Vector3(0.8, 0.6, 0.3),
    new THREE.Vector3(1.6, -0.3, 0),
  ]);
  return new THREE.TubeGeometry(curve, 64, 0.07, 10, false);
}

function Rig({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  // Gentle parallax: the whole scene leans toward the pointer.
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.22, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.12, 3, delta);
    g.position.x = THREE.MathUtils.damp(g.position.x, state.pointer.x * 0.25, 3, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, state.pointer.y * 0.15, 3, delta);
  });
  return <group ref={group}>{children}</group>;
}

function Floater({
  spec,
  geometry,
  unit,
  vw,
  vh,
}: {
  spec: Spec;
  geometry: THREE.BufferGeometry;
  unit: number;
  vw: number;
  vh: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const x = spec.nx * (vw / 2);
  const baseY = spec.ny * (vh / 2);
  const size = unit * spec.scale;

  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime * spec.speed + spec.phase;
    m.position.y = baseY + Math.sin(t) * size * 0.22;
    m.rotation.y = Math.sin(t * 0.6) * 0.7 * spec.spin;
    m.rotation.z = Math.sin(t * 0.7) * 0.18;
  });

  return (
    <mesh ref={ref} geometry={geometry} position={[x, baseY, spec.z]} scale={size}>
      <meshPhysicalMaterial
        color={spec.color}
        emissive={spec.color}
        emissiveIntensity={0.14}
        roughness={0.2}
        metalness={0.05}
        clearcoat={1}
        clearcoatRoughness={0.08}
      />
    </mesh>
  );
}

function Ribbon({
  geometry,
  position,
  rotation,
  scale,
  color,
  phase,
}: {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  rotation: number;
  scale: number;
  color: string;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime * 0.5 + phase;
    m.rotation.z = rotation + Math.sin(t) * 0.12;
    m.rotation.y = Math.sin(t * 0.8) * 0.5;
  });
  return (
    <mesh ref={ref} geometry={geometry} position={position} scale={scale}>
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        roughness={0.25}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

function Sparkles({ count, vw, vh }: { count: number; vw: number; vh: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * vw * 1.2;
      arr[i * 3 + 1] = (Math.random() - 0.5) * vh * 1.2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return arr;
  }, [count, vw, vh]);

  const texture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.4, 'rgba(255,255,255,0.55)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(c);
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y = state.clock.elapsedTime * 0.02;
    p.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={0.16}
        color="#ffd6e8"
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ mode }: { mode: Mode }) {
  const viewport = useThree((s) => s.viewport);
  const vw = viewport.width;
  const vh = viewport.height;
  const unit = Math.min(vw, vh * 1.2) * 0.11;
  const lite = mode === 'lite';

  const geos = useMemo(() => {
    const seg = lite ? 20 : 32;
    return {
      heart: makeHeart(),
      star: makeStar(),
      sphere: new THREE.SphereGeometry(0.5, seg, seg),
      ribbon: makeRibbon(),
    };
  }, [lite]);

  useEffect(
    () => () => {
      Object.values(geos).forEach((g) => g.dispose());
    },
    [geos],
  );

  const specs = lite ? LITE_INDEXES.map((i) => SPECS[i]) : SPECS;

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 6]} intensity={2.4} color="#fff7fb" />
      <pointLight position={[-5, -3, 4]} intensity={45} color="#ff3d9a" />
      <pointLight position={[5, 3, 3]} intensity={45} color="#8b5cf6" />
      <Rig>
        {specs.map((s, i) => (
          <Floater key={i} spec={s} geometry={geos[s.kind]} unit={unit} vw={vw} vh={vh} />
        ))}
        <Ribbon
          geometry={geos.ribbon}
          position={[-vw * 0.3, -vh * 0.42, -1]}
          rotation={0.3}
          scale={unit * 1.1}
          color="#ff6fb5"
          phase={0}
        />
        {!lite && (
          <Ribbon
            geometry={geos.ribbon}
            position={[vw * 0.32, vh * 0.4, -1.5]}
            rotation={-0.4}
            scale={unit}
            color="#cdb4ff"
            phase={2}
          />
        )}
        <Sparkles count={lite ? 60 : 140} vw={vw} vh={vh} />
      </Rig>
    </>
  );
}

export default function SceneCanvas({ mode, paused }: { mode: Mode; paused: boolean }) {
  return (
    <Canvas
      dpr={mode === 'lite' ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 50 }}
      gl={{ antialias: mode === 'full', alpha: true, powerPreference: 'default' }}
      frameloop={paused ? 'never' : 'always'}
      eventSource={document.body}
      eventPrefix="client"
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Scene mode={mode} />
    </Canvas>
  );
}
