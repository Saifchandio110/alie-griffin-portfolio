'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { uploadWithProgress } from '@/lib/uploadImage';
import { saveAbout } from '@/app/admin/actions';
import { IMAGE_EXTENSIONS, MAX_IMAGE_BYTES } from '@/lib/artwork';
import {
  INTRO_MAX,
  SOCIAL_LABEL_MAX,
  SOCIAL_MAX,
  SOCIAL_URL_MAX,
  TAGLINE_MAX,
  hostLabel,
  normalizeUrl,
  type AboutContent,
  type SocialLink,
} from '@/lib/about';
import { cardCls, dangerBtn, inputCls, labelCls, primaryBtn, smallBtn } from '@/components/admin/styles';
import type { Notify } from '@/components/admin/types';

export default function AboutForm({
  initial,
  ready,
  notify,
}: {
  initial: AboutContent;
  ready: boolean;
  notify: Notify;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [tagline, setTagline] = useState(initial.tagline);
  const [intro, setIntro] = useState(initial.intro);
  const [socials, setSocials] = useState<SocialLink[]>(initial.socials);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function onPickFile(picked: File | null) {
    setFormError(null);
    if (!picked) {
      setFile(null);
      return;
    }
    if (!IMAGE_EXTENSIONS[picked.type]) {
      setFile(null);
      setFormError('Use a JPG, PNG, WebP or AVIF image.');
      return;
    }
    if (picked.size > MAX_IMAGE_BYTES) {
      setFile(null);
      setFormError('That image is larger than 10 MB. Export a smaller version.');
      return;
    }
    setRemovePhoto(false);
    setFile(picked);
  }

  function updateSocial(index: number, patch: Partial<SocialLink>) {
    setSocials((list) => list.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const cleaned: SocialLink[] = [];
    for (const row of socials) {
      const label = row.label.trim();
      const url = row.url.trim();
      if (!label && !url) continue;
      const normalized = normalizeUrl(url);
      if (!normalized) {
        setFormError(`“${label || url || 'A link'}” needs a valid web address.`);
        return;
      }
      cleaned.push({ label: label || hostLabel(normalized), url: normalized });
    }

    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    let uploaded: string | null = null;
    let saved = false;
    try {
      let photoPath: string | undefined;
      if (file) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new Error('Your session has expired. Log in again.');
        const path = `about/${crypto.randomUUID()}.${IMAGE_EXTENSIONS[file.type]}`;
        setProgress(0);
        await uploadWithProgress(path, file, token, setProgress);
        uploaded = path;
        photoPath = path;
      }
      const result = await saveAbout({
        tagline,
        intro,
        socials: cleaned,
        photo_path: photoPath,
        remove_photo: removePhoto && !file,
      });
      if (!result.ok) throw new Error(result.error);
      saved = true;
      notify('success', 'About page saved. The public page is updated.');
      setFile(null);
      setRemovePhoto(false);
      if (fileRef.current) fileRef.current.value = '';
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save. Try again.';
      setFormError(message);
      notify('error', message);
      if (uploaded && !saved) {
        try {
          await supabase.storage.from('artworks').remove([uploaded]);
        } catch {
          // best effort
        }
      }
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  const currentPhoto = removePhoto ? null : initial.photo_url;

  return (
    <section className={cardCls} aria-labelledby="about-heading">
      <h2 id="about-heading" className="font-display text-3xl font-semibold text-blush">
        About page
      </h2>
      <p className="mt-1 text-sm text-lavender">
        Everything on the About page: photo, tagline, introduction and social links.
      </p>

      {!ready && (
        <p role="alert" className="mt-4 rounded-xl border border-amber-300/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          The About settings are not set up in the database yet. Run about.sql in the Supabase SQL Editor, then
          reload this page.
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-5 space-y-6" noValidate>
        <div>
          <span className={labelCls}>Profile photo</span>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-28 w-24 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black/30 text-center text-xs text-lavender">
              {preview || currentPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview ?? currentPhoto ?? ''} alt="Profile photo preview" className="h-full w-full object-cover" />
              ) : (
                'No photo'
              )}
            </div>
            <div className="space-y-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={busy || !ready}
                onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                className="block text-sm text-lavender file:mr-4 file:rounded-full file:border-0 file:bg-orchid/30 file:px-5 file:py-2.5 file:font-semibold file:text-moon hover:file:bg-orchid/50"
              />
              {initial.photo_url && !file && (
                <button
                  type="button"
                  disabled={busy || !ready}
                  onClick={() => setRemovePhoto((v) => !v)}
                  className={removePhoto ? smallBtn : dangerBtn}
                >
                  {removePhoto ? 'Keep the current photo' : 'Remove photo'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="about-tagline" className={labelCls}>
            Tagline (shown under the name)
          </label>
          <input
            id="about-tagline"
            type="text"
            maxLength={TAGLINE_MAX}
            value={tagline}
            disabled={busy || !ready}
            onChange={(e) => setTagline(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="about-intro" className={labelCls}>
            Introduction
          </label>
          <textarea
            id="about-intro"
            rows={7}
            maxLength={INTRO_MAX}
            value={intro}
            disabled={busy || !ready}
            onChange={(e) => setIntro(e.target.value)}
            className={inputCls}
          />
          <p className="mt-1 text-xs text-lavender/80">
            {intro.length} / {INTRO_MAX}. Line breaks are kept.
          </p>
        </div>

        <div>
          <span className={labelCls}>Social links (up to {SOCIAL_MAX})</span>
          <ul className="space-y-3">
            {socials.map((s, i) => (
              <li key={i} className="grid gap-2 sm:grid-cols-[10rem_1fr_auto]">
                <input
                  type="text"
                  aria-label={`Link ${i + 1} name`}
                  placeholder="Name (e.g. Instagram)"
                  maxLength={SOCIAL_LABEL_MAX}
                  value={s.label}
                  disabled={busy || !ready}
                  onChange={(e) => updateSocial(i, { label: e.target.value })}
                  className={inputCls}
                />
                <input
                  type="text"
                  inputMode="url"
                  aria-label={`Link ${i + 1} address`}
                  placeholder="https://..."
                  maxLength={SOCIAL_URL_MAX}
                  value={s.url}
                  disabled={busy || !ready}
                  onChange={(e) => updateSocial(i, { url: e.target.value })}
                  className={inputCls}
                />
                <button
                  type="button"
                  disabled={busy || !ready}
                  onClick={() => setSocials((list) => list.filter((_, idx) => idx !== i))}
                  className={dangerBtn}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {socials.length < SOCIAL_MAX && (
            <button
              type="button"
              disabled={busy || !ready}
              onClick={() => setSocials((list) => [...list, { label: '', url: '' }])}
              className={`${smallBtn} mt-3`}
            >
              + Add a link
            </button>
          )}
        </div>

        {progress !== null && (
          <div>
            <div
              role="progressbar"
              aria-label="Photo upload progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="h-3 overflow-hidden rounded-full bg-white/10"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-bubblegum to-orchid transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-lavender">
              {progress < 100 ? `Uploading photo… ${progress}%` : 'Saving…'}
            </p>
          </div>
        )}

        {formError && (
          <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {formError}
          </p>
        )}

        <button type="submit" disabled={busy || !ready} className={primaryBtn}>
          {busy ? 'Saving…' : 'Save About page'}
        </button>
      </form>
    </section>
  );
}
