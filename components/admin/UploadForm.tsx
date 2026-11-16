'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { uploadWithProgress } from '@/lib/uploadImage';
import { createArtwork } from '@/app/admin/actions';
import {
  CATEGORIES,
  DESCRIPTION_MAX,
  IMAGE_EXTENSIONS,
  MAX_IMAGE_BYTES,
  TITLE_MAX,
} from '@/lib/artwork';
import { cardCls, inputCls, labelCls, primaryBtn } from '@/components/admin/styles';
import type { Notify } from '@/components/admin/types';

export default function UploadForm({ notify }: { notify: Notify }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0].value);
  const [publish, setPublish] = useState(false);
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
    setFile(picked);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    if (!file) {
      setFormError('Choose an image to upload.');
      return;
    }
    if (title.trim().length === 0) {
      setFormError('Add a title.');
      return;
    }

    setBusy(true);
    setProgress(0);
    const supabase = createSupabaseBrowserClient();
    let uploadedPath: string | null = null;
    let created = false;
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Your session has expired. Log in again.');

      const path = `${crypto.randomUUID()}.${IMAGE_EXTENSIONS[file.type]}`;
      await uploadWithProgress(path, file, token, setProgress);
      uploadedPath = path;

      const result = await createArtwork({
        title,
        description,
        category,
        image_path: path,
        is_published: publish,
      });
      if (!result.ok) throw new Error(result.error);
      created = true;

      notify('success', publish ? 'Artwork uploaded and published.' : 'Artwork uploaded as a draft.');
      setFile(null);
      setTitle('');
      setDescription('');
      setCategory(CATEGORIES[0].value);
      setPublish(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed. Try again.';
      setFormError(message);
      notify('error', message);
      if (uploadedPath && !created) {
        // Do not leave an image in storage without a record.
        try {
          await supabase.storage.from('artworks').remove([uploadedPath]);
        } catch {
          // best effort
        }
      }
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <section className={cardCls} aria-labelledby="upload-heading">
      <h2 id="upload-heading" className="font-display text-3xl font-semibold text-blush">
        Upload artwork
      </h2>
      <p className="mt-1 text-sm text-lavender">JPG, PNG, WebP or AVIF, up to 10 MB.</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-5" noValidate>
        <div>
          <label htmlFor="art-file" className={labelCls}>
            Image
          </label>
          <input
            id="art-file"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={busy}
            onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-lavender file:mr-4 file:rounded-full file:border-0 file:bg-orchid/30 file:px-5 file:py-2.5 file:font-semibold file:text-moon hover:file:bg-orchid/50"
          />
          {preview && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview of the selected artwork" className="mx-auto max-h-80 w-auto object-contain" />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="art-title" className={labelCls}>
            Title
          </label>
          <input
            id="art-title"
            type="text"
            maxLength={TITLE_MAX}
            value={title}
            disabled={busy}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="art-desc" className={labelCls}>
            Description
          </label>
          <textarea
            id="art-desc"
            rows={4}
            maxLength={DESCRIPTION_MAX}
            value={description}
            disabled={busy}
            onChange={(e) => setDescription(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="art-category" className={labelCls}>
              Category
            </label>
            <select
              id="art-category"
              value={category}
              disabled={busy}
              onChange={(e) => setCategory(e.target.value)}
              className={inputCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-midnight">
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-3 self-end rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-moon">
            <input
              type="checkbox"
              checked={publish}
              disabled={busy}
              onChange={(e) => setPublish(e.target.checked)}
              className="h-5 w-5 accent-bubblegum"
            />
            Publish right away
          </label>
        </div>

        {progress !== null && (
          <div>
            <div
              role="progressbar"
              aria-label="Upload progress"
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
              {progress < 100 ? `Uploading… ${progress}%` : 'Saving details…'}
            </p>
          </div>
        )}

        {formError && (
          <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {formError}
          </p>
        )}

        <button type="submit" disabled={busy} className={primaryBtn}>
          {busy ? 'Uploading…' : 'Upload artwork'}
        </button>
      </form>
    </section>
  );
}
