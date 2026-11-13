import { authConfigured } from '@/lib/auth';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="ad-login">
      <div className="ad-login__card">
        <div className="ad-login__brand"><svg aria-hidden="true" width="44" height="44"><use href="#i-mark" /></svg><b>HIGHLAND</b><small>CAPITALS · ADMIN</small></div>
        <h1>Sign in</h1>
        <p>Manage leads and see how your site is performing.</p>
        {authConfigured() ? <LoginForm /> : (
          <div className="ad-banner ad-banner--err" role="alert">Admin isn&apos;t configured yet. Set <code>ADMIN_PASSWORD</code> and <code>ADMIN_SECRET</code> (32+ characters) in your environment and restart.</div>
        )}
      </div>
    </main>
  );
}
