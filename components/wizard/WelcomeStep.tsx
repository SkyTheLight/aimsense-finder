'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { HeroSection } from '@/sections/home/HeroSection';
import { TrustSection } from '@/sections/home/TrustSection';
import { WorkflowSection } from '@/sections/home/WorkflowSection';
import { FeatureGridSection } from '@/sections/home/FeatureGridSection';
import { FinalCtaSection } from '@/sections/home/FinalCtaSection';

interface WelcomeStepProps {
  onStart: () => void;
}

const credibility = [
  'Trust-worthy framework',
  'No signup required to begin',
  'Built for competitive FPS players',
];

export function WelcomeStep({ onStart }: WelcomeStepProps) {
  const { data: session } = useSession();
  const [showOptions, setShowOptions] = useState(false);

  const identity = useMemo(() => {
    if (session?.user?.name) {
      return `Continue as ${session.user.name}`;
    }
    return 'Save results with your account';
  }, [session?.user?.name]);

  const handleSignIn = async (provider: string) => {
    await signIn(provider, { callbackUrl: '/?wizard=true' });
  };

  return (
    <>
      <div className="flex w-full flex-col space-y-8">
        <HeroSection onStart={() => setShowOptions(true)} />
        <TrustSection />
        <WorkflowSection />
        <FeatureGridSection />
        <FinalCtaSection onStart={() => setShowOptions(true)} />
      </div>

      <AnimatePresence>
        {showOptions && (
          <>
            <motion.button
              type="button"
              aria-label="Close start options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOptions(false)}
              className="fixed inset-0 z-50 bg-[rgba(2,6,23,0.64)] backdrop-blur-md"
            />
            <motion.aside
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="fixed left-1/2 top-1/2 z-[60] w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-[32px] border border-[var(--app-border-strong)] bg-[var(--app-surface)] p-8 shadow-[0_40px_120px_rgba(2,6,23,0.28)]"
            >
              <div className="space-y-6 rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--app-accent)]">
                  Start Flow
                </div>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--app-text-primary)]">
                  Enter the calibration experience your way.
                </h2>
                <p className="text-sm leading-7 text-[var(--app-text-secondary)]">
                  You can begin immediately as a guest, or sign in with Google to save settings, track history,
                  and share your profile later.
                </p>

                <div className="grid gap-4">
                  <button
                    type="button"
                    onClick={onStart}
                    className="group flex items-center justify-between rounded-2xl bg-[var(--app-accent)] px-5 py-4 text-left text-white shadow-[0_20px_40px_rgba(14,165,233,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="text-base font-semibold">Continue as guest</div>
                      <div className="text-sm text-white/80">Fastest path. Start calibrating now.</div>
                    </div>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSignIn('google')}
                    className="flex items-center justify-between rounded-2xl border border-[var(--app-border-strong)] bg-white px-5 py-4 text-left text-slate-900 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="text-base font-semibold">Continue with Google</div>
                      <div className="text-sm text-slate-600">{identity}</div>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.38-1.36-.38-2.09s.16-1.43.38-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {credibility.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-3 text-sm text-[var(--app-text-secondary)]"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--app-accent)]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--app-text-muted)]">
                  <ShieldCheck className="h-4 w-4 text-[var(--app-accent)]" />
                  Data stays tied to your account only if you choose to sign in
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
