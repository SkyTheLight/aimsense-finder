'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PSAIteration, UserSetup, ProPreset } from '@/types';
import {
  generateInitialPSAOptions,
  createFirstIteration,
  processPSAChoice,
  getPSAValue,
} from '@/lib/psaLogic';
import {
  calculateEDPI,
  calculateBaseSensitivity,
} from '@/lib/calculations';
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

export function PSAStep({
  setup,
  selectedPreset,
  iterations,
  onIterationsChange,
  onPSAFinalChange,
  onNext,
  onBack,
}: PSAStepProps) {
  const [initialChoice, setInitialChoice] = useState<'half' | 'base' | 'double' | null>(null);

  const baseSens = useMemo(() => {
    if (!setup || !setup.dpi || !setup.sensitivity) return 0.4;
    return Number(setup.sensitivity.toFixed(3));
  }, [setup]);

  const psaOptions = useMemo(() => generateInitialPSAOptions(baseSens), [baseSens]);

  const currentIteration = iterations.length > 0 ? iterations[iterations.length - 1] : null;

  const handleInitialChoice = (choice: 'half' | 'base' | 'double') => {
    let selectedSens: number;
    let binaryChoice: 'low' | 'high';
    
    if (choice === 'half') {
      selectedSens = psaOptions.slower;
      binaryChoice = 'low';
    } else if (choice === 'double') {
      selectedSens = psaOptions.faster;
      binaryChoice = 'high';
    } else {
      selectedSens = baseSens;
      binaryChoice = 'low';
    }
    
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
    
    if (newIterations.length >= 7) {
      const psaValue = getPSAValue(newIterations);
      onPSAFinalChange(psaValue);
      onIterationsChange(newIterations);
    } else {
      const nextIter = createFirstIteration(
        choice === 'low' ? currentIteration.low : currentIteration.high
      );
      onIterationsChange([...newIterations, nextIter]);
    }
  };

  const handleReset = () => {
    setInitialChoice(null);
    onIterationsChange([]);
    onPSAFinalChange(null);
  };

  const isComplete = iterations.length >= 7 && iterations.every(i => i.choice !== null);

  if (!setup || !setup.dpi || !setup.sensitivity) {
    return (
      <div className="space-y-6">
        <Card variant="bordered" className="text-center">
          <p className="text-white">Please complete Setup step first</p>
        </Card>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">PSA Method</h2>
<p className="text-[#94a3b8]">
              {initialChoice
                ? isComplete
                  ? 'Calibration complete!'
                  : `Step ${Math.min(iterations.length, 7)} of 7`
                : 'Choose your starting point'}
            </p>
      </motion.div>

      {!initialChoice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="bordered">
            <p className="text-sm text-[#94a3b8] mb-4 text-center">
              Choose which feels better for smooth tracking:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'half' as const, value: psaOptions.slower, label: 'Slower' },
                { key: 'base' as const, value: psaOptions.current, label: 'Current' },
                { key: 'double' as const, value: psaOptions.faster, label: 'Faster' },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleInitialChoice(option.key)}
                  className="p-4 rounded-xl border-2 border-[#2a2a3a] bg-[#1a1a24] hover:border-[#00ff88] hover:bg-[#00ff88]/5 transition-all"
                >
                  <p className="text-xs text-[#64748b] mb-1">{option.label}</p>
                  <p className="text-xl font-mono font-bold text-white">{option.value}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-[#64748b] text-center mt-4">
              Your current sensitivity: {baseSens.toFixed(3)}
            </p>
          </Card>
        </motion.div>
      )}

      {initialChoice && !isComplete && currentIteration && (
        <motion.div
          key={currentIteration.iteration}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="glow">
            <div className="text-center mb-6">
              <Target className="w-10 h-10 text-[#00ff88] mx-auto mb-3" />
              <p className="text-sm text-[#94a3b8]">
                Compare these two sensitivities and pick which feels better
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleBinaryChoice('low')}
                className="p-6 rounded-xl border-2 border-[#2a2a3a] bg-[#1a1a24] hover:border-[#00ff88] hover:bg-[#00ff88]/5 transition-all group"
              >
                <ArrowLeft className="w-6 h-6 text-[#64748b] mx-auto mb-2 group-hover:text-[#00ff88]" />
                <p className="text-xs text-[#64748b] mb-1">Lower</p>
                <p className="text-2xl font-mono font-bold text-white">
                  {currentIteration.low.toFixed(3)}
                </p>
              </button>

              <button
                onClick={() => handleBinaryChoice('high')}
                className="p-6 rounded-xl border-2 border-[#2a2a3a] bg-[#1a1a24] hover:border-[#00ff88] hover:bg-[#00ff88]/5 transition-all group"
              >
                <ArrowRight className="w-6 h-6 text-[#64748b] mx-auto mb-2 group-hover:text-[#00ff88]" />
                <p className="text-xs text-[#64748b] mb-1">Higher</p>
                <p className="text-2xl font-mono font-bold text-white">
                  {currentIteration.high.toFixed(3)}
                </p>
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-[#64748b] hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </Card>
        </motion.div>
      )}

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card variant="glow" className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#00ff88]/10 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-[#00ff88]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">PSA Complete!</h3>
            <p className="text-sm text-[#94a3b8] mb-4">
              Your calibrated sensitivity value
            </p>
            <p className="text-4xl font-mono font-bold text-[#00ff88] mb-2">
              {getPSAValue(iterations)?.toFixed(3)}
            </p>
            <p className="text-xs text-[#64748b]">
              After 7 iterations (0.1% precision)
            </p>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3"
      >
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isComplete} className="flex-1">
          Continue
        </Button>
      </motion.div>
    </div>
  );
}