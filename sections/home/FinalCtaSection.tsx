'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FinalCtaSectionProps {
  onStart: () => void;
}

export function FinalCtaSection({ onStart }: FinalCtaSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface)] p-12 py-24 text-center space-y-10"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.08),transparent_60%)]" />
      </div>

      <div className="relative space-y-6">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--app-accent)]">Get Started</div>
        <h2 className="text-4xl font-bold tracking-[-0.03em] text-[var(--app-text-primary)]">Ready to find your sens?</h2>
        <p className="text-base leading-7 text-[var(--app-text-secondary)] max-w-md mx-auto">Get your personalized sensitivity recommendation in 3 minutes.</p>
      </div>

      <div className="relative">
        <button
          onClick={onStart}
          className="group inline-flex items-center gap-2 rounded-2xl bg-[var(--app-accent)] px-8 py-4 text-base font-semibold text-white shadow-[0_20px_40px_rgba(14,165,233,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(14,165,233,0.28)]"
        >
          <Sparkles className="h-5 w-5" />
          Start calibration
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.section>
  );
}

