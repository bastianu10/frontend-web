'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/services/auth/register';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) { setError('Please fill in all fields'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError(''); setLoading(true);
    try {
      await register(name.trim(), email, password);
      router.replace('/home');
    } catch {
      setError('Could not create account. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = () => showPassword
    ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
    : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Back */}
        <Link href="/login" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-medium mb-6">
          ← Back to Login
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-primary">Create account</h1>
          <p className="text-secondary text-sm mt-1">Start managing your tasks today</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">Name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name" autoComplete="name"
                className="w-full bg-card-2 border border-border rounded-xl px-4 py-3 text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="email"
                className="w-full bg-card-2 border border-border rounded-xl px-4 py-3 text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" autoComplete="new-password"
                  className="w-full bg-card-2 border border-border rounded-xl px-4 py-3 pr-11 text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors text-sm"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors p-1">
                  <EyeIcon />
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password" autoComplete="new-password"
                  className="w-full bg-card-2 border border-border rounded-xl px-4 py-3 pr-11 text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors text-sm"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors p-1">
                  <EyeIcon />
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-xl px-4 py-3 flex items-center gap-2">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-accent text-white font-bold py-3.5 rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <>Create Account <span className="text-base">→</span></>}
            </button>
          </form>
        </div>

        <p className="text-center text-secondary text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-accent font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
