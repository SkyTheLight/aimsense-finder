'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { DesktopPageShell } from '@/components/layout/DesktopPageShell';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const nextTheme = window.localStorage.getItem('truesens-theme') as 'dark' | 'light' | null;
    const resolved = nextTheme === 'light' || nextTheme === 'dark' ? nextTheme : 'dark';
    setTheme(resolved);
    document.documentElement.dataset.theme = resolved;
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      window.localStorage.setItem('truesens-theme', next);
      return next;
    });
  };

  const handleLogin = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/?wizard=true' });
  };

  return (
    <DesktopPageShell
      theme={theme}
      onToggleTheme={toggleTheme}
      eyebrow="Account Access"
      title="Sign in to save your calibration history."
      description="Nothing about the calibration flow changes. Signing in only unlocks saved settings, history tracking, and shareable profile pages."
      backHref="/"
      backLabel="Back to finder"
    >
      <div className="grid grid-cols-[1.15fr_0.85fr] gap-8">
        <section className="rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--app-accent)]">
            <ShieldCheck className="h-4 w-4" />
            Secure account linking
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[var(--app-text-primary)]">
            Keep your settings, benchmark history, and profile in one place.
          </h2>
          <div className="mt-8 grid gap-4">
            {[
              'Save your current and historical sensitivities',
              'Create a public profile link to share your setup',
              'Keep your calibration progress tied to your account',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 text-sm text-[var(--app-text-secondary)]">
                <Sparkles className="h-4 w-4 shrink-0 text-[var(--app-accent)]" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-[var(--app-border-strong)] bg-[var(--app-surface)] p-8 shadow-[0_24px_80px_rgba(2,6,23,0.12)]">
          <div className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--app-text-muted)]">Google Sign-In</div>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[var(--app-text-primary)]">Continue to TrueSens</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--app-text-secondary)]">
            Use Google to preserve your setup data. If you prefer not to sign in, you can still use the finder as a guest from the homepage.
          </p>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-between rounded-2xl border border-[var(--app-border-strong)] bg-[var(--app-surface)] px-5 py-4 text-left text-[var(--app-text-primary)] shadow-[0_16px_40px_rgba(2,6,23,0.10)] transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-70"
          >
            <div className="flex items-center gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.38-1.36-.38-2.09s.16-1.43.38-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <div>
                <div className="text-sm font-semibold">{loading ? 'Signing in...' : 'Continue with Google'}</div>
                <div className="text-xs text-[var(--app-text-secondary)]">Secure OAuth authentication</div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-6 text-xs leading-6 text-[var(--app-text-muted)]">
            By signing in, you agree to the <a href="/terms" className="text-[var(--app-accent)]">Terms</a> and <a href="/privacy" className="text-[var(--app-accent)]">Privacy Policy</a>.
          </p>
        </section>
      </div>
    </DesktopPageShell>
  );
}
