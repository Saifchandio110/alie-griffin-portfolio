import { cardCls } from '@/components/admin/styles';

export default function SetupNotice() {
  return (
    <div className={`${cardCls} mx-auto max-w-xl`}>
      <h1 className="font-display text-3xl font-semibold text-blush">Supabase is not connected yet</h1>
      <p className="mt-3 text-lavender">
        Add these two environment variables in Vercel (Project Settings, then Environment Variables),
        then redeploy:
      </p>
      <ul className="mt-4 space-y-2 font-mono text-sm text-moon">
        <li className="rounded-lg bg-white/5 px-3 py-2">NEXT_PUBLIC_SUPABASE_URL</li>
        <li className="rounded-lg bg-white/5 px-3 py-2">NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
      </ul>
      <p className="mt-4 text-sm text-lavender/80">
        Use your Project URL and your publishable key (it starts with sb_publishable_).
      </p>
    </div>
  );
}
