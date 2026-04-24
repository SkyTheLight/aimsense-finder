'use client';

import { motion } from 'framer-motion';
import { Crosshair, Gamepad2, Sparkles, Zap } from 'lucide-react';

const features = [
  { title: 'PSA narrowing', body: 'Guided preference sweep toward a decision.', icon: Crosshair, color: 'text-[var(--app-accent)]' },
  { title: 'Skill-aware', body: 'Scores influence recommendation.', icon: Sparkles, color: 'text-purple-400' },
  { title: 'FPS focused', body: 'Optimized for Valorant and CS2.', icon: Gamepad2, color: 'text-green-400' },
  { title: 'Clear output', body: 'Percentile framing and practice tips.', icon: Zap, color: 'text-amber-400' },
];

export function FeatureGridSection() {
  return (
    <section className="py-20 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--app-accent)]">Features</div>
        <h2 className="text-3xl font-bold tracking-[-0.02em] text-[var(--app-text-primary)]">What makes it work</h2>
        <p className="text-base leading-7 text-[var(--app-text-secondary)] max-w-2xl">Built for competitive FPS players who want precision, not guesswork.</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-5">
        {features.map((feature, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface)] p-8 space-y-4 transition-colors hover:border-[var(--app-border-accent)] hover:bg-[var(--app-surface-soft)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--app-accent-soft)]">
              <feature.icon className={`h-5 w-5 ${feature.color}`} />
            </div>
            <h3 className="text-base font-semibold text-[var(--app-text-primary)]">{feature.title}</h3>
            <p className="text-sm leading-6 text-[var(--app-text-muted)]">{feature.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

