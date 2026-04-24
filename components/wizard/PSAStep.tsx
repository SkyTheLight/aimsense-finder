'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PSAIteration, UserSetup, ProPreset } from '@/types';
import { generateInitialPSAOptions, createFirstIteration, getPSAValue } from '@/lib/psaLogic';
import { Target, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

interface PSAStepProps {
  setup: UserSetup | null;
  selectedPreset: ProPreset | null;
  iterations: PSAIteration[];
  onIterationsChange: (iterations: PSAIteration[]) => void;
  onPSAFinalChange: (value: number | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PSAStep({ setup, selectedPreset, iterations, onIterationsChange, onPSAFinalChange, onNext, onBack }: PSAStepProps) {
  const [initialChoice, setInitialChoice] = useState<'half' | 'base' | 'double' | null>(null);
  const baseSens = useMemo(() => { if (!setup || !setup.dpi || !setup.sensitivity) return 0.4; return Number(setup.sensitivity.toFixed(3)); }, [setup]);
  const psaOptions = useMemo(() => generateInitialPSAOptions(baseSens), [baseSens]);
  const currentIteration = iterations.length > 0 ? iterations[iterations.length - 1] : null;
  const isComplete = iterations.length >= 7 && iterations.every(i => i.choice !== null);

  const handleInitialChoice = (choice: 'half' | 'base' | 'double') => {
    const selectedSens = choice === 'half' ? psaOptions.slower : choice === 'double' ? psaOptions.faster : baseSens;
    const binaryChoice: 'low' | 'high' = choice === 'double' ? 'high' : 'low';
    setInitialChoice(choice);
    onPSAFinalChange(selectedSens);
    const firstIter = createFirstIteration(selectedSens);
    firstIter.choice = binaryChoice;
    onIterationsChange([firstIter]);
  };

  const handleBinaryChoice = (choice: 'low' | 'high') => {
    if (!currentIteration) return;
    const updatedCurrent = { ...currentIteration, choice };
    const newIterations = [...iterations.slice(0, -1), updatedCurrent];
    if (newIterations.length >= 7) { const psaValue = getPSAValue(newIterations); onPSAFinalChange(psaValue); onIterationsChange(newIterations); }
    else { const nextIter = createFirstIteration(choice === 'low' ? currentIteration.low : currentIteration.high); onIterationsChange([...newIterations, nextIter]); }
  };

  const handleReset = () => { setInitialChoice(null); onIterationsChange([]); onPSAFinalChange(null); };

  if (!setup || !setup.dpi || !setup.sensitivity) {
    return (
      <div className="space-y-12">
        <Card variant="bordered" className="text-center"><p className="text-[var(--app-text-primary)]">Please complete Setup step first</p></Card>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <h2 className="text-2xl font-bold text-[var(--app-text-primary)]">PSA Method</h2>
        <p className="text-[var(--app-text-secondary)]">{initialChoice ? isComplete ? 'Calibration complete!' : `Step ${Math.min(iterations.length, 7)} of 7` : 'Find your perfect sensitivity'}</p>
      </motion.div>

      {!initialChoice && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card variant="bordered" className="bg-[var(--app-surface)]">
            <div className="space-y-4">
              <div className="space-y-4">
                <h3 className="mb-4 flex items-center gap-2 text-[var(--app-text-primary)] font-semibold">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xs">?</span>
                  What is the PSA Method?
                </h3>
                <p className="text-sm text-[var(--app-text-secondary)]">The PSA Method is a binary search technique used by pro players to find your optimal mouse sensitivity.</p>
              </div>
              <div className="space-y-4 border-t border-[var(--app-border)] pt-4">
                <h4 className="text-sm font-medium text-[var(--app-text-primary)]">How it works:</h4>
                <ol className="text-sm text-[var(--app-text-secondary)] space-y-2">
                  <li className="flex gap-2"><span className="text-green-500 font-mono">1.</span><span>Compare two sensitivities side by side</span></li>
                  <li className="flex gap-2"><span className="text-green-500 font-mono">2.</span><span>Pick the one that feels smoother</span></li>
                  <li className="flex gap-2"><span className="text-green-500 font-mono">3.</span><span>Repeat until you find your perfect sensitivity</span></li>
                </ol>
              </div>
              <div className="space-y-4 border-t border-[var(--app-border)] pt-4">
                <h4 className="text-sm font-medium text-[var(--app-text-primary)]">Example:</h4>
                <p className="text-sm text-[var(--app-text-secondary)]">If your current sens is <code className="text-[var(--app-accent)]">0.5</code>, you'll compare <code className="text-[var(--app-accent)]">0.25</code> vs <code className="text-[var(--app-accent)]">1.0</code>.</p>
              </div>
              <p className="pt-4 text-center text-sm text-[var(--app-text-secondary)]">Which feels better for smooth tracking?</p>
              <div className="grid grid-cols-3 gap-4">
                {[{ key: 'half' as const, value: psaOptions.slower, label: 'Slower' }, { key: 'base' as const, value: psaOptions.current, label: 'Current' }, { key: 'double' as const, value: psaOptions.faster, label: 'Faster' }].map((option) => (
                  <button key={option.key} onClick={() => handleInitialChoice(option.key)} className="space-y-4 rounded-xl border-2 border-[var(--app-border)] bg-[var(--app-surface)] p-6 transition-all hover:border-green-500 hover:bg-green-500/5">
                    <p className="mb-1 text-xs text-[var(--app-text-muted)]">{option.label}</p>
                    <p className="text-xl font-mono font-bold text-[var(--app-text-primary)]">{option.value}</p>
                  </button>
                ))}
              </div>
              <p className="text-center text-xs text-[var(--app-text-muted)]">Your current sensitivity: {baseSens.toFixed(3)}</p>
            </div>
          </Card>
        </motion.div>
      )}

      {initialChoice && !isComplete && currentIteration && (
        <motion.div key={currentIteration.iteration} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Card variant="glow">
            <div className="space-y-4 text-center">
              <Target className="mx-auto h-10 w-10 text-green-500" />
              <p className="text-sm text-[var(--app-text-secondary)]">Compare these two sensitivities and pick which feels better</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleBinaryChoice('low')} className="group space-y-4 rounded-xl border-2 border-[var(--app-border)] bg-[var(--app-surface)] p-6 transition-all hover:border-green-500 hover:bg-green-500/5">
                <ArrowLeft className="mx-auto h-6 w-6 text-[var(--app-text-muted)] group-hover:text-green-500" />
                <p className="mb-1 text-xs text-[var(--app-text-muted)]">Lower</p>
                <p className="text-2xl font-mono font-bold text-[var(--app-text-primary)]">{currentIteration.low.toFixed(3)}</p>
              </button>
              <button onClick={() => handleBinaryChoice('high')} className="group space-y-4 rounded-xl border-2 border-[var(--app-border)] bg-[var(--app-surface)] p-6 transition-all hover:border-green-500 hover:bg-green-500/5">
                <ArrowRight className="mx-auto h-6 w-6 text-[var(--app-text-muted)] group-hover:text-green-500" />
                <p className="mb-1 text-xs text-[var(--app-text-muted)]">Higher</p>
                <p className="text-2xl font-mono font-bold text-[var(--app-text-primary)]">{currentIteration.high.toFixed(3)}</p>
              </button>
            </div>
            <div className="mt-6 flex justify-center">
              <button onClick={handleReset} className="flex items-center gap-2 text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] transition-colors"><RotateCcw className="w-4 h-4" />Reset</button>
            </div>
          </Card>
        </motion.div>
      )}

      {isComplete && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card variant="glow" className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10"><Target className="w-8 h-8 text-green-500" /></div>
            <h3 className="mb-4 text-xl font-bold text-[var(--app-text-primary)]">PSA Complete!</h3>
            <p className="mb-4 text-sm text-[var(--app-text-secondary)]">Your calibrated sensitivity value</p>
            <p className="mb-4 text-4xl font-mono font-bold text-green-500">{getPSAValue(iterations)?.toFixed(3)}</p>
            <p className="text-xs text-[var(--app-text-muted)]">After 7 iterations (0.1% precision)</p>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 flex gap-4">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={onNext} disabled={!isComplete} className="flex-1">Continue</Button>
      </motion.div>
    </div>
  );
}