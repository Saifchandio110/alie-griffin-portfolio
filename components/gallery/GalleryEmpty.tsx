export default function GalleryEmpty({ status }: { status: 'ok' | 'error' | 'unconfigured' }) {
  if (status === 'error') {
    return (
      <div className="glass rounded-3xl p-10 text-center">
        <p className="font-display text-3xl text-moon">The gallery could not load.</p>
        <p className="mx-auto mt-3 max-w-md text-lavender">
          Something went wrong while fetching the artwork. Refresh the page in a moment.
        </p>
      </div>
    );
  }
  if (status === 'unconfigured') {
    return (
      <div className="glass rounded-3xl p-10 text-center">
        <p className="font-display text-3xl text-moon">The gallery is not connected yet.</p>
        <p className="mx-auto mt-3 max-w-md text-lavender">
          The site owner still needs to connect the database. Check back soon.
        </p>
      </div>
    );
  }
  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className={`flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-lavender/40 bg-white/[0.03] text-center ${
              i === 2 ? 'hidden md:flex' : ''
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-bubblegum" fill="currentColor">
              <path d="M12 2l1.8 5.7L19.5 9l-5.7 1.8L12 16.5l-1.8-5.7L4.5 9l5.7-1.3L12 2zm7 11l.9 2.6 2.6.9-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13z" />
            </svg>
            <span className="text-sm font-semibold text-lavender">Artwork placeholder</span>
          </li>
        ))}
      </ul>
      <div className="glass mt-8 rounded-3xl p-8 text-center">
        <p className="font-display text-3xl text-moon">No artwork has been published yet.</p>
        <p className="mx-auto mt-2 max-w-md text-lavender">
          New pieces will appear here as soon as they are uploaded and published.
        </p>
      </div>
    </div>
  );
}
