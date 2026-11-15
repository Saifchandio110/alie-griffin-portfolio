// Lightweight fallback for devices without WebGL, in data-saver mode, or with reduced motion.
const heart = 'M12 21s-7-4.6-9.5-9C.8 9 2.4 5.5 5.8 5.5c2 0 3.5 1.1 4.2 2.4.7-1.3 2.2-2.4 4.2-2.4 3.4 0 5 3.5 3.3 6.5C19 16.4 12 21 12 21z';
const star = 'M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z';

const items = [
  { t: 'heart', x: '8%', y: '14%', s: 56, c: '#ff3d9a', d: '0s', r: '-12deg' },
  { t: 'heart', x: '84%', y: '70%', s: 44, c: '#ffb3d9', d: '1.2s', r: '10deg' },
  { t: 'heart', x: '14%', y: '78%', s: 34, c: '#cdb4ff', d: '2.1s', r: '-6deg' },
  { t: 'heart', x: '78%', y: '12%', s: 38, c: '#ff8cc6', d: '0.7s', r: '14deg' },
  { t: 'star', x: '90%', y: '32%', s: 36, c: '#fff7fb', d: '1.6s', r: '8deg' },
  { t: 'star', x: '4%', y: '46%', s: 30, c: '#ffd6e8', d: '0.3s', r: '-10deg' },
  { t: 'star', x: '52%', y: '90%', s: 28, c: '#cdb4ff', d: '2.6s', r: '5deg' },
] as const;

const orbs = [
  { x: '20%', y: '30%', s: 46, c: '#cdb4ff', d: '0.5s' },
  { x: '72%', y: '84%', s: 60, c: '#ff8cc6', d: '1.4s' },
  { x: '88%', y: '8%', s: 34, c: '#ffd6e8', d: '2.2s' },
] as const;

export default function StaticDreamscape() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((it, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="float-y absolute"
          style={
            {
              left: it.x,
              top: it.y,
              width: it.s,
              height: it.s,
              color: it.c,
              '--d': it.d,
              '--r': it.r,
              filter: 'drop-shadow(0 0 10px rgba(255, 61, 154, 0.45))',
            } as React.CSSProperties
          }
          fill="currentColor"
        >
          <path d={it.t === 'heart' ? heart : star} />
        </svg>
      ))}
      {orbs.map((o, i) => (
        <span
          key={i}
          className="float-y absolute rounded-full"
          style={
            {
              left: o.x,
              top: o.y,
              width: o.s,
              height: o.s,
              '--d': o.d,
              background: `radial-gradient(circle at 30% 28%, #ffffff 0%, ${o.c} 38%, rgba(139, 92, 246, 0.6) 100%)`,
              boxShadow: `0 0 24px ${o.c}66`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
