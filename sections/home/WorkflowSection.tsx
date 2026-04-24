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
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
      <div className="space-y-2">
        <div className="text-sm text-cyan-400 uppercase tracking-wide">How It Works</div>
        <h2 className="text-xl font-semibold text-white">Four-step calibration flow</h2>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {steps.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-3"
          >
            <div className="text-xs text-slate-500">{item.step}</div>
            <item.icon className="h-5 w-5 text-cyan-400" />
            <h3 className="text-sm font-medium text-white">{item.title}</h3>
            <p className="text-xs text-slate-500">{item.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}