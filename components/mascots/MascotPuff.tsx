'use client';

import { useId } from 'react';

export default function MascotPuff({ className = '' }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 170 150" role="img" aria-label="Puff, a smiling cloud with a little star" className={className}>

  <defs>
    <linearGradient id={`pcloud-${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff7fb"/><stop offset="1" stopColor="#ffd0e6"/></linearGradient>
    <radialGradient id={`pglow-${uid}`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff7c2" stopOpacity="0.9"/><stop offset="1" stopColor="#fff7c2" stopOpacity="0"/></radialGradient>
  </defs>
  <g className="puff-body">
    <circle cx="86" cy="22" r="20" fill={`url(#pglow-${uid})`}/>
    <path className="puff-star" style={{ transformOrigin: '86px 22px' }} d="M86 8 l4.2 9 9.8 1.1 -7.3 6.7 2 9.7 -8.7 -4.9 -8.7 4.9 2 -9.7 -7.3 -6.7 9.8 -1.1 z" fill="#fff3a8" stroke="#ffe27a" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M86 36 L86 50" stroke="#ffd0e6" strokeWidth="3" strokeLinecap="round"/>
    <g fill={`url(#pcloud-${uid})`}>
      <circle cx="52" cy="96" r="30"/><circle cx="88" cy="78" r="38"/><circle cx="124" cy="98" r="28"/>
      <rect x="28" y="92" width="116" height="40" rx="20"/>
    </g>
    <ellipse cx="86" cy="136" rx="52" ry="5" fill="#ffb3d9" opacity="0.35"/>
    <g className="mascot-blink" style={{ transformOrigin: '68px 98px' }}>
      <ellipse cx="68" cy="98" rx="6.5" ry="9" fill="#3b1561"/><circle cx="66" cy="94" r="2.8" fill="#fff"/><circle cx="70.5" cy="102" r="1.4" fill="#fff"/>
    </g>
    <g className="mascot-blink" style={{ transformOrigin: '106px 98px' }}>
      <ellipse cx="106" cy="98" rx="6.5" ry="9" fill="#3b1561"/><circle cx="104" cy="94" r="2.8" fill="#fff"/><circle cx="108.5" cy="102" r="1.4" fill="#fff"/>
    </g>
    <ellipse cx="54" cy="110" rx="8" ry="4.5" fill="#ff7eb6" opacity="0.55"/>
    <ellipse cx="120" cy="110" rx="8" ry="4.5" fill="#ff7eb6" opacity="0.55"/>
    <path d="M80 108 Q87 116 94 108" stroke="#b0306e" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
    <ellipse cx="30" cy="104" rx="9" ry="7" fill="#ffe5f0"/><ellipse cx="144" cy="104" rx="9" ry="7" fill="#ffe5f0"/>
  </g>

    </svg>
  );
}
