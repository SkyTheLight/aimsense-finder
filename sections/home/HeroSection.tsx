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
    <section className="relative overflow-hidden rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface)] p-12 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.08),transparent_60%)]" />
      </div>

      <div className="relative flex flex-col items-center text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-1.5 text-sm text-[var(--app-text-secondary)]"
        >
          <Sparkles className="h-4 w-4 text-[var(--app-accent)]" />
          <span>Sensitivity calibration</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl font-bold tracking-[-0.03em] text-[var(--app-text-primary)]"
        >
          Find Your <span className="text-[var(--app-accent)]">Perfect Sensitivity</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl text-lg leading-8 text-[var(--app-text-secondary)]"
        >
          Combine your setup, pro benchmarks, and AI feedback into one guided calibration flow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 rounded-2xl bg-[var(--app-accent)] px-8 py-4 text-base font-semibold text-white shadow-[0_20px_40px_rgba(14,165,233,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(14,165,233,0.28)]"
          >
            Start calibration
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        <div className="flex gap-5 pt-4">
          {heroStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
              className="rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-10 py-5 text-center space-y-2 transition-colors hover:border-[var(--app-border-accent)]"
            >
              <div className="text-2xl font-bold tracking-[-0.02em] text-[var(--app-text-primary)]">{stat.value}</div>
              <div className="text-sm text-[var(--app-text-muted)]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

