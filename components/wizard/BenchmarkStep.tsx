'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { BenchmarkScores } from '@/types';
import { AIM_LAB_TASKS } from '@/lib/constants';
import { Award, Zap, Crosshair, Target, ExternalLink, Share2 } from 'lucide-react';

interface BenchmarkStepProps {
  benchmarks: BenchmarkScores | null;
  simplified: { tracking: number; flicking: number; switching: number } | null;
  onBenchmarksChange: (benchmarks: BenchmarkScores | null) => void;
  onSimplifiedChange: (simplified: { tracking: number; flicking: number; switching: number } | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BenchmarkStep({
  benchmarks,
  simplified,
  onBenchmarksChange,
  onSimplifiedChange,
  onNext,
  onBack,
}: BenchmarkStepProps) {
  const [localBenchmarks, setLocalBenchmarks] = useState<BenchmarkScores>(
    benchmarks || { gridshot: 0, sixshot: 0, strafeTrack: 0, sphereTrack: 0, tracking: 0, flicking: 0, switching: 0 }
  );

  const handleBenchmarkChange = (key: keyof BenchmarkScores, value: number) => {
    const updated = { ...localBenchmarks, [key]: value };
    setLocalBenchmarks(updated);

    updated.tracking = ((updated.strafeTrack || 0) + (updated.sphereTrack || 0)) / 2;
    updated.flicking = (updated.sixshot || 0);
    updated.switching = (updated.gridshot || 0);

    onBenchmarksChange(updated);
  };

  const openAimLabTask = (link: string) => {
    window.open(link, '_blank');
  };

  const taskMap: Record<string, string> = {
    gridshot: 'gridshot',
    sixshot: 'sixshot',
    microshot: 'microshot',
    reflexshot: 'reflexshot',
    strafe_track: 'strafeTrack',
    smoothsphere: 'sphereTrack',
  };

  const hasData = localBenchmarks.gridshot > 0 || localBenchmarks.sixshot > 0 || localBenchmarks.strafeTrack > 0 || localBenchmarks.sphereTrack > 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Performance Test</h2>
        <p className="text-[#94a3b8]">Run Aim Lab tasks and enter your scores</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card variant="bordered">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#00ff88]" />
              <span className="text-white font-semibold">Switching</span>
            </div>
            <button onClick={() => openAimLabTask(AIM_LAB_TASKS.switching[0].steamLink)} className="text-xs text-[#00ff88] hover:underline flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Launch in Aim Lab
            </button>
          </div>
          <Input type="number" placeholder="Enter your Gridshot score" value={localBenchmarks.gridshot || ''} onChange={(e) => handleBenchmarkChange('gridshot', Number(e.target.value))} className="font-mono text-lg" />
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card variant="bordered">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#ff3366]" />
              <span className="text-white font-semibold">Flicking</span>
            </div>
          </div>
          <div className="space-y-3">
            {AIM_LAB_TASKS.flicking.map((task) => (
              <div key={task.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#94a3b8]">{task.name}</span>
                    <span className="text-xs text-[#64748b]">({task.difficulty})</span>
                  </div>
                  <button onClick={() => openAimLabTask(task.steamLink)} className="text-xs text-[#00ff88] hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Launch
                  </button>
                </div>
                <Input type="number" placeholder="Score" value={localBenchmarks[taskMap[task.id] as keyof BenchmarkScores] || ''} onChange={(e) => handleBenchmarkChange(taskMap[task.id] as keyof BenchmarkScores, Number(e.target.value))} className="font-mono" />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card variant="bordered">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-[#6366f1]" />
              <span className="text-white font-semibold">Tracking</span>
            </div>
          </div>
          <div className="space-y-3">
            {AIM_LAB_TASKS.tracking.map((task) => (
              <div key={task.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#94a3b8]">{task.name}</span>
                    <span className="text-xs text-[#64748b]">({task.difficulty})</span>
                  </div>
                  <button onClick={() => openAimLabTask(task.steamLink)} className="text-xs text-[#00ff88] hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Launch
                  </button>
                </div>
                <Input type="number" placeholder="Score" value={localBenchmarks[taskMap[task.id] as keyof BenchmarkScores] || ''} onChange={(e) => handleBenchmarkChange(taskMap[task.id] as keyof BenchmarkScores, Number(e.target.value))} className="font-mono" />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card variant="glow">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-[#00ff88] mt-0.5" />
            <div>
              <p className="text-sm text-[#94a3b8]">
                {hasData ? 'Performance data will fine-tune your sensitivity based on your strengths/weaknesses' : 'Enter scores from Aim Lab to get personalized recommendations'}
              </p>
              <p className="text-xs text-[#64748b] mt-1">
                {!hasData && 'Leave empty to use default calibration'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-3">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={onNext} className="flex-1">Calculate Results</Button>
      </motion.div>
    </div>
  );
}