import { redirect } from 'next/navigation';
import { hasSupabaseEnv } from '@/lib/env';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { DEFAULT_PORTFOLIO_NAME } from '@/lib/settings';
import type { Artwork } from '@/lib/artwork';
import AdminDashboard from '@/components/admin/AdminDashboard';
import SetupNotice from '@/components/admin/SetupNotice';
import { signOutAction } from '@/app/admin/actions';
import { cardCls, smallBtn } from '@/components/admin/styles';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!hasSupabaseEnv) return <SetupNotice />;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (isAdmin !== true) {
    return (
      <div className={`${cardCls} mx-auto mt-10 max-w-md text-center`}>
        <h1 className="font-display text-3xl font-semibold text-blush">No admin access</h1>
        <p className="mt-3 text-lavender">
          {user.email ?? 'This account'} is not set up as an administrator. Run make_admin.sql in
          Supabase with this email, then reload.
        </p>
        <form action={signOutAction} className="mt-6">
          <button type="submit" className={smallBtn}>
            Log out
          </button>
        </form>
      </div>
    );
  }

  const [settingsResult, artworksResult] = await Promise.all([
    supabase.from('portfolio_settings').select('portfolio_name').eq('id', 1).maybeSingle(),
    supabase.from('artworks').select('*').order('created_at', { ascending: false }),
  ]);

  const loadError =
    settingsResult.error || artworksResult.error
      ? 'Some data could not be loaded. Check that schema.sql has been run in Supabase.'
      : null;

  return (
    <AdminDashboard
      email={user.email ?? ''}
      portfolioName={settingsResult.data?.portfolio_name ?? DEFAULT_PORTFOLIO_NAME}
      artworks={(artworksResult.data ?? []) as Artwork[]}
      loadError={loadError}
    />
  );
}
