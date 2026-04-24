'use client';

import { motion } from 'framer-motion';
import { STEPS } from '@/lib/constants';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const visibleSteps = STEPS.filter((step) => step.id > 0 && step.id < 5);
  const currentVisibleIndex = Math.max(0, visibleSteps.findIndex((step) => step.id === currentStep));
  const progressWidth = visibleSteps.length > 1 ? (currentVisibleIndex / (visibleSteps.length - 1)) * 100 : 0;

  return (
    <div className="rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-[0_18px_60px_rgba(2,6,23,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--app-text-muted)]">Calibration Progress</div>
          <div className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[var(--app-text-primary)]">
            Step {currentVisibleIndex + 1} of {visibleSteps.length}
          </div>
        </div>
        <div className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-3 py-1 text-sm text-[var(--app-text-secondary)]">
          {visibleSteps[currentVisibleIndex]?.title}
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 right-0 top-5 h-px bg-[var(--app-border)]" />
        <motion.div
          className="absolute left-0 top-5 h-px bg-gradient-to-r from-[var(--app-accent)] to-[var(--app-accent-2)]"
          initial={{ width: 0 }}
          animate={{ width: `${progressWidth}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <div className="relative grid grid-cols-4 gap-2">
          {visibleSteps.map((step, index) => {
            const stepNumber = index + 1;
            const isComplete = index < currentVisibleIndex;
            const isActive = index === currentVisibleIndex;

            return (
              <div key={step.id} className="flex flex-col items-center text-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.08 : 1,
                    backgroundColor: isComplete || isActive ? 'var(--app-accent)' : 'var(--app-surface)',
                    borderColor: isComplete || isActive ? 'var(--app-accent)' : 'var(--app-border-strong)',
                    color: isComplete || isActive ? '#ffffff' : 'var(--app-text-muted)',
                    boxShadow: isActive ? '0 12px 28px rgba(14,165,233,0.28)' : '0 0 0 rgba(0,0,0,0)',
                  }}
                  transition={{ duration: 0.25 }}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-semibold"
                >
                  {isComplete ? <Check className="h-4 w-4" /> : stepNumber}
                </motion.div>
                <div className="mt-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--app-text-muted)]">
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
