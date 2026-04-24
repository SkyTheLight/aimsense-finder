'use client';

import { motion } from 'framer-motion';
import { ArrowDown, BrainCircuit, Settings2, SlidersHorizontal, Trophy } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Capture your baseline',
    body: 'Enter DPI, in-game sens, game, grip, and aiming style so the system starts from your real setup.',
    icon: Settings2,
  },
  {
    step: '02',
    title: 'Anchor against a pro-range profile',
    body: 'Compare where you sit relative to typical tactical FPS ranges before narrowing the target zone.',
    icon: Trophy,
  },
  {
    step: '03',
    title: 'Refine with PSA and benchmark weighting',
    body: 'Guide the calibration through preference testing and skill-bias adjustment instead of one static formula.',
    icon: SlidersHorizontal,
  },
  {
    step: '04',
    title: 'Leave with a decision you can hold',
    body: 'The final state explains the recommendation, its tradeoffs, and how to practice without second-guessing it tomorrow.',
    icon: BrainCircuit,
  },
];

export function WorkflowSection() {
  return (
    <section className="rounded-[36px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--app-accent)]">UX Flow</div>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--app-text-primary)] sm:text-4xl">
            A four-step narrative instead of a cold utility.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[var(--app-text-secondary)]">
          The flow is now legible at a glance: understand the promise, understand the method, and then start the calibration.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {steps.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 * index }}
            className="relative rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-6"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="text-sm font-semibold tracking-[0.2em] text-[var(--app-text-muted)]">{item.step}</span>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
                <item.icon className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--app-text-primary)]">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--app-text-secondary)]">{item.body}</p>
            {index < steps.length - 1 && (
              <ArrowDown className="absolute -bottom-7 left-1/2 hidden h-5 w-5 -translate-x-1/2 text-[var(--app-text-muted)] lg:block" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
