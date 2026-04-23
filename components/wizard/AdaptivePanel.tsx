'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Sparkles, Zap, Gauge } from 'lucide-react';

export function AdaptivePanel() {
  const [strap, setStrap] = useState(false);
  const [glide, setGlide] = useState(false);

  return (
    <Card variant="bordered" className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium text-white">Adaptive Modules</span>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setStrap(!strap)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
            strap ? 'bg-cyan-600 border-cyan-600 text-white' : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.12)] text-[#b8c0cd] hover:bg-[rgba(255,255,255,0.08)]'
          }`}
        >
          <Zap className="w-4 h-4" />
          Strap/Weight Tuning
        </button>
        <button
          onClick={() => setGlide(!glide)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
            glide ? 'bg-cyan-600 border-cyan-600 text-white' : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.12)] text-[#b8c0cd] hover:bg-[rgba(255,255,255,0.08)]'
          }`}
        >
          <Gauge className="w-4 h-4" />
          Glide Feedback
        </button>
      </div>
    </Card>
  );
}