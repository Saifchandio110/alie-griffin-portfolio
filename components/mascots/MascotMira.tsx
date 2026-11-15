'use client';

import { useId } from 'react';

export default function MascotMira({ className = '' }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 300 420" role="img" aria-label="Mira, an anime-style girl, waving hello" className={className}>

  <defs>
    <linearGradient id={`hair-${uid}`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ff9ccf"/>
      <stop offset="0.55" stopColor="#ff7fc0"/>
      <stop offset="1" stopColor="#b79cff"/>
    </linearGradient>
    <linearGradient id={`hairLight-${uid}`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#ffd3ea"/>
      <stop offset="1" stopColor="#ff9ccf"/>
    </linearGradient>
    <radialGradient id={`skin-${uid}`} cx="0.45" cy="0.35" r="0.8">
      <stop offset="0" stopColor="#fff6f4"/>
      <stop offset="1" stopColor="#ffdcd6"/>
    </radialGradient>
    <linearGradient id={`dress-${uid}`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#c4b5fd"/>
      <stop offset="1" stopColor="#8b5cf6"/>
    </linearGradient>
    <linearGradient id={`iris-${uid}`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#5b21b6"/>
      <stop offset="0.6" stopColor="#a855f7"/>
      <stop offset="1" stopColor="#f0abfc"/>
    </linearGradient>
    <linearGradient id={`fade-${uid}`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.82" stopColor="#fff"/>
      <stop offset="1" stopColor="#000"/>
    </linearGradient>
    <mask id={`fadeMask-${uid}`}><rect width="300" height="420" fill={`url(#fade-${uid})`}/></mask>
  </defs>

  <g mask={`url(#fadeMask-${uid})`}>
  <g className="mira-bob">
    {/* back hair, wavy ends */}
    <path d="M86 110 C70 40 120 14 150 14 C182 14 232 40 214 110 C232 160 232 220 240 280 C246 320 238 350 250 378 C222 394 196 382 188 358 C178 384 160 398 150 378 C140 398 122 384 112 358 C104 382 78 394 50 378 C62 350 54 320 60 280 C68 220 68 160 86 110 Z" fill={`url(#hair-${uid})`}/>

    <g transform="translate(0,-14)">
      {/* dress */}
      <path d="M150 234 C128 234 104 242 96 258 L84 332 C70 366 60 400 56 440 L244 440 C240 400 230 366 216 332 L204 258 C196 242 172 234 150 234 Z" fill={`url(#dress-${uid})`}/>
      <path d="M96 392 l3 8 8 1 -6 5 2 8 -7 -4 -7 4 2 -8 -6 -5 8 -1 z M196 372 l3 8 8 1 -6 5 2 8 -7 -4 -7 4 2 -8 -6 -5 8 -1 z M150 404 l2 6 6 1 -5 4 1 6 -4 -3 -5 3 1 -6 -4 -4 6 -1 z" fill="#fff7fb" opacity="0.85"/>
      {/* neck */}
      <path d="M137 206 L137 240 C143 248 157 248 163 240 L163 206 Z" fill={`url(#skin-${uid})`}/>
      <path d="M137 218 C144 226 156 226 163 218 L163 210 L137 210 Z" fill="#f4c7c3" opacity="0.5"/>
      {/* collar + bow */}
      <path d="M118 240 C130 254 142 260 150 260 C158 260 170 254 182 240 C172 234 160 232 150 232 C140 232 128 234 118 240 Z" fill="#fff7fb"/>
      <path d="M150 264 l-22 -12 v26 z M150 264 l22 -12 v26 z" fill="#ff5aa8"/>
      <circle cx="150" cy="264" r="6" fill="#ff3d9a"/>
      <path d="M144 272 l-8 26 l10 -6 z M156 272 l8 26 l-10 -6 z" fill="#ff5aa8"/>
      {/* waist ribbon + brooch */}
      <path d="M100 324 Q150 338 200 324 L202 336 Q150 350 98 336 Z" fill="#fff7fb"/>
      <path d="M150 334 c-7-5-11-9-11-13 0-3 2-5 5-5 2 0 4 1 6 3 2-2 4-3 6-3 3 0 5 2 5 5 0 4-4 8-11 13z" fill="#ff5aa8"/>

      {/* resting arm */}
      <path d="M100 268 C86 292 90 318 106 338" stroke="#ffdcd6" strokeWidth="16" strokeLinecap="round" fill="none"/>
      <ellipse cx="108" cy="344" rx="10" ry="11" fill={`url(#skin-${uid})`}/>
      <path d="M82 254 C80 232 112 226 118 246 C120 264 112 278 100 282 C88 282 82 270 82 254 Z" fill={`url(#dress-${uid})`}/>
      <ellipse cx="97" cy="284" rx="14" ry="5" fill="#fff7fb"/>

      {/* waving arm */}
      <g className="mira-wave" style={{ transformOrigin: '214px 270px' }}>
        <path d="M208 268 C228 270 240 270 244 262 C247 240 248 218 245 196" stroke="#ffdcd6" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M244 172 L236 154 M244 172 L243 150 M246 172 L251 152 M248 174 L258 158" stroke="#ffe7e2" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <path d="M238 186 L226 178" stroke="#ffe7e2" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <ellipse cx="245" cy="182" rx="11" ry="13" fill={`url(#skin-${uid})`}/>
        <ellipse cx="245" cy="206" rx="13" ry="4" fill="#fff7fb"/>
      </g>
      <path d="M218 254 C220 232 190 226 184 246 C182 264 190 278 202 282 C214 282 220 270 218 254 Z" fill={`url(#dress-${uid})`}/>
    </g>

    {/* head */}
    <path d="M92 118 C92 70 122 48 150 48 C178 48 208 70 208 118 C208 162 182 204 150 210 C118 204 92 162 92 118 Z" fill={`url(#skin-${uid})`} stroke="#f3b4b8" strokeWidth="1.2"/>

    {/* eyes */}
    <g className="mira-blink" style={{ transformOrigin: '124px 140px' }}>
      <ellipse cx="124" cy="140" rx="16" ry="20" fill="#fff"/>
      <ellipse cx="124" cy="143" rx="13" ry="18" fill={`url(#iris-${uid})`}/>
      <ellipse cx="124" cy="141" rx="6.5" ry="10" fill="#2e1065"/>
      <circle cx="118" cy="133" r="6" fill="#fff"/>
      <circle cx="130" cy="151" r="2.8" fill="#fff"/>
      <path d="M126 152 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 z" fill="#fff" opacity="0.9"/>
      <path d="M106 130 C110 120 134 118 142 132" stroke="#2e1065" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      <path d="M106 130 l-6 -4" stroke="#2e1065" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M110 156 C118 162 130 162 138 156" stroke="#7c3a8a" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    </g>
    <g className="mira-blink" style={{ transformOrigin: '176px 140px' }}>
      <ellipse cx="176" cy="140" rx="16" ry="20" fill="#fff"/>
      <ellipse cx="176" cy="143" rx="13" ry="18" fill={`url(#iris-${uid})`}/>
      <ellipse cx="176" cy="141" rx="6.5" ry="10" fill="#2e1065"/>
      <circle cx="170" cy="133" r="6" fill="#fff"/>
      <circle cx="182" cy="151" r="2.8" fill="#fff"/>
      <path d="M178 152 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 z" fill="#fff" opacity="0.9"/>
      <path d="M194 130 C190 120 166 118 158 132" stroke="#2e1065" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      <path d="M194 130 l6 -4" stroke="#2e1065" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M190 156 C182 162 170 162 162 156" stroke="#7c3a8a" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    </g>
    <path d="M110 112 Q124 104 138 110" stroke="#d1478f" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
    <path d="M190 112 Q176 104 162 110" stroke="#d1478f" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
    <path d="M148 166 Q150 169 152 166" stroke="#f0a0b0" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M139 178 Q150 196 161 178 Q150 183 139 178 Z" fill="#e0457b"/>
    <path d="M144 186 Q150 191 156 186 Q150 183 144 186 Z" fill="#ff8aa8"/>
    <ellipse cx="104" cy="168" rx="14" ry="7" fill="#ff7eb6" opacity="0.45"/>
    <ellipse cx="196" cy="168" rx="14" ry="7" fill="#ff7eb6" opacity="0.45"/>

    {/* front hair */}
    <path d="M84 126 C76 62 116 30 152 30 C188 30 226 62 216 126 C208 100 196 84 176 74 C166 96 146 112 122 112 C106 112 92 118 84 126 Z" fill={`url(#hair-${uid})`}/>
    <path d="M150 32 C150 62 132 92 100 108 C124 98 142 72 150 32 Z" fill={`url(#hairLight-${uid})`} opacity="0.8"/>
    <path d="M176 76 C170 96 160 106 146 112 C164 108 176 96 178 80 Z" fill={`url(#hairLight-${uid})`} opacity="0.7"/>
    <path d="M150 32 C146 14 168 8 172 22" stroke="#ff7fc0" strokeWidth="5" strokeLinecap="round" fill="none"/>
    <path d="M90 108 C76 150 84 230 62 336 C98 304 112 236 112 186 C100 166 92 140 90 108 Z" fill={`url(#hair-${uid})`}/>
    <path d="M210 108 C224 150 216 230 238 336 C202 304 188 236 188 186 C200 166 208 140 210 108 Z" fill={`url(#hair-${uid})`}/>
    <path d="M92 140 C86 190 84 240 74 300" stroke="#ffd3ea" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
    <path d="M208 140 C214 190 216 240 226 300" stroke="#ffd3ea" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>

    {/* accessories */}
    <path d="M204 56 l22 -14 v32 z M204 56 l-18 -14 v32 z" fill="#cdb4ff"/>
    <circle cx="204" cy="56" r="7" fill="#8b5cf6"/>
    <path d="M100 66 l3 8 8 1 -6 5 2 8 -7 -4 -7 4 2 -8 -6 -5 8 -1 z" fill="#fff7fb" stroke="#ffd6e8" strokeWidth="1.5" strokeLinejoin="round"/>
  </g>
  </g>

    </svg>
  );
}
