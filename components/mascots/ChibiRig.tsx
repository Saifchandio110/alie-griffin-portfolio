// Chibi girl rig: one drawing, three original characters (different hair, outfit and colours).
// Poses are driven by CSS through a data-pose attribute on any parent element (see globals.css).

export type ChibiVariant = 'hana' | 'yuki' | 'momo';

const LABELS: Record<ChibiVariant, string> = {
  hana: 'Hana, a chibi anime girl with long pink hair',
  yuki: 'Yuki, a chibi anime girl with silver hair and cat ears',
  momo: 'Momo, a chibi anime girl with plum hair and twin buns',
};

export default function ChibiRig({
  variant,
  className = '',
}: {
  variant: ChibiVariant;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 280"
      role="img"
      aria-label={LABELS[variant]}
      className={`rig ${className}`}
      data-variant={variant}
    >
<ellipse className="shadow" cx="100" cy="272" rx="42" ry="5" fill="rgba(0,0,0,0.25)"/>
<g className="all">
  <g className="back">
{variant === 'hana' && (
<>
<path d="M26 104 C20 44 66 14 100 14 C134 14 180 44 174 104 C182 150 178 200 166 238 C150 232 138 212 138 186 L62 186 C62 212 50 232 34 238 C22 200 18 150 26 104 Z" className="c-hair"/>
<path d="M62 186 L138 186 C138 204 142 216 152 226 C132 216 120 206 100 206 C80 206 68 216 48 226 C58 216 62 204 62 186 Z" className="c-hair-s" opacity="0.55"/>
</>
)}
{variant === 'yuki' && (
<>
<path d="M30 104 C26 44 66 16 100 16 C134 16 174 44 170 104 C172 130 168 150 160 162 L40 162 C32 150 28 130 30 104 Z" className="c-hair"/>
<path d="M40 162 C36 170 44 176 54 168 L50 158 Z M160 162 C164 170 156 176 146 168 L150 158 Z" className="c-hair"/>
</>
)}
{variant === 'momo' && (
<>
<circle cx="48" cy="36" r="21" className="c-hair"/><circle cx="152" cy="36" r="21" className="c-hair"/>
<circle cx="48" cy="36" r="21" className="c-hair-s" opacity="0.25"/>
<path d="M28 104 C24 48 66 18 100 18 C134 18 176 48 172 104 C176 140 172 176 162 208 C148 198 140 182 140 164 L60 164 C60 182 52 198 38 208 C28 176 24 140 28 104 Z" className="c-hair"/>
</>
)}
  </g>
<g className="arms-up">
  <g className="arm-ul"><path d="M66 170 C20 164 18 70 44 14" className="s-skin" strokeWidth="11" strokeLinecap="round" fill="none"/><circle cx="44" cy="12" r="8.5" className="c-skin"/></g>
  <g className="arm-ur"><path d="M134 170 C180 164 182 70 156 14" className="s-skin" strokeWidth="11" strokeLinecap="round" fill="none"/><circle cx="156" cy="12" r="8.5" className="c-skin"/></g>
</g>
<g className="leg leg-l">
  <rect x="82" y="214" width="15" height="38" rx="7.5" className="c-skin"/>
  <rect x="81" y="234" width="17" height="20" rx="6" className="c-sock"/>
  <rect x="81" y="234" width="17" height="4" className="c-acc"/>
  <path d="M79 254 C79 245 100 245 100 254 L102 262 C102 267 77 267 77 262 Z" className="c-shoe"/>
  <path d="M81 256 H98" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.55"/>
  <ellipse cx="87" cy="251" rx="3.5" ry="1.8" fill="#fff" opacity="0.35"/>
</g>
<g className="leg leg-r">
  <rect x="103" y="214" width="15" height="38" rx="7.5" className="c-skin"/>
  <rect x="102" y="234" width="17" height="20" rx="6" className="c-sock"/>
  <rect x="102" y="234" width="17" height="4" className="c-acc"/>
  <path d="M100 254 C100 245 121 245 121 254 L123 262 C123 267 98 267 98 262 Z" className="c-shoe"/>
  <path d="M102 256 H119" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.55"/>
  <ellipse cx="108" cy="251" rx="3.5" ry="1.8" fill="#fff" opacity="0.35"/>
</g>
  <g className="body">
<path d="M70 160 C70 153 130 153 130 160 L134 212 C134 217 66 217 66 212 Z" className="c-out"/>
<path d="M118 158 L134 212 C134 217 124 217 119 217 Z" className="c-out-s" opacity="0.55"/>
<path d="M62 204 L138 204 L150 232 C124 241 76 241 50 232 Z" className="c-out"/>
<path d="M78 206 L72 237 M100 206 V239 M122 206 L128 237" strokeWidth="2" className="s-out-s" opacity="0.6" fill="none" strokeLinecap="round"/>
<path d="M50 232 C76 241 124 241 150 232 L149 227 C124 236 76 236 51 227 Z" className="c-trim"/>
{variant === 'hana' && (
<>
<path d="M80 158 L100 177 L120 158 L112 153 L100 164 L88 153 Z" className="c-trim"/>
<path d="M100 180 L86 171 V188 Z M100 180 L114 171 V188 Z" className="c-acc"/><circle cx="100" cy="180" r="4.6" className="c-acc-s"/>
<path d="M96 184 L91 201 L100 194 Z M104 184 L109 201 L100 194 Z" className="c-acc"/>
<path d="M100 216 c-6-4-9-7-9-10 0-3 2-4.5 4.5-4.5 2 0 3.5 1 4.5 2.4 1-1.4 2.5-2.4 4.5-2.4 2.5 0 4.5 1.5 4.5 4.5 0 3-3 6-9 10z" className="c-trim" opacity="0.9" transform="translate(0 -4) scale(1)"/>
</>
)}
{variant === 'yuki' && (
<>
<path d="M70 156 C78 178 122 178 130 156 C122 148 78 148 70 156 Z" className="c-out-s"/>
<path d="M92 174 V192 M108 174 V192" className="s-trim" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
<circle cx="92" cy="194" r="3" className="c-acc"/><circle cx="108" cy="194" r="3" className="c-acc"/>
<path d="M82 200 H118 L114 214 H86 Z" className="c-out-s" opacity="0.7"/>
<path d="M100 202 l2.2 4.6 5 .6 -3.7 3.4 1 5 -4.5 -2.5 -4.5 2.5 1 -5 -3.7 -3.4 5 -.6 z" className="c-acc" transform="translate(0 -1) scale(0.9) translate(11 3)"/>
</>
)}
{variant === 'momo' && (
<>
<path d="M62 156 L100 188 L138 156 L130 149 L100 170 L70 149 Z" className="c-trim"/>
<path d="M66 154 L100 182 L134 154" stroke="#f9a8d4" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
<path d="M100 182 L88 175 V192 Z M100 182 L112 175 V192 Z" className="c-acc"/><circle cx="100" cy="182" r="4" className="c-acc-s"/>
<path d="M97 186 L93 203 L100 197 Z M103 186 L107 203 L100 197 Z" className="c-acc"/>
</>
)}
  </g>
<g className="arms-down">
  <g className="arm-l">
    <path d="M62 176 C53 190 53 202 57 212" className="s-skin" strokeWidth="11" strokeLinecap="round" fill="none"/>
    <circle cx="57" cy="214" r="7.5" className="c-skin"/>
    <ellipse cx="63" cy="173" rx="11.5" ry="10" className="c-out"/>
    <path d="M55 181 Q62 188 70 181" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
  </g>
  <g className="arm-r">
    <path d="M138 176 C147 190 147 202 143 212" className="s-skin" strokeWidth="11" strokeLinecap="round" fill="none"/>
    <circle cx="143" cy="214" r="7.5" className="c-skin"/>
    <ellipse cx="137" cy="173" rx="11.5" ry="10" className="c-out"/>
    <path d="M130 181 Q138 188 145 181" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
  </g>
</g>
  <g className="head">
<path d="M38 100 C38 58 66 40 100 40 C134 40 162 58 162 100 C162 134 136 158 100 160 C64 158 38 134 38 100 Z" className="c-skin"/>
<path d="M44 118 C50 142 76 156 100 158 C80 150 58 140 44 118 Z" className="c-skin-s" opacity="0.45"/>
<path d="M156 118 C150 142 124 156 100 158 C120 150 142 140 156 118 Z" className="c-skin-s" opacity="0.45"/>
<ellipse cx="52" cy="128" rx="12" ry="6.5" fill="#ff8fb3" opacity="0.5"/>
<ellipse cx="148" cy="128" rx="12" ry="6.5" fill="#ff8fb3" opacity="0.5"/>
<path d="M45 128 l3 5 M52 128 l3 5 M59 128 l3 5 M141 128 l3 5 M148 128 l3 5 M155 128 l3 5" stroke="#ff6f9c" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" fill="none"/>
<g className="blink" style={{ transformOrigin: '72px 108px' }}>
  <ellipse cx="72" cy="108" rx="15" ry="19" className="c-ink"/>
  <ellipse cx="72" cy="110" rx="12.5" ry="16.5" className="c-iris"/>
  <ellipse cx="72" cy="118" rx="10" ry="8.5" className="c-iris-l" opacity="0.85"/>
  <ellipse cx="72" cy="110" rx="6.2" ry="9.5" className="c-ink"/>
  <circle cx="66.5" cy="101" r="5.6" fill="#fff"/>
  <circle cx="78" cy="119" r="2.6" fill="#fff"/>
  <circle cx="79" cy="104" r="1.6" fill="#fff" opacity="0.9"/>
  <path d="M54 100 C58 86 84 84 90 98" className="s-ink" strokeWidth="4.6" strokeLinecap="round" fill="none"/>
  <path d="M54 100 L48 94" className="s-ink" strokeWidth="3.4" strokeLinecap="round" fill="none"/>
</g>
<g className="blink" style={{ transformOrigin: '128px 108px' }}>
  <ellipse cx="128" cy="108" rx="15" ry="19" className="c-ink"/>
  <ellipse cx="128" cy="110" rx="12.5" ry="16.5" className="c-iris"/>
  <ellipse cx="128" cy="118" rx="10" ry="8.5" className="c-iris-l" opacity="0.85"/>
  <ellipse cx="128" cy="110" rx="6.2" ry="9.5" className="c-ink"/>
  <circle cx="122.5" cy="101" r="5.6" fill="#fff"/>
  <circle cx="134" cy="119" r="2.6" fill="#fff"/>
  <circle cx="135" cy="104" r="1.6" fill="#fff" opacity="0.9"/>
  <path d="M146 100 C142 86 116 84 110 98" className="s-ink" strokeWidth="4.6" strokeLinecap="round" fill="none"/>
  <path d="M146 100 L152 94" className="s-ink" strokeWidth="3.4" strokeLinecap="round" fill="none"/>
</g>
<path d="M58 82 Q70 75 84 79" className="s-hair-s" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
<path d="M142 82 Q130 75 116 79" className="s-hair-s" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
<path d="M98 127 Q100 129.5 102 127" stroke="#e39aa4" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
<path d="M90 134 Q100 150 110 134 Q100 139 90 134 Z" fill="#c2406f"/>
<path d="M95 142 Q100 147 105 142 Q100 140 95 142 Z" fill="#ff8fa8"/>
{variant === 'hana' && (
<>
<path d="M36 104 C32 56 64 28 100 28 C136 28 168 56 164 104 C162 94 158 86 152 80 L150 94 L138 82 L134 96 L120 80 L110 94 L100 78 L90 94 L80 80 L66 96 L62 82 L50 94 L48 80 C42 86 38 94 36 104 Z" className="c-hair"/>
<path d="M36 104 C34 130 34 176 42 206 C54 190 58 158 56 130 C54 118 46 110 36 104 Z" className="c-hair"/>
<path d="M164 104 C166 130 166 176 158 206 C146 190 142 158 144 130 C146 118 154 110 164 104 Z" className="c-hair"/>
<path d="M56 130 C58 158 54 190 42 206 C50 180 50 156 48 134 Z" className="c-hair-s" opacity="0.6"/>
<path d="M144 130 C142 158 146 190 158 206 C150 180 150 156 152 134 Z" className="c-hair-s" opacity="0.6"/>
<path d="M62 46 C80 34 106 32 128 40" className="s-hair-h" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85"/>
<path d="M44 84 C48 70 56 58 66 52" className="s-hair-h" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
<path d="M98 30 C94 12 116 6 120 20" className="s-hair" strokeWidth="5" strokeLinecap="round" fill="none"/>
<path d="M132 34 L156 20 L156 50 Z M132 34 L108 20 L108 50 Z" className="c-acc"/><circle cx="132" cy="34" r="7" className="c-acc-s"/>
<path d="M142 32 L152 26 M142 38 L152 44" stroke="#fff" strokeWidth="1.6" opacity="0.5" fill="none"/>
</>
)}
{variant === 'yuki' && (
<>
<path d="M34 102 C30 54 64 26 100 26 C136 26 170 54 166 102 C158 84 146 74 130 70 C122 86 100 90 80 86 C62 86 46 92 34 102 Z" className="c-hair"/>
<path d="M34 102 C28 128 30 152 38 168 C48 154 52 132 50 112 Z" className="c-hair"/>
<path d="M166 102 C172 128 170 152 162 168 C152 154 148 132 150 112 Z" className="c-hair"/>
<path d="M142 72 C160 90 168 124 160 160 C152 130 150 100 142 72 Z" className="c-streak"/>
<path d="M62 44 C82 32 108 30 130 38" className="s-hair-h" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.9"/>
<path d="M44 96 C50 80 62 70 76 66" className="s-hair-s" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.7"/>
<path d="M96 26 C90 8 106 2 112 14" className="s-hair" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
<path d="M104 26 C108 8 124 6 124 18" className="s-hair" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
<path d="M58 42 L50 8 L82 30 Z" className="c-hair-s"/><path d="M58 38 L54 16 L74 30 Z" fill="#ffc2e2"/>
<path d="M142 42 L150 8 L118 30 Z" className="c-hair-s"/><path d="M142 38 L146 16 L126 30 Z" fill="#ffc2e2"/>
<path d="M54 50 Q100 22 146 50" stroke="#5eead4" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.9"/>
<path d="M54 74 l2.4 5 5.4 .7 -4 3.7 1.1 5.4 -4.9 -2.7 -4.9 2.7 1.1 -5.4 -4 -3.7 5.4 -.7 z" fill="#fff" opacity="0.95" transform="translate(4 -6) scale(0.8)"/>
</>
)}
{variant === 'momo' && (
<>
<path d="M36 104 C32 56 64 28 100 28 C136 28 168 56 164 104 C158 88 148 80 136 76 C124 88 110 90 100 76 C90 90 76 88 64 76 C52 80 42 88 36 104 Z" className="c-hair"/>
<path d="M36 104 C30 140 32 176 42 214 C54 196 58 160 56 126 C54 116 46 110 36 104 Z" className="c-hair"/>
<path d="M164 104 C170 140 168 176 158 214 C146 196 142 160 144 126 C146 116 154 110 164 104 Z" className="c-hair"/>
<path d="M56 130 C58 160 54 194 42 214 C50 186 50 160 48 134 Z" className="c-hair-s" opacity="0.6"/>
<path d="M144 130 C142 160 146 194 158 214 C150 186 150 160 152 134 Z" className="c-hair-s" opacity="0.6"/>
<path d="M62 46 C80 34 106 32 128 40" className="s-hair-h" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85"/>
<path d="M42 28 L54 40 L40 46 Z M58 28 L46 40 L60 46 Z" className="c-acc"/><circle cx="50" cy="40" r="5.5" className="c-acc-s"/>
<path d="M158 28 L146 40 L160 46 Z M142 28 L154 40 L140 46 Z" className="c-acc"/><circle cx="150" cy="40" r="5.5" className="c-acc-s"/>
<path d="M120 34 l2 4 4.5 .6 -3.3 3 .9 4.4 -4.1 -2.2 -4.1 2.2 .9 -4.4 -3.3 -3 4.5 -.6 z" fill="#fff7fb" opacity="0.95"/>
</>
)}
  </g>
<g className="arm-wave">
  <path d="M138 176 C147 190 147 202 143 212" className="s-skin" strokeWidth="11" strokeLinecap="round" fill="none"/>
  <circle cx="143" cy="214" r="7.5" className="c-skin"/>
  <ellipse cx="137" cy="173" rx="11.5" ry="10" className="c-out"/>
  <path d="M130 181 Q138 188 145 181" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
</g>
</g>
    </svg>
  );
}
