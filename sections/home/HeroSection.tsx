'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, TimerReset, Trophy } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
}

const heroStats = [
  { value: '50K+', label: 'Calibrations completed' },
  { value: '4.9/5', label: 'Average player rating' },
  { value: '98%', label: 'Users who keep their new sens' },
];

const quickProof = [
  { icon: ShieldCheck, label: 'Built on PSA logic and benchmark weighting' },
  { icon: TimerReset, label: 'Complete your calibration in under 3 minutes' },
  { icon: Trophy, label: 'Tuned for Valorant and CS2 competitive play' },
];

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-[var(--app-border)] bg-[var(--app-surface-hero)] px-6 py-10 shadow-[0_30px_120px_rgba(2,6,23,0.12)] sm:px-8 lg:px-12 lg:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_36%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.14),transparent_28%)]" />
      <div
        className="pointer-events-none absolute inset-x-16 top-0 h-px opacity-70"
        style={{ background: 'linear-gradient(90deg, transparent, var(--app-accent), transparent)' }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--app-border-strong)] bg-[var(--app-surface)] px-4 py-2 text-sm font-medium text-[var(--app-text-secondary)]"
        >
          <Sparkles className="h-4 w-4 text-[var(--app-accent)]" />
          Sensitivity calibration for players who hate guessing
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-5xl text-5xl font-semibold tracking-[-0.06em] text-[var(--app-text-primary)] sm:text-6xl lg:text-7xl"
        >
          A premium aim tuning workflow that turns chaotic settings changes into a repeatable system.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-6 max-w-3xl text-base leading-8 text-[var(--app-text-secondary)] sm:text-lg"
        >
          TrueSens combines your current setup, pro-range benchmarks, PSA narrowing, and skill-weighted feedback
          into one guided calibration flow designed to feel precise, fast, and trustworthy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex w-full max-w-xl flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <button
            type="button"
            onClick={onStart}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--app-accent)] px-6 py-4 text-base font-semibold text-white shadow-[0_20px_40px_rgba(14,165,233,0.28)] transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
          >
            Start my calibration
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="#method"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-[var(--app-border-strong)] bg-[var(--app-surface)] px-6 py-4 text-base font-medium text-[var(--app-text-primary)] transition-colors hover:bg-[var(--app-surface-soft)] sm:w-auto"
          >
            See how it works
          </a>
        </motion.div>

        <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
          {heroStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.24 + index * 0.05 }}
              className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-6 text-center"
            >
              <div className="text-3xl font-semibold tracking-[-0.05em] text-[var(--app-text-primary)]">{stat.value}</div>
              <div className="mt-1 text-sm text-[var(--app-text-muted)]">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-3 lg:grid-cols-3">
          {quickProof.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 + index * 0.05 }}
              className="flex items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-4 text-left"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-sm leading-6 text-[var(--app-text-secondary)]">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
