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
    <section className="py-16 space-y-8">
      <div className="space-y-4">
        <div className="text-sm text-[var(--app-accent)] uppercase tracking-wide">Features</div>
        <h2 className="text-xl font-semibold text-[var(--app-text-primary)]">What makes it work</h2>
        <p className="text-base leading-relaxed text-[var(--app-text-secondary)]">Built for competitive FPS players who want precision, not guesswork.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
      {features.map((feature, i) => (
        <motion.article
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 space-y-3 transition-colors hover:bg-[var(--app-surface-soft)]"
        >
          <feature.icon className={`h-5 w-5 ${feature.color}`} />
          <h3 className="text-sm font-medium text-[var(--app-text-primary)]">{feature.title}</h3>
          <p className="text-sm text-[var(--app-text-muted)]">{feature.body}</p>
        </motion.article>
      ))}
      </div>
    </section>
  );
}