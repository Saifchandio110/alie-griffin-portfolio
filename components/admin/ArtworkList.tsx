'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { deleteArtwork, setArtworkPublished, updateArtwork } from '@/app/admin/actions';
import {
  CATEGORIES,
  DESCRIPTION_MAX,
  TITLE_MAX,
  categoryLabel,
  formatDate,
  type Artwork,
} from '@/lib/artwork';
import Modal from '@/components/admin/Modal';
import {
  cardCls,
  dangerBtn,
  inputCls,
  labelCls,
  primaryBtn,
  smallBtn,
} from '@/components/admin/styles';
import type { Notify } from '@/components/admin/types';

function EditForm({
  artwork,
  notify,
  onDone,
}: {
  artwork: Artwork;
  notify: Notify;
  onDone: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(artwork.title);
  const [description, setDescription] = useState(artwork.description);
  const [category, setCategory] = useState(artwork.category);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const result = await updateArtwork(artwork.id, { title, description, category });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      notify('success', 'Artwork details saved.');
      router.refresh();
      onDone();
    } catch {
      setError('Something went wrong. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="edit-title" className={labelCls}>
          Title
        </label>
        <input
          id="edit-title"
          type="text"
          maxLength={TITLE_MAX}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="edit-desc" className={labelCls}>
          Description
        </label>
        <textarea
          id="edit-desc"
          rows={5}
          maxLength={DESCRIPTION_MAX}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="edit-category" className={labelCls}>
          Category
        </label>
        <select
          id="edit-category"
          value={category}
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
      {error && (
        <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3 pt-1">
        <button type="submit" disabled={saving} className={primaryBtn}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button type="button" onClick={onDone} disabled={saving} className={smallBtn}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function ArtworkList({ artworks, notify }: { artworks: Artwork[]; notify: Notify }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState<Artwork | null>(null);
  const [editing, setEditing] = useState<Artwork | null>(null);
  const [deleting, setDeleting] = useState<Artwork | null>(null);

  async function togglePublished(art: Artwork) {
    setBusyId(art.id);
    try {
      const result = await setArtworkPublished(art.id, !art.is_published);
      if (result.ok) {
        notify('success', art.is_published ? 'Artwork unpublished.' : 'Artwork published.');
        router.refresh();
      } else {
        notify('error', result.error);
      }
    } catch {
      notify('error', 'Something went wrong. Check your connection and try again.');
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete(art: Artwork) {
    setBusyId(art.id);
    try {
      const result = await deleteArtwork(art.id);
      if (result.ok) {
        notify(result.warning ? 'error' : 'success', result.warning ?? 'Artwork deleted.');
        setDeleting(null);
        router.refresh();
      } else {
        notify('error', result.error);
      }
    } catch {
      notify('error', 'Something went wrong. Check your connection and try again.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className={cardCls} aria-labelledby="list-heading">
      <h2 id="list-heading" className="font-display text-3xl font-semibold text-blush">
        Your artwork <span className="text-lavender">({artworks.length})</span>
      </h2>

      {artworks.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/20 px-6 py-12 text-center">
          <p className="font-display text-2xl text-moon">No artwork uploaded yet.</p>
          <p className="mt-2 text-sm text-lavender">
            Use the form above to add the first piece. Drafts stay hidden until you publish them.
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-4">
          {artworks.map((art) => (
            <li
              key={art.id}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row"
            >
              <button
                type="button"
                onClick={() => setPreviewing(art)}
                aria-label={`Preview ${art.title}`}
                className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-black/40 sm:h-28 sm:w-28"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={art.image_url} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-lg font-bold text-moon">{art.title}</h3>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                      art.is_published
                        ? 'bg-emerald-400/20 text-emerald-200'
                        : 'bg-white/10 text-lavender'
                    }`}
                  >
                    {art.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-lavender">
                  {categoryLabel(art.category)} · Uploaded {formatDate(art.created_at)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setPreviewing(art)} className={smallBtn}>
                    Preview
                  </button>
                  <button type="button" onClick={() => setEditing(art)} className={smallBtn}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePublished(art)}
                    disabled={busyId === art.id}
                    className={smallBtn}
                  >
                    {art.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(art)}
                    disabled={busyId === art.id}
                    className={dangerBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {previewing && (
        <Modal title={previewing.title} onClose={() => setPreviewing(null)} wide>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewing.image_url}
            alt={previewing.title}
            className="mx-auto max-h-[60dvh] w-auto max-w-full rounded-2xl object-contain"
          />
          <p className="mt-4 text-sm text-lavender">
            {categoryLabel(previewing.category)} · Uploaded {formatDate(previewing.created_at)} ·{' '}
            {previewing.is_published ? 'Published' : 'Draft'}
          </p>
          {previewing.description && (
            <p className="mt-3 whitespace-pre-line text-moon">{previewing.description}</p>
          )}
        </Modal>
      )}

      {editing && (
        <Modal title="Edit artwork" onClose={() => setEditing(null)}>
          <EditForm artwork={editing} notify={notify} onDone={() => setEditing(null)} />
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete this artwork?" onClose={() => setDeleting(null)}>
          <p className="text-moon">
            “{deleting.title}” and its image will be removed permanently. This cannot be undone.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              autoFocus
              onClick={() => setDeleting(null)}
              disabled={busyId === deleting.id}
              className={smallBtn}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => confirmDelete(deleting)}
              disabled={busyId === deleting.id}
              className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-400 disabled:opacity-50"
            >
              {busyId === deleting.id ? 'Deleting…' : 'Delete artwork'}
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
