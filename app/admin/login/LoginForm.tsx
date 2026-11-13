'use client';
import { useState } from 'react';

export default function LoginForm() {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !pw) return;
    setBusy(true); setErr('');
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!r.ok || !j.ok) throw new Error(j.error || 'Could not sign in.');
      location.href = '/admin';
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Could not sign in.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="ad-login__form">
      <label>
        <span>Password</span>
        <div>
          <input type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" autoFocus required aria-invalid={!!err} />
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? 'Hide' : 'Show'}</button>
        </div>
      </label>
      <p className="ad-login__err" role="alert">{err}</p>
      <button className="ad-btn ad-btn--gold ad-btn--block" disabled={busy || !pw}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
  );
}
