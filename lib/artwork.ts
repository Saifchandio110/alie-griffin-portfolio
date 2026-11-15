export const CATEGORIES = [
  { value: 'illustration', label: 'Illustration' },
  { value: 'painting', label: 'Painting' },
  { value: 'character', label: 'Character art' },
  { value: 'sketch', label: 'Sketch' },
  { value: 'other', label: 'Other' },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]['value'];

export const CATEGORY_VALUES: readonly string[] = CATEGORIES.map((c) => c.value);

export function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? 'Other';
}

export type Artwork = {
  id: string;
  title: string;
  description: string;
  category: string;
  image_path: string;
  image_url: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ActionResult = { ok: true; warning?: string } | { ok: false; error: string };

export const TITLE_MAX = 120;
export const DESCRIPTION_MAX = 2000;
export const NAME_MAX = 60;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export const IMAGE_PATH_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|avif)$/;
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
