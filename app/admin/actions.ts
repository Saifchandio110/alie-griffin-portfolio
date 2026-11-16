'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  CATEGORY_VALUES,
  DESCRIPTION_MAX,
  IMAGE_PATH_RE,
  NAME_MAX,
  TITLE_MAX,
  UUID_RE,
  type ActionResult,
} from '@/lib/artwork';
import {
  ABOUT_PHOTO_PATH_RE,
  INTRO_MAX,
  SOCIAL_LABEL_MAX,
  SOCIAL_MAX,
  TAGLINE_MAX,
  hostLabel,
  normalizeUrl,
  type SocialLink,
} from '@/lib/about';

type Fields = { title: string; description: string; category: string };

// Every action re-checks that the caller is a logged-in administrator.
async function getAdminClient() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { error: 'Your session has expired. Log in again.' };
    const { data: isAdmin, error } = await supabase.rpc('is_admin');
    if (error || isAdmin !== true) return { error: 'This account is not an administrator.' };
    return { supabase };
  } catch {
    return { error: 'Supabase is not configured on the server.' };
  }
}

function validateFields(input: Fields): { ok: true; value: Fields } | { ok: false; error: string } {
  const title = typeof input?.title === 'string' ? input.title.trim() : '';
  const description = typeof input?.description === 'string' ? input.description.trim() : '';
  const category = typeof input?.category === 'string' ? input.category : '';
  if (title.length < 1 || title.length > TITLE_MAX) {
    return { ok: false, error: `Enter a title between 1 and ${TITLE_MAX} characters.` };
  }
  if (description.length > DESCRIPTION_MAX) {
    return { ok: false, error: `The description can be up to ${DESCRIPTION_MAX} characters.` };
  }
  if (!CATEGORY_VALUES.includes(category)) {
    return { ok: false, error: 'Choose a category from the list.' };
  }
  return { ok: true, value: { title, description, category } };
}

function refreshPublicSite() {
  revalidatePath('/', 'layout');
}

export async function updatePortfolioName(name: string): Promise<ActionResult> {
  const trimmed = typeof name === 'string' ? name.trim() : '';
  if (trimmed.length < 1 || trimmed.length > NAME_MAX) {
    return { ok: false, error: `Enter a name between 1 and ${NAME_MAX} characters.` };
  }
  const { supabase, error: authError } = await getAdminClient();
  if (!supabase) return { ok: false, error: authError ?? 'Not allowed.' };

  const { data, error } = await supabase
    .from('portfolio_settings')
    .update({ portfolio_name: trimmed })
    .eq('id', 1)
    .select('portfolio_name');
  if (error) return { ok: false, error: 'Could not save the name. Try again.' };
  if (!data || data.length === 0) {
    return { ok: false, error: 'The name was not saved. Check that the SQL setup has been run.' };
  }
  refreshPublicSite();
  return { ok: true };
}

export async function createArtwork(input: {
  title: string;
  description: string;
  category: string;
  image_path: string;
  is_published: boolean;
}): Promise<ActionResult> {
  const fields = validateFields(input);
  if (!fields.ok) return fields;
  if (typeof input.image_path !== 'string' || !IMAGE_PATH_RE.test(input.image_path)) {
    return { ok: false, error: 'The uploaded image path is not valid.' };
  }
  const { supabase, error: authError } = await getAdminClient();
  if (!supabase) return { ok: false, error: authError ?? 'Not allowed.' };

  const { data: pub } = supabase.storage.from('artworks').getPublicUrl(input.image_path);
  const { error } = await supabase.from('artworks').insert({
    title: fields.value.title,
    description: fields.value.description,
    category: fields.value.category,
    image_path: input.image_path,
    image_url: pub.publicUrl,
    is_published: input.is_published === true,
  });
  if (error) return { ok: false, error: 'Could not save the artwork details. Try again.' };
  refreshPublicSite();
  return { ok: true };
}

export async function updateArtwork(id: string, input: Fields): Promise<ActionResult> {
  if (typeof id !== 'string' || !UUID_RE.test(id)) return { ok: false, error: 'Invalid artwork.' };
  const fields = validateFields(input);
  if (!fields.ok) return fields;
  const { supabase, error: authError } = await getAdminClient();
  if (!supabase) return { ok: false, error: authError ?? 'Not allowed.' };

  const { data, error } = await supabase
    .from('artworks')
    .update(fields.value)
    .eq('id', id)
    .select('id');
  if (error) return { ok: false, error: 'Could not save the changes. Try again.' };
  if (!data || data.length === 0) return { ok: false, error: 'That artwork no longer exists.' };
  refreshPublicSite();
  return { ok: true };
}

