'use client';

import { motion } from 'framer-motion';
import { Settings2, Trophy, SlidersHorizontal, BrainCircuit } from 'lucide-react';

const steps = [
  { step: '01', title: 'Capture baseline', body: 'Enter DPI, in-game sens, game, grip, and aiming style.', icon: Settings2 },
  { step: '02', title: 'Pro-range profile', body: 'Compare where you sit relative to typical tactical FPS ranges.', icon: Trophy },
  { step: '03', title: 'PSA refinement', body: 'Guide calibration through preference testing and skill-bias.', icon: SlidersHorizontal },
  { step: '04', title: 'Final decision', body: 'Leave with recommendation, tradeoffs, and practice tips.', icon: BrainCircuit },
];

export function WorkflowSection() {
  return (
    <section className="rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface)] p-10 space-y-10 py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--app-accent)]">How It Works</div>
        <h2 className="text-3xl font-bold tracking-[-0.02em] text-[var(--app-text-primary)]">Four-step calibration flow</h2>
        <p className="text-base leading-7 text-[var(--app-text-secondary)] max-w-2xl">Walk through a guided setup, pro comparison, preference sweep, and final recommendation.</p>
      </motion.div>

      <div className="grid grid-cols-4 gap-5">
        {steps.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-6 space-y-5 transition-colors hover:border-[var(--app-border-accent)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--app-text-muted)]">{item.step}</div>
            </div>
            <h3 className="text-base font-semibold text-[var(--app-text-primary)]">{item.title}</h3>
            <p className="text-sm leading-6 text-[var(--app-text-muted)]">{item.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

