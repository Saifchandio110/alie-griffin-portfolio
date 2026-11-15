'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { updatePortfolioName } from '@/app/admin/actions';
import { NAME_MAX } from '@/lib/artwork';
import { cardCls, inputCls, labelCls, primaryBtn } from '@/components/admin/styles';
import type { Notify } from '@/components/admin/types';

export default function NameForm({ initialName, notify }: { initialName: string; notify: Notify }) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await updatePortfolioName(name);
      if (result.ok) notify('success', 'Portfolio name saved. The public site now uses it.');
      else notify('error', result.error);
    } catch {
      notify('error', 'Something went wrong. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  const unchanged = name.trim() === initialName.trim();

  return (
    <section className={cardCls} aria-labelledby="name-heading">
      <h2 id="name-heading" className="font-display text-3xl font-semibold text-blush">
        Portfolio name
      </h2>
      <p className="mt-1 text-sm text-lavender">Shown in the header, the browser tab and the footer.</p>
      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="portfolio-name" className={labelCls}>
            Name
          </label>
          <input
            id="portfolio-name"
            type="text"
            maxLength={NAME_MAX}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </div>
        <button type="submit" disabled={saving || unchanged || name.trim().length === 0} className={primaryBtn}>
          {saving ? 'Saving…' : 'Save name'}
        </button>
      </form>
    </section>
  );
}
