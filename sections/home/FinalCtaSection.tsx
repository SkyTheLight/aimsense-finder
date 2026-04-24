'use client';

import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react';

interface FinalCtaSectionProps {
  onStart: () => void;
}

export function FinalCtaSection({ onStart }: FinalCtaSectionProps) {
  return (
    <section className="rounded-[40px] border border-[var(--app-border-strong)] bg-[linear-gradient(135deg,var(--app-surface),var(--app-surface-soft))] p-8 shadow-[0_24px_80px_rgba(2,6,23,0.12)] sm:p-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 text-sm font-medium text-[var(--app-text-secondary)]">
          <LockKeyhole className="h-4 w-4 text-[var(--app-accent)]" />
          No account required to start
        </div>

        <h2 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-[var(--app-text-primary)] sm:text-5xl">
          Start the calibration flow now, and decide with more confidence in the next three minutes.
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--app-text-secondary)]">
          The goal is not more settings experimentation. The goal is a cleaner decision, backed by structure, that you can commit to.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[var(--app-accent)] px-7 py-4 text-base font-semibold text-white shadow-[0_20px_40px_rgba(14,165,233,0.26)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          <Sparkles className="h-4 w-4" />
          Launch calibration
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
