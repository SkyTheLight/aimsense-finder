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
        <Sparkles className="w-4 h-4 text-[var(--app-accent)]" />
        <span className="text-sm font-medium text-[var(--app-text-primary)]">Adaptive Modules</span>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setStrap(!strap)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
            strap ? 'bg-[var(--app-accent)] border-[var(--app-accent)] text-white' : 'bg-[var(--app-surface-soft)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'
          }`}
        >
          <Zap className="w-4 h-4" />
          Strap/Weight Tuning
        </button>
        <button
          onClick={() => setGlide(!glide)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
            glide ? 'bg-[var(--app-accent)] border-[var(--app-accent)] text-white' : 'bg-[var(--app-surface-soft)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'
          }`}
        >
          <Gauge className="w-4 h-4" />
          Glide Feedback
        </button>
      </div>
    </Card>
  );
}