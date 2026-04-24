'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

interface FinalCtaSectionProps {
  onStart: () => void;
}

export function FinalCtaSection({ onStart }: FinalCtaSectionProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Ready to find your sens?</h2>
        <p className="text-sm text-slate-400">Get your personalized sensitivity recommendation in 3 minutes.</p>
      </div>
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-white font-medium hover:bg-cyan-400"
      >
        <Sparkles className="h-4 w-4" />
        Start calibration
        <ArrowRight className="h-4 w-4" />
      </button>
    </section>
  );
}