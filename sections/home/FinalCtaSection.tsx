'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

interface FinalCtaSectionProps {
  onStart: () => void;
}

export function FinalCtaSection({ onStart }: FinalCtaSectionProps) {
  return (
    <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-[var(--app-text-primary)]">Ready to find your sens?</h2>
        <p className="text-sm text-[var(--app-text-secondary)]">Get your personalized sensitivity recommendation in 3 minutes.</p>
      </div>
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent)] px-6 py-3 text-white font-medium hover:opacity-90"
      >
        <Sparkles className="h-4 w-4" />
        Start calibration
        <ArrowRight className="h-4 w-4" />
      </button>
    </section>
  );
}