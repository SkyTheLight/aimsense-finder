'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UserSetup, MouseGrip, AimingMechanic, MouseWeight, MouseSizeFeel, MousepadSize, MousepadSurface } from '@/types';
import { ArrowRight, ArrowLeft, Mouse, MousePointer2, Scale, HardDrive, AlertCircle } from 'lucide-react';

interface InputStepProps {
  setup: UserSetup | null;
  onSetupChange: (setup: Partial<UserSetup>) => void;
  onNext: () => void;
  onBack: () => void;
}

const GRIPS: { value: MouseGrip | ''; label: string }[] = [
  { value: 'palm', label: 'Palm' },
  { value: 'claw', label: 'Claw' },
  { value: 'fingertip', label: 'Fingertip' },
];

const MECHANICS: { value: AimingMechanic | ''; label: string }[] = [
  { value: 'wrist', label: 'Wrist' },
  { value: 'arm', label: 'Arm' },
  { value: 'hybrid', label: 'Hybrid' },
];

const MOUSE_WEIGHTS: { value: MouseWeight | ''; label: string }[] = [
  { value: 'ultralight', label: 'Ultralight (<60g)' },
  { value: 'light', label: 'Light (60-70g)' },
  { value: 'medium', label: 'Medium (70-80g)' },
  { value: 'heavy', label: 'Heavy (>80g)' },
];

const MOUSE_SIZES: { value: MouseSizeFeel | ''; label: string }[] = [
  { value: 'too_big', label: 'Too Big' },
  { value: 'just_right', label: 'Just Right' },
  { value: 'too_small', label: 'Too Small' },
];

const MOUSEPAD_SIZES: { value: MousepadSize | ''; label: string }[] = [
  { value: 'small', label: 'S' },
  { value: 'medium', label: 'M' },
  { value: 'large', label: 'L' },
  { value: 'xl', label: 'XL' },
];

const MOUSEPAD_SURFACES: { value: MousepadSurface | ''; label: string }[] = [
  { value: 'control', label: 'Control' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'speed', label: 'Speed' },
];

export function InputStep({ setup, onSetupChange, onNext, onBack }: InputStepProps) {
  const canProceed = setup?.dpi && setup?.sensitivity && setup?.mouseGrip && setup?.aimingMechanic;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[var(--app-text-primary)]">Input System</h2>
        <p className="text-[var(--app-text-secondary)]">Your hardware setup</p>
      </div>

      <Card variant="bordered" className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Mouse className="w-5 h-5 text-green-500" />
          <h3 className="text-[var(--app-text-primary)] font-medium">Mouse Settings</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[var(--app-text-muted)] block mb-2">DPI</label>
            <input
              type="number"
              value={setup?.dpi || ''}
              onChange={(e) => onSetupChange({ dpi: parseInt(e.target.value) || 0 })}
              placeholder="e.g. 800"
              className="w-full px-4 py-3 rounded-xl bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-primary)] focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-[var(--app-text-muted)] block mb-2">Sensitivity</label>
            <input
              type="number"
              step="0.001"
              value={setup?.sensitivity || ''}
              onChange={(e) => onSetupChange({ sensitivity: parseFloat(e.target.value) || 0 })}
              placeholder="e.g. 0.5"
              className="w-full px-4 py-3 rounded-xl bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-primary)] focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>
      </Card>

      <Card variant="bordered" className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MousePointer2 className="w-5 h-5 text-green-500" />
          <h3 className="text-[var(--app-text-primary)] font-medium">Grip & Mechanic</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-[var(--app-text-muted)] block mb-2">Grip Style</label>
            <div className="flex gap-2">
              {GRIPS.filter(g => g.value).map((g) => (
                <button
                  key={g.value}
                  onClick={() => onSetupChange({ mouseGrip: g.value as MouseGrip })}
                  className={`flex-1 py-3 rounded-xl border transition-all ${
                    setup?.mouseGrip === g.value
                      ? 'bg-green-500/10 border-green-500 text-green-500'
                      : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-[var(--app-text-muted)] block mb-2">Mechanic</label>
            <div className="flex gap-2">
              {MECHANICS.filter(m => m.value).map((m) => (
                <button
                  key={m.value}
                  onClick={() => onSetupChange({ aimingMechanic: m.value as AimingMechanic })}
                  className={`flex-1 py-3 rounded-xl border transition-all ${
                    setup?.aimingMechanic === m.value
                      ? 'bg-green-500/10 border-green-500 text-green-500'
                      : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card variant="bordered" className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-green-500" />
          <h3 className="text-[var(--app-text-primary)] font-medium">Mouse Specs</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-[var(--app-text-muted)] block mb-2">Weight</label>
            <div className="flex gap-1">
              {MOUSE_WEIGHTS.filter(m => m.value).map((m) => (
                <button
                  key={m.value}
                  onClick={() => onSetupChange({ mouseWeight: m.value as MouseWeight })}
                  className={`flex-1 py-2 px-1 rounded-lg border text-xs transition-all ${
                    setup?.mouseWeight === m.value
                      ? 'bg-green-500/10 border-green-500 text-green-500'
                      : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-[var(--app-text-muted)] block mb-2">Size Feel</label>
            <div className="flex gap-1">
              {MOUSE_SIZES.filter(m => m.value).map((m) => (
                <button
                  key={m.value}
                  onClick={() => onSetupChange({ mouseSizeFeel: m.value as MouseSizeFeel })}
                  className={`flex-1 py-2 px-1 rounded-lg border text-xs transition-all ${
                    setup?.mouseSizeFeel === m.value
                      ? 'bg-green-500/10 border-green-500 text-green-500'
                      : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card variant="bordered" className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <HardDrive className="w-5 h-5 text-green-500" />
          <h3 className="text-[var(--app-text-primary)] font-medium">Mousepad</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-[var(--app-text-muted)] block mb-2">Size</label>
            <div className="flex gap-1">
              {MOUSEPAD_SIZES.filter(m => m.value).map((m) => (
                <button
                  key={m.value}
                  onClick={() => onSetupChange({ mousepadSize: m.value as MousepadSize })}
                  className={`flex-1 py-2 rounded-lg border transition-all ${
                    setup?.mousepadSize === m.value
                      ? 'bg-green-500/10 border-green-500 text-green-500'
                      : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-[var(--app-text-muted)] block mb-2">Surface</label>
            <div className="flex gap-1">
              {MOUSEPAD_SURFACES.filter(m => m.value).map((m) => (
                <button
                  key={m.value}
                  onClick={() => onSetupChange({ mousepadSurface: m.value as MousepadSurface })}
                  className={`flex-1 py-2 rounded-lg border text-xs transition-all ${
                    setup?.mousepadSurface === m.value
                      ? 'bg-green-500/10 border-green-500 text-green-500'
                      : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <button
            onClick={() => onSetupChange({ runningOutOfSpace: !setup?.runningOutOfSpace })}
            className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
              setup?.runningOutOfSpace
                ? 'bg-orange-500/10 border-orange-500 text-orange-500'
                : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-orange-500/50'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Running out of mousepad space
          </button>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-5 h-5 mr-2" />Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="flex-1">
          Next<ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}