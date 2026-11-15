'use client';

import { useId } from 'react';

export default function MascotBun({ className = '' }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 160 190" role="img" aria-label="Bun, a fluffy lavender bunny" className={className}>

  <defs>
    <radialGradient id={`bfur-${uid}`} cx="0.4" cy="0.3" r="0.85"><stop offset="0" stopColor="#efe6ff"/><stop offset="1" stopColor="#c9b2ff"/></radialGradient>
  </defs>
  <ellipse cx="80" cy="184" rx="44" ry="6" fill="rgba(0,0,0,0.25)"/>
  <g className="bun-body">
    <g className="bun-ear" style={{ transformOrigin: '62px 60px' }}>
      <ellipse cx="60" cy="34" rx="14" ry="36" fill={`url(#bfur-${uid})`} transform="rotate(-10 60 34)"/>
      <ellipse cx="60" cy="38" rx="7" ry="24" fill="#ffb3d9" transform="rotate(-10 60 38)"/>
    </g>
    <g className="bun-ear bun-ear2" style={{ transformOrigin: '98px 60px' }}>
      <ellipse cx="100" cy="34" rx="14" ry="36" fill={`url(#bfur-${uid})`} transform="rotate(10 100 34)"/>
      <ellipse cx="100" cy="38" rx="7" ry="24" fill="#ffb3d9" transform="rotate(10 100 38)"/>
    </g>
    <circle cx="120" cy="160" r="11" fill="#fff7fb"/>
    <ellipse cx="80" cy="150" rx="38" ry="32" fill={`url(#bfur-${uid})`}/>
    <ellipse cx="80" cy="156" rx="22" ry="21" fill="#fff7fb"/>
    <ellipse cx="58" cy="180" rx="16" ry="8" fill="#b79cff"/>
    <ellipse cx="102" cy="180" rx="16" ry="8" fill="#b79cff"/>
    <ellipse cx="44" cy="150" rx="9" ry="14" fill="#c9b2ff" transform="rotate(14 44 150)"/>
    <g className="mascot-wave bun-wave">
      <ellipse cx="118" cy="146" rx="9" ry="14" fill="#c9b2ff" transform="rotate(-14 118 146)"/>
    </g>
    <ellipse cx="80" cy="98" rx="54" ry="46" fill={`url(#bfur-${uid})`}/>
    <g className="mascot-blink" style={{ transformOrigin: '60px 102px' }}>
      <ellipse cx="60" cy="102" rx="8" ry="11" fill="#2e1065"/>
      <circle cx="57" cy="97" r="3.4" fill="#fff"/><circle cx="63" cy="107" r="1.7" fill="#fff"/>
    </g>
    <g className="mascot-blink" style={{ transformOrigin: '100px 102px' }}>
      <ellipse cx="100" cy="102" rx="8" ry="11" fill="#2e1065"/>
      <circle cx="97" cy="97" r="3.4" fill="#fff"/><circle cx="103" cy="107" r="1.7" fill="#fff"/>
    </g>
    <ellipse cx="46" cy="116" rx="9" ry="5.5" fill="#ff7eb6" opacity="0.5"/>
    <ellipse cx="114" cy="116" rx="9" ry="5.5" fill="#ff7eb6" opacity="0.5"/>
    <path d="M80 108 c-4 -3 -6 -5 -6 -7.5 0 -2 1.4 -3.2 3 -3.2 1.3 0 2.4 .8 3 1.8 .6 -1 1.7 -1.8 3 -1.8 1.6 0 3 1.2 3 3.2 0 2.5 -2 4.5 -6 7.5z" fill="#ff5aa8"/>
    <path d="M72 118 Q76 124 80 119 Q84 124 88 118" stroke="#b0306e" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
  </g>

    </svg>
  );
}
