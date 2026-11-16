export type SocialLink = { label: string; url: string };

export type AboutContent = {
  tagline: string;
  intro: string;
  photo_url: string | null;
  socials: SocialLink[];
};

export const DEFAULT_ABOUT: AboutContent = {
  tagline: 'Digital illustrations and paintings',
  intro: '',
  photo_url: null,
  socials: [],
};

export const TAGLINE_MAX = 120;
export const INTRO_MAX = 4000;
export const SOCIAL_MAX = 8;
export const SOCIAL_LABEL_MAX = 40;
export const SOCIAL_URL_MAX = 300;

export const ABOUT_PHOTO_PATH_RE =
  /^about\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|avif)$/;

/** Accepts web addresses and email links only. Adds https:// when it is missing. Returns null if unsafe or invalid. */
export function normalizeUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t || t.length > SOCIAL_URL_MAX) return null;
  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`;
  try {
    const u = new URL(withProtocol);
    if (!['https:', 'http:', 'mailto:'].includes(u.protocol)) return null;
    if (u.protocol !== 'mailto:' && !u.hostname.includes('.')) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function hostLabel(url: string): string {
  try {
    const u = new URL(url);
    return u.protocol === 'mailto:' ? 'Email' : u.hostname.replace(/^www\./, '');
  } catch {
    return 'Link';
  }
}

/** Turns whatever the database returns into safe, well-formed About content. */
export function parseAbout(row: unknown): AboutContent {
  if (!row || typeof row !== 'object') return DEFAULT_ABOUT;
  const r = row as Record<string, unknown>;
  const socials: SocialLink[] = [];
  if (Array.isArray(r.socials)) {
    for (const item of r.socials) {
      if (!item || typeof item !== 'object') continue;
      const s = item as Record<string, unknown>;
      const url = typeof s.url === 'string' ? normalizeUrl(s.url) : null;
      if (!url) continue;
      const label = typeof s.label === 'string' && s.label.trim() ? s.label.trim() : hostLabel(url);
      socials.push({ label: label.slice(0, SOCIAL_LABEL_MAX), url });
      if (socials.length >= SOCIAL_MAX) break;
    }
  }
  return {
    tagline: typeof r.tagline === 'string' ? r.tagline : DEFAULT_ABOUT.tagline,
    intro: typeof r.intro === 'string' ? r.intro : '',
    photo_url: typeof r.photo_url === 'string' && r.photo_url ? r.photo_url : null,
    socials,
  };
}