export async function setArtworkPublished(id: string, published: boolean): Promise<ActionResult> {
  if (typeof id !== 'string' || !UUID_RE.test(id)) return { ok: false, error: 'Invalid artwork.' };
  const { supabase, error: authError } = await getAdminClient();
  if (!supabase) return { ok: false, error: authError ?? 'Not allowed.' };

  const { data, error } = await supabase
    .from('artworks')
    .update({ is_published: published === true })
    .eq('id', id)
    .select('id');
  if (error) return { ok: false, error: 'Could not change the status. Try again.' };
  if (!data || data.length === 0) return { ok: false, error: 'That artwork no longer exists.' };
  refreshPublicSite();
  return { ok: true };
}

export async function deleteArtwork(id: string): Promise<ActionResult> {
  if (typeof id !== 'string' || !UUID_RE.test(id)) return { ok: false, error: 'Invalid artwork.' };
  const { supabase, error: authError } = await getAdminClient();
  if (!supabase) return { ok: false, error: authError ?? 'Not allowed.' };

  const { data, error } = await supabase
    .from('artworks')
    .delete()
    .eq('id', id)
    .select('image_path');
  if (error) return { ok: false, error: 'Could not delete the artwork. Try again.' };
  if (!data || data.length === 0) return { ok: false, error: 'That artwork no longer exists.' };

  const path = String(data[0].image_path ?? '');
  let warning: string | undefined;
  if (IMAGE_PATH_RE.test(path)) {
    const { error: removeError } = await supabase.storage.from('artworks').remove([path]);
    if (removeError) warning = 'The artwork was deleted, but its image file could not be removed.';
  }
  refreshPublicSite();
  return { ok: true, warning };
}

export async function saveAbout(input: {
  tagline: string;
  intro: string;
  socials: SocialLink[];
  photo_path?: string;
  remove_photo?: boolean;
}): Promise<ActionResult> {
  const tagline = typeof input?.tagline === 'string' ? input.tagline.trim() : '';
  const intro = typeof input?.intro === 'string' ? input.intro.trim() : '';
  if (tagline.length > TAGLINE_MAX) return { ok: false, error: `The tagline can be up to ${TAGLINE_MAX} characters.` };
  if (intro.length > INTRO_MAX) return { ok: false, error: `The introduction can be up to ${INTRO_MAX} characters.` };

  const rows = Array.isArray(input?.socials) ? input.socials : [];
  if (rows.length > SOCIAL_MAX) return { ok: false, error: `You can add up to ${SOCIAL_MAX} social links.` };
  const socials: SocialLink[] = [];
  for (const row of rows) {
    const url = typeof row?.url === 'string' ? normalizeUrl(row.url) : null;
    if (!url) return { ok: false, error: 'One of the social links is not a valid web address.' };
    const label = typeof row.label === 'string' && row.label.trim() ? row.label.trim() : hostLabel(url);
    socials.push({ label: label.slice(0, SOCIAL_LABEL_MAX), url });
  }

  const photoPath = input?.photo_path;
  if (photoPath !== undefined && (typeof photoPath !== 'string' || !ABOUT_PHOTO_PATH_RE.test(photoPath))) {
    return { ok: false, error: 'The uploaded photo path is not valid.' };
  }

  const { supabase, error: authError } = await getAdminClient();
  if (!supabase) return { ok: false, error: authError ?? 'Not allowed.' };

  const { data: current, error: readError } = await supabase
    .from('about_content')
    .select('photo_path')
    .eq('id', 1)
    .maybeSingle();
  if (readError || !current) {
    return { ok: false, error: 'About settings are not set up yet. Run about.sql in Supabase first.' };
  }

  const update: Record<string, unknown> = { tagline, intro, socials };
  if (photoPath) {
    const { data: pub } = supabase.storage.from('artworks').getPublicUrl(photoPath);
    update.photo_path = photoPath;
    update.photo_url = pub.publicUrl;
  } else if (input?.remove_photo === true) {
    update.photo_path = null;
    update.photo_url = null;
  }

  const { data, error } = await supabase.from('about_content').update(update).eq('id', 1).select('id');
  if (error || !data || data.length === 0) {
    return { ok: false, error: 'Could not save the About page. Try again.' };
  }

  // Delete the old photo file once it has been replaced or removed.
  const oldPath = typeof current.photo_path === 'string' ? current.photo_path : '';
  let warning: string | undefined;
  if (oldPath && ABOUT_PHOTO_PATH_RE.test(oldPath) && oldPath !== photoPath && (photoPath || input?.remove_photo === true)) {
    const { error: removeError } = await supabase.storage.from('artworks').remove([oldPath]);
    if (removeError) warning = 'Saved, but the old photo file could not be removed.';
  }
  refreshPublicSite();
  return { ok: true, warning };
}

export async function signOutAction(): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Nothing to sign out of if Supabase is not configured.
  }
  redirect('/admin/login');
}
