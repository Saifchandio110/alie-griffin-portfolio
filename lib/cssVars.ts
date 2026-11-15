import type { CSSProperties } from 'react';

/** Builds an inline style that can include CSS custom properties (like --d) without type errors. */
export function cssVars(style: CSSProperties, vars: Record<string, string | number>): CSSProperties {
  return { ...style, ...(vars as unknown as CSSProperties) };
}
