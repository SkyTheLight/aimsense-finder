'use client';

import { motion } from 'framer-motion';
import { Crosshair, Gamepad2, Sparkles, Zap } from 'lucide-react';

const features = [
  {
    title: 'PSA-guided narrowing',
    body: 'A guided preference sweep that moves the user toward an actual decision instead of endless tweaking.',
    icon: Crosshair,
    accent: 'from-cyan-500 to-sky-400',
  },
  {
    title: 'Skill-aware optimization',
    body: 'Tracking, flicking, and switching scores influence the recommendation so the result fits the player, not just the spreadsheet.',
    icon: Sparkles,
    accent: 'from-fuchsia-500 to-violet-400',
  },
  {
    title: 'Competitive-game context',
    body: 'The interface stays focused on Valorant and CS2 realities: angles, control, reaction windows, and practical sens ranges.',
    icon: Gamepad2,
    accent: 'from-emerald-500 to-lime-400',
  },
  {
    title: 'High-clarity output state',
    body: 'The recommendation lands with context, percentile framing, hold-period guidance, and concrete practice direction.',
    icon: Zap,
    accent: 'from-amber-500 to-orange-400',
  },
];

export function FeatureGridSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {features.map((feature, index) => (
        <motion.article
          key={feature.title}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06 * index }}
          className="rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface)] p-8"
        >
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} text-white shadow-lg`}>
            <feature.icon className="h-6 w-6" />
          </div>
          <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-[var(--app-text-primary)]">{feature.title}</h3>
          <p className="mt-3 max-w-xl text-sm leading-8 text-[var(--app-text-secondary)]">{feature.body}</p>
        </motion.article>
      ))}
    </section>
  );
}
