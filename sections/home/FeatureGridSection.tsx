'use client';

import { motion } from 'framer-motion';
import { Crosshair, Gamepad2, Sparkles, Zap } from 'lucide-react';

const features = [
  { title: 'PSA narrowing', body: 'Guided preference sweep toward a decision.', icon: Crosshair, color: 'text-cyan-400' },
  { title: 'Skill-aware', body: 'Scores influence recommendation.', icon: Sparkles, color: 'text-purple-400' },
  { title: 'FPS focused', body: 'Optimized for Valorant and CS2.', icon: Gamepad2, color: 'text-green-400' },
  { title: 'Clear output', body: 'Percentile framing and practice tips.', icon: Zap, color: 'text-amber-400' },
];

export function FeatureGridSection() {
  return (
    <section className="grid grid-cols-2 gap-4">
      {features.map((feature, i) => (
        <motion.article
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-2"
        >
          <feature.icon className={`h-5 w-5 ${feature.color}`} />
          <h3 className="text-sm font-medium text-white">{feature.title}</h3>
          <p className="text-xs text-slate-500">{feature.body}</p>
        </motion.article>
      ))}
    </section>
  );
}