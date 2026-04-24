'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, TimerReset, Trophy } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
}

const heroStats = [
  { value: '50K+', label: 'Calibrations completed' },
  { value: '4.9/5', label: 'Average player rating' },
  { value: '98%', label: 'Users who keep their new sens' },
];

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
      <div className="relative flex flex-col items-center text-center space-y-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 text-sm text-slate-400"
        >
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span>Sensitivity calibration</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl font-bold text-white"
        >
          Find Your <span className="text-cyan-400">Perfect Sensitivity</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="max-w-lg text-slate-400"
        >
          Combine your setup, pro benchmarks, and AI feedback into one guided calibration flow.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex gap-4"
        >
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-white font-medium hover:bg-cyan-400"
          >
            Start calibration
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Stats */}
        <div className="flex gap-4 mt-6">
          {heroStats.map((stat, i) => (
            <div key={i} className="rounded-lg border border-slate-800 bg-slate-900 px-6 py-3 text-center">
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}