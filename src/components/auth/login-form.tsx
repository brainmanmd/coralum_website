'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'Unable to sign in');
        setLoading(false);
        return;
      }

      const next = searchParams.get('next') || '/dashboard';
      router.push(next);
      router.refresh();
    } catch {
      setError('Unable to sign in. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl border border-[#EAE7DE] bg-white p-8 shadow-[0_6px_26px_rgba(16,36,61,0.06)]"
    >
      <h1 className="font-serif text-2xl font-semibold text-[#10243D]">Clinician sign in</h1>
      <p className="mt-1 text-sm text-[#51677C]">Sign in to review patient medication recommendations.</p>

      <div className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[#51677C]">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-[10px] border border-[#D8D4CA] px-3 py-2.5 text-sm text-[#10243D]"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[#51677C]">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-[10px] border border-[#D8D4CA] px-3 py-2.5 text-sm text-[#10243D]"
          />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-[#C2453B]">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-[#10243D] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1C3959] disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
