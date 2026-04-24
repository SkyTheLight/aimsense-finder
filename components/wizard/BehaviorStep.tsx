'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UserSetup, ArmPosition, ArmAnchoring, SittingPosture, WarmupMethod, ConsistencyFeeling } from '@/types';
import { ArrowRight, ArrowLeft, Monitor, Volume2, Flame, Clock, Zap } from 'lucide-react';

interface BehaviorStepProps {
  setup: UserSetup | null;
  onSetupChange: (setup: Partial<UserSetup>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ARM_POSITIONS: { value: ArmPosition; label: string }[] = [
  { value: 'flat', label: 'Flat' },
  { value: 'angled', label: 'Angled' },
  { value: 'raised', label: 'Raised' },
];

const ARM_ANCHORS: { value: ArmAnchoring; label: string; desc: string }[] = [
  { value: 'anchored', label: 'Anchored', desc: 'Arm on desk' },
  { value: 'floating', label: 'Floating', desc: 'Arm off desk' },
];

const POSTURES: { value: SittingPosture; label: string; desc: string }[] = [
  { value: 'upright', label: 'Upright', desc: 'Back straight' },
  { value: 'leaning', label: 'Leaning', desc: 'Slight forward' },
  { value: 'slouched', label: 'Slouched', desc: 'Hunched' },
];

const WARMUP_METHODS: { value: WarmupMethod; label: string }[] = [
  { value: 'aim_trainer', label: 'Aim Trainer' },
  { value: 'deathmatch', label: 'Deathmatch' },
  { value: 'range', label: 'Range' },
];

const CONSISTENCY: { value: ConsistencyFeeling; label: string; desc: string }[] = [
  { value: 'consistent', label: 'Consistent', desc: 'Same every session' },
  { value: 'inconsistent', label: 'Inconsistent', desc: 'Varies a lot' },
];

export function BehaviorStep({ setup, onSetupChange, onNext, onBack }: BehaviorStepProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[var(--app-text-primary)]">Behavior & Stability</h2>
        <p className="text-[var(--app-text-secondary)]">Your performance foundation</p>
      </div>

      <Card variant="bordered" className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Monitor className="w-5 h-5 text-green-500" />
          <h3 className="text-[var(--app-text-primary)] font-medium">Setup Position</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-[var(--app-text-muted)] block mb-2">Arm Position</label>
            <div className="flex gap-2">
              {ARM_POSITIONS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => onSetupChange({ armPosition: a.value })}
                  className={`flex-1 py-3 rounded-xl border transition-all ${
                    setup?.armPosition === a.value
                      ? 'bg-green-500/10 border-green-500 text-green-500'
                      : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-[var(--app-text-muted)] block mb-2">Anchoring</label>
            <div className="flex gap-2">
              {ARM_ANCHORS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => onSetupChange({ armAnchoring: a.value })}
                  className={`flex-1 py-3 rounded-xl border transition-all ${
                    setup?.armAnchoring === a.value
                      ? 'bg-green-500/10 border-green-500 text-green-500'
                      : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label className="text-sm text-[var(--app-text-muted)] block mb-2">Posture</label>
          <div className="flex gap-2">
            {POSTURES.map((p) => (
              <button
                key={p.value}
                onClick={() => onSetupChange({ sittingPosture: p.value })}
                className={`flex-1 py-3 rounded-xl border transition-all ${
                  setup?.sittingPosture === p.value
                    ? 'bg-green-500/10 border-green-500 text-green-500'
                    : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card variant="bordered" className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-5 h-5 text-green-500" />
          <h3 className="text-[var(--app-text-primary)] font-medium">Warmup</h3>
        </div>
        
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => onSetupChange({ warmup: true })}
            className={`flex-1 py-3 rounded-xl border transition-all ${
              setup?.warmup === true
                ? 'bg-green-500/10 border-green-500 text-green-500'
                : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
            }`}
          >
            Yes, I warm up
          </button>
          <button
            onClick={() => onSetupChange({ warmup: false, warmupDuration: null, warmupMethod: null })}
            className={`flex-1 py-3 rounded-xl border transition-all ${
              setup?.warmup === false
                ? 'bg-green-500/10 border-green-500 text-green-500'
                : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
            }`}
          >
            No
          </button>
        </div>

        {setup?.warmup && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-[var(--app-text-muted)] block mb-2">Duration</label>
                <select
                  value={setup?.warmupDuration || ''}
                  onChange={(e) => onSetupChange({ warmupDuration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-primary)] focus:border-green-500 focus:outline-none"
                >
                  <option value="">Select</option>
                  <option value="5">5 min</option>
                  <option value="10">10 min</option>
                  <option value="15">15 min</option>
                  <option value="20">20+ min</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-[var(--app-text-muted)] block mb-2">Method</label>
                <div className="flex flex-wrap gap-2">
                  {WARMUP_METHODS.map((w) => (
                    <button
                      key={w.value}
                      onClick={() => onSetupChange({ warmupMethod: w.value })}
                      className={`flex-1 py-3 px-2 rounded-xl border text-sm transition-all ${
                        setup?.warmupMethod === w.value
                          ? 'bg-green-500/10 border-green-500 text-green-500'
                          : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      <Card variant="bordered">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-green-500" />
          <h3 className="text-[var(--app-text-primary)] font-medium">Consistency</h3>
        </div>
        
        <div className="flex gap-2">
          {CONSISTENCY.map((c) => (
            <button
              key={c.value}
              onClick={() => onSetupChange({ consistencyFeeling: c.value })}
              className={`flex-1 py-3 rounded-xl border transition-all ${
                setup?.consistencyFeeling === c.value
                  ? 'bg-green-500/10 border-green-500 text-green-500'
                  : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
              }`}
            >
              <div className="font-medium">{c.label}</div>
              <div className="text-xs opacity-70">{c.desc}</div>
            </button>
          ))}
        </div>
      </Card>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-5 h-5 mr-2" />Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Next<ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}