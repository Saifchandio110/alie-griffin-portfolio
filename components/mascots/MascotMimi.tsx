'use client';

import { useId } from 'react';

/** Mimi: an original chibi mascot. Blinks, bobs and waves with plain CSS animations. */
export default function MascotMimi({ className = '' }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const hair = `hair-${uid}`;
  const skin = `skin-${uid}`;
  const dress = `dress-${uid}`;

  return (
    <svg
      viewBox="0 0 220 260"
      role="img"
      aria-label="Mimi, a friendly chibi mascot, waving hello"
      className={className}
    >
      <defs>
        <linearGradient id={hair} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9fd0" />
          <stop offset="1" stopColor="#ff3d9a" />
        </linearGradient>
        <radialGradient id={skin} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#fff3f6" />
          <stop offset="1" stopColor="#ffd9e4" />
        </radialGradient>
        <linearGradient id={dress} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="250" rx="52" ry="7" fill="rgba(0,0,0,0.28)" />

      <g className="mascot-bob">
        {/* back hair and buns */}
        <circle cx="46" cy="52" r="24" fill={`url(#${hair})`} />
        <circle cx="174" cy="52" r="24" fill={`url(#${hair})`} />
        <path
          d="M46 112 C32 62 70 24 110 24 C150 24 188 62 174 112 C180 150 168 182 148 190 L72 190 C52 182 40 150 46 112 Z"
          fill={`url(#${hair})`}
        />

        {/* legs and shoes */}
        <rect x="88" y="226" width="16" height="16" rx="8" fill={`url(#${skin})`} />
        <rect x="116" y="226" width="16" height="16" rx="8" fill={`url(#${skin})`} />
        <ellipse cx="94" cy="244" rx="15" ry="8" fill="#cdb4ff" />
        <ellipse cx="126" cy="244" rx="15" ry="8" fill="#cdb4ff" />

        {/* dress */}
        <path d="M80 168 C90 162 130 162 140 168 L160 230 Q110 246 60 230 Z" fill={`url(#${dress})`} />
        <path
          d="M110 214 c-9-6-14-11-14-16 0-4 3-7 7-7 3 0 5 2 7 4 2-2 4-4 7-4 4 0 7 3 7 7 0 5-5 10-14 16z"
          fill="#ffd6e8"
        />
        <path d="M92 166 L110 182 L128 166 Z" fill="#fff7fb" />

        {/* resting arm */}
        <path d="M84 178 Q60 192 58 216" stroke={`url(#${skin})`} strokeWidth="15" strokeLinecap="round" fill="none" />
        <circle cx="86" cy="176" r="11" fill="#8b5cf6" />

        {/* waving arm */}
        <g className="mascot-wave">
          <path d="M136 178 Q166 172 176 142" stroke={`url(#${skin})`} strokeWidth="15" strokeLinecap="round" fill="none" />
          <circle cx="177" cy="138" r="10" fill={`url(#${skin})`} />
          <circle cx="134" cy="176" r="11" fill="#8b5cf6" />
        </g>

        {/* head */}
        <circle cx="110" cy="110" r="62" fill={`url(#${skin})`} />

        {/* fringe */}
        <path
          d="M46 108 C44 62 76 34 110 34 C144 34 176 62 174 108 C156 90 140 78 124 68 C112 88 82 98 46 108 Z"
          fill={`url(#${hair})`}
        />
        <path d="M70 70 Q86 56 104 52" stroke="#ffd0e8" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M106 36 C100 14 126 8 130 24" stroke="#ff5aa8" strokeWidth="5" strokeLinecap="round" fill="none" />

        {/* hair bows */}
        <path d="M60 62 l-16 -10 v20 z M60 62 l16 -10 v20 z" fill="#cdb4ff" />
        <circle cx="60" cy="62" r="5" fill="#8b5cf6" />
        <path d="M160 62 l-16 -10 v20 z M160 62 l16 -10 v20 z" fill="#cdb4ff" />
        <circle cx="160" cy="62" r="5" fill="#8b5cf6" />

        {/* eyes */}
        <g className="mascot-blink" style={{ transformOrigin: '84px 116px' }}>
          <ellipse cx="84" cy="116" rx="13" ry="17" fill="#3b1561" />
          <ellipse cx="84" cy="123" rx="8" ry="9" fill="#8b5cf6" />
          <circle cx="79" cy="109" r="5.5" fill="#fff" />
          <circle cx="89" cy="125" r="2.6" fill="#fff" />
        </g>
        <g className="mascot-blink" style={{ transformOrigin: '136px 116px' }}>
          <ellipse cx="136" cy="116" rx="13" ry="17" fill="#3b1561" />
          <ellipse cx="136" cy="123" rx="8" ry="9" fill="#8b5cf6" />
          <circle cx="131" cy="109" r="5.5" fill="#fff" />
          <circle cx="141" cy="125" r="2.6" fill="#fff" />
        </g>

        {/* cheeks and smile */}
        <ellipse cx="64" cy="138" rx="11" ry="6" fill="#ff7eb6" opacity="0.5" />
        <ellipse cx="156" cy="138" rx="11" ry="6" fill="#ff7eb6" opacity="0.5" />
        <path d="M100 140 Q110 152 120 140" stroke="#b0306e" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
