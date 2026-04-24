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
    <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-10 space-y-8 py-16">
      <div className="space-y-4">
        <div className="text-sm text-[var(--app-accent)] uppercase tracking-wide">How It Works</div>
        <h2 className="text-xl font-semibold text-[var(--app-text-primary)]">Four-step calibration flow</h2>
        <p className="text-base leading-relaxed text-[var(--app-text-secondary)]">Walk through a guided setup, pro comparison, preference sweep, and final recommendation.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {steps.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 space-y-4 transition-colors hover:bg-[var(--app-surface-soft)]"
          >
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--app-accent-soft)] text-xs font-bold text-[var(--app-accent)]">{item.step}</div>
            <item.icon className="h-5 w-5 text-[var(--app-accent)]" />
            <h3 className="text-sm font-medium text-[var(--app-text-primary)]">{item.title}</h3>
            <p className="text-sm text-[var(--app-text-muted)]">{item.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}