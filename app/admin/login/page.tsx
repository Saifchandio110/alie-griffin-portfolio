import { hasSupabaseEnv } from '@/lib/env';
import LoginForm from '@/components/admin/LoginForm';
import SetupNotice from '@/components/admin/SetupNotice';
import { cardCls } from '@/components/admin/styles';

export default function AdminLoginPage() {
  if (!hasSupabaseEnv) return <SetupNotice />;
  return (
    <div className={`${cardCls} mx-auto mt-10 max-w-md`}>
      <h1 className="font-display text-4xl font-semibold text-blush">Admin login</h1>
      <p className="mb-6 mt-2 text-sm text-lavender">Only the site owner can sign in here.</p>
      <LoginForm />
    </div>
  );
}
