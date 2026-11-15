export default function SiteFooter({ name }: { name: string }) {
  return (
    <footer className="mt-24 border-t border-white/10 px-5 py-10 text-center text-sm text-lavender/80">
      <p>
        © {new Date().getFullYear()} {name}. All artwork belongs to the artist.
      </p>
    </footer>
  );
}
