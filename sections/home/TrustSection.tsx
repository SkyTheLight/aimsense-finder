'use client';

import { motion } from 'framer-motion';
import { Activity, Gauge, Radar, Target } from 'lucide-react';

const trustCards = [
  { title: 'Weighted metrics', body: 'Accuracy, consistency, tracking, flick precision.', icon: Gauge },
  { title: 'Muscle memory', body: 'Designed so you hold new sensitivity long enough.', icon: Radar },
  { title: 'FPS optimized', body: 'Role-aware ranges for Valorant and CS2.', icon: Target },
  { title: 'Actionable', body: 'Practice direction and next steps after results.', icon: Activity },
];

export function TrustSection() {
  return (
    <section className="grid gap-6 grid-cols-2 py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface)] p-10 space-y-5 transition-colors hover:border-[var(--app-border-accent)]"
      >
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--app-accent)]">Why It Works</div>
        <h2 className="text-3xl font-bold tracking-[-0.02em] text-[var(--app-text-primary)]">Premium aim tuning workflow</h2>
        <p className="text-base leading-7 text-[var(--app-text-secondary)]">Fixes weak hierarchy, cramped layout, and unclear CTAs with a data-driven approach.</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {trustCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 space-y-4 transition-colors hover:border-[var(--app-border-accent)] hover:bg-[var(--app-surface-soft)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
              <card.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--app-text-primary)]">{card.title}</h3>
            <p className="text-sm leading-6 text-[var(--app-text-muted)]">{card.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

