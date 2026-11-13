import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminApp from '@/components/admin/AdminApp';
import { COOKIE, verifySession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // The proxy already gates this route; re-check here so the page is never rendered without a valid session.
  if (!(await verifySession((await cookies()).get(COOKIE)?.value))) redirect('/admin/login');
  return <AdminApp />;
}
