'use client';

import { motion } from 'framer-motion';
import { Activity, Gauge, Radar, Target } from 'lucide-react';

const trustCards = [
  {
    title: 'Weighted by what actually matters',
    body: 'Accuracy, consistency, tracking, flick precision, and speed are blended into one interpretable signal instead of a vague score.',
    icon: Gauge,
  },
  {
    title: 'Designed around adaptation, not instant churn',
    body: 'The flow teaches players why they should hold their new sensitivity long enough for muscle memory to stabilize.',
    icon: Radar,
  },
  {
    title: 'Purpose-built for tactical FPS',
    body: 'Role-aware ranges, cm/360 context, and pro comparison make the output feel grounded for Valorant and CS2 players.',
    icon: Target,
  },
  {
    title: 'Actionable after the result',
    body: 'Recommendations don’t stop at the final number. Players leave with practice direction, confidence framing, and next steps.',
    icon: Activity,
  },
];

export function TrustSection() {
  return (
    <section id="method" className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface)] p-8">
        <div className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--app-accent)]">Why It Converts</div>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--app-text-primary)] sm:text-4xl">
          The current product needed a real story, a real hierarchy, and a real reason to trust the output.
        </h2>
        <p className="mt-4 text-base leading-8 text-[var(--app-text-secondary)]">
          The new structure fixes the old problems: weak hierarchy, cramped composition, scattered trust signals,
          unclear CTA priority, and a wizard entry that felt more like a form than a product experience.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {trustCards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 * index }}
            className="rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
              <card.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[var(--app-text-primary)]">{card.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--app-text-secondary)]">{card.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
