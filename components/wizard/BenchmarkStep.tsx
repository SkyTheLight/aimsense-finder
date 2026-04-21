'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import { BenchmarkScores, SimplifiedRatings } from '@/types';
import { Award, Zap, Crosshair, Target, ToggleLeft, ToggleRight } from 'lucide-react';

interface BenchmarkStepProps {
  mode: 'manual' | 'simplified';
  benchmarks: BenchmarkScores | null;
  simplified: SimplifiedRatings | null;
  onModeChange: (mode: 'manual' | 'simplified') => void;
  onBenchmarksChange: (benchmarks: BenchmarkScores | null) => void;
  onSimplifiedChange: (simplified: SimplifiedRatings | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BenchmarkStep({
  mode,
  benchmarks,
  simplified,
  onModeChange,
  onBenchmarksChange,
  onSimplifiedChange,
  onNext,
  onBack,
}: BenchmarkStepProps) {
  const [localSimplified, setLocalSimplified] = useState<SimplifiedRatings>(
    simplified || { tracking: 5, flicking: 5, switching: 5 }
  );

  const [localBenchmarks, setLocalBenchmarks] = useState<BenchmarkScores>(
    benchmarks || { gridshot: 0, sixshot: 0, strafeTrack: 0, sphereTrack: 0, tracking: 0, flicking: 0, switching: 0 }
  );

  const handleSimplifiedChange = (key: keyof SimplifiedRatings, value: number) => {
    const updated = { ...localSimplified, [key]: value };
    setLocalSimplified(updated);
    onSimplifiedChange(updated);
  };

  const handleBenchmarkChange = (key: keyof BenchmarkScores, value: number) => {
    const updated = { ...localBenchmarks, [key]: value };
    setLocalBenchmarks(updated);

    updated.tracking = (updated.strafeTrack + updated.sphereTrack) / 2;
    updated.flicking = updated.sixshot;
    updated.switching = updated.gridshot;

    onBenchmarksChange(updated);
  };

  const hasData =
    mode === 'simplified'
      ? localSimplified.tracking > 0 || localSimplified.flicking > 0 || localSimplified.switching > 0
      : localBenchmarks.gridshot > 0 ||
        localBenchmarks.sixshot > 0 ||
        localBenchmarks.strafeTrack > 0 ||
        localBenchmarks.sphereTrack > 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Performance</h2>
        <p className="text-[#94a3b8]">Voltaic / Aim Lab benchmarks</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="flex bg-[#1a1a24] rounded-lg p-1">
          <button
            onClick={() => onModeChange('simplified')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              mode === 'simplified'
                ? 'bg-[#00ff88] text-[#0a0a0f]'
                : 'text-[#64748b] hover:text-white'
            }`}
          >
            <ToggleLeft className="w-4 h-4" />
            <span className="text-sm">Simplified</span>
          </button>
          <button
            onClick={() => onModeChange('manual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              mode === 'manual'
                ? 'bg-[#00ff88] text-[#0a0a0f]'
                : 'text-[#64748b] hover:text-white'
            }`}
          >
            <ToggleRight className="w-4 h-4" />
            <span className="text-sm">Manual</span>
          </button>
        </div>
      </motion.div>

      {mode === 'simplified' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card variant="bordered">
            <div className="space-y-6">
              <Slider
                label="Tracking"
                value={localSimplified.tracking}
                onChange={(v) => handleSimplifiedChange('tracking', v)}
              />
              <Slider
                label="Flicking"
                value={localSimplified.flicking}
                onChange={(v) => handleSimplifiedChange('flicking', v)}
              />
              <Slider
                label="Switching"
                value={localSimplified.switching}
                onChange={(v) => handleSimplifiedChange('switching', v)}
              />
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card variant="bordered">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#64748b] mb-2 flex items-center gap-1">
                  <Target className="w-3 h-3" /> Tracking
                </p>
                <Input
                  type="number"
                  placeholder="Strafe Track"
                  value={localBenchmarks.strafeTrack || ''}
                  onChange={(e) => handleBenchmarkChange('strafeTrack', Number(e.target.value))}
                  className="font-mono"
                />
                <Input
                  type="number"
                  placeholder="Sphere Track"
                  value={localBenchmarks.sphereTrack || ''}
                  onChange={(e) => handleBenchmarkChange('sphereTrack', Number(e.target.value))}
                  className="font-mono mt-2"
                />
              </div>
              <div>
                <p className="text-xs text-[#64748b] mb-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Flicking
                </p>
                <Input
                  type="number"
                  placeholder="Sixshot"
                  value={localBenchmarks.sixshot || ''}
                  onChange={(e) => handleBenchmarkChange('sixshot', Number(e.target.value))}
                  className="font-mono"
                />
                <Input
                  type="number"
                  placeholder="Gridshot"
                  value={localBenchmarks.gridshot || ''}
                  onChange={(e) => handleBenchmarkChange('gridshot', Number(e.target.value))}
                  className="font-mono mt-2"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="glow">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-[#00ff88] mt-0.5" />
            <div>
              <p className="text-sm text-[#94a3b8]">
                {hasData
                  ? 'Performance data will adjust your sensitivity'
                  : 'Skip this step if you don\'t have scores'}
              </p>
              <p className="text-xs text-[#64748b] mt-1">
                {!hasData
                  ? 'Leave all at 0 to skip'
                  : localSimplified.tracking > localSimplified.flicking
                    ? 'Strong tracking → slightly lower sens'
                    : localSimplified.flicking > localSimplified.tracking
                      ? 'Strong flicking → slightly higher sens'
                      : 'Balanced → stable sensitivity'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3"
      >
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Calculate Results
        </Button>
      </motion.div>
    </div>
  );
}