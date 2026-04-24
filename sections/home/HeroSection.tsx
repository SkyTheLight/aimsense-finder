'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
}

const heroStats = [
  { value: '50K+', label: 'Calibrations completed' },
  { value: '4.9/5', label: 'Average player rating' },
  { value: '98%', label: 'Users who keep their new sens' },
];

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-12 py-20">
      <div className="relative flex flex-col items-center text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-1.5 text-sm text-[var(--app-text-secondary)]"
        >
          <Sparkles className="h-4 w-4 text-[var(--app-accent)]" />
          <span>Sensitivity calibration</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl font-bold text-[var(--app-text-primary)]"
        >
          Find Your <span className="text-[var(--app-accent)]">Perfect Sensitivity</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="max-w-lg text-lg leading-relaxed text-[var(--app-text-secondary)]"
        >
          Combine your setup, pro benchmarks, and AI feedback into one guided calibration flow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex gap-4"
        >
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent)] px-6 py-3 text-white font-medium hover:opacity-90"
          >
            Start calibration
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        <div className="flex gap-5 mt-6">
          {heroStats.map((stat, i) => (
            <div key={i} className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-10 py-5 text-center space-y-2 transition-colors hover:bg-[var(--app-surface-soft)]">
              <div className="text-xl font-bold text-[var(--app-text-primary)]">{stat.value}</div>
              <div className="text-sm text-[var(--app-text-muted)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}