'use client';

import { motion } from 'framer-motion';
import { STEPS } from '@/lib/constants';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Track Background */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-[rgba(255,255,255,0.08)] rounded-full" />
        
        {/* Track Progress */}
        <motion.div
          className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const stepNum = index + 1;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isCompleted || isActive ? '#06b6d9' : 'rgba(255,255,255,0.08)',
                  borderColor: isCompleted || isActive ? '#06b6d9' : 'rgba(255,255,255,0.12)',
                  boxShadow: isActive ? '0 0 20px rgba(6,182,217,0.4)' : 'none',
                }}
                transition={{ duration: 0.3 }}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  isCompleted || isActive ? '' : 'bg-[rgba(255,255,255,0.08)]'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-[#525a6b]'}`}>
                    {stepNum}
                  </span>
                )}
              </motion.div>
              
              <motion.span
                initial={false}
                animate={{
                  color: isActive ? '#f4f6fa' : isCompleted ? '#b8c0cd' : '#525a6b',
                  fontWeight: isActive ? 500 : 400,
                }}
                className="mt-2 text-xs hidden sm:block whitespace-nowrap"
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