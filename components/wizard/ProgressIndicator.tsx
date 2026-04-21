'use client';

import { motion } from 'framer-motion';
import { STEPS } from '@/lib/constants';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#2a2a3a] -translate-y-1/2 z-0" />
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-[#00ff88] -translate-y-1/2 z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted || isActive ? '#00ff88' : '#1a1a24',
                  borderColor: isCompleted || isActive ? '#00ff88' : '#2a2a3a',
                }}
                className={`
                  w-10 h-10 rounded-full border-2 flex items-center justify-center
                  transition-colors duration-300
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-[#0a0a0f]" />
                ) : (
                  <span className={`text-sm font-semibold ${isActive ? 'text-[#0a0a0f]' : 'text-[#64748b]'}`}>
                    {index + 1}
                  </span>
                )}
              </motion.div>
              <motion.span
                initial={false}
                animate={{
                  color: isActive ? '#ffffff' : isCompleted ? '#94a3b8' : '#64748b',
                  fontWeight: isActive ? 600 : 400,
                }}
                className="mt-2 text-xs hidden sm:block"
              >
                {step.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
}