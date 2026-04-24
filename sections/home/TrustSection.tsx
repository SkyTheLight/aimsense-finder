'use client';

import { motion } from 'framer-motion';
import { Activity, Gauge, Radar, Target } from 'lucide-react';

const trustCards = [
  { title: 'Weighted metrics', body: 'Accuracy, consistency, tracking, flick precision.', icon: Gauge },
  { title: 'Muscle memory', body: 'Designed so you hold new sensitivity long enough.', icon: Radar },
  { title: 'FPS optimized', body: 'Role-aware ranges for Valorant and CS2.', icon: Target },
  { title: 'Actionable', body: 'Practice direction and next steps after results.', icon: Activity },
];

export function TrustSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
        <div className="text-sm text-cyan-400 uppercase tracking-wide">Why It Works</div>
        <h2 className="text-xl font-semibold text-white">Premium aim tuning workflow</h2>
        <p className="text-sm text-slate-400">Fixes weak hierarchy, cramped layout, and unclear CTAs.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {trustCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2"
          >
            <card.icon className="h-5 w-5 text-cyan-400" />
            <h3 className="text-sm font-medium text-white">{card.title}</h3>
            <p className="text-xs text-slate-500">{card.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}