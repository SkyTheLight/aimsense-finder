'use client';

import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { BenchmarkScores } from '@/types';
import { AIM_LAB_TASKS } from '@/lib/constants';
import { Award, Zap, Crosshair, Target, ExternalLink, Sparkles, Loader2, ChevronRight } from 'lucide-react';

interface DiagnosticResult {
  skillTier: string;
  percentile: number;
  aimStyle: string;
  consistency: number;
  microScore: number;
  macroScore: number;
  tensionScore: number;
  strengths: string[];
  weaknesses: string[];
  coachingSummary: string;
  priorityFocus: string;
  improvementPace: string;
  insight: string;
  learningGuidance: { category: string; objective: string; direction: string; whyImportant: string }[];
  videos: { title: string; creator: string; query: string; why: string; focus: string; connection: string }[];
}

interface BenchmarkStepProps {
  benchmarks: BenchmarkScores | null;
  simplified: { tracking: number; flicking: number; switching: number } | null;
  onBenchmarksChange: (benchmarks: BenchmarkScores | null) => void;
  onSimplifiedChange: (simplified: { tracking: number; flicking: number; switching: number } | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BenchmarkStep({ benchmarks, simplified, onBenchmarksChange, onSimplifiedChange, onNext, onBack }: BenchmarkStepProps) {
  const [localBenchmarks, setLocalBenchmarks] = useState<BenchmarkScores>(benchmarks || { gridshot: 0, sixshot: 0, strafeTrack: 0, sphereTrack: 0, tracking: 0, flicking: 0, switching: 0 });
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [game] = useState<'valorant' | 'cs2'>('valorant');

  const runDiagnostic = useCallback(async () => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/diagnostics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ game, gridshot: localBenchmarks.gridshot || 0, sixshot: localBenchmarks.sixshot || 0, strafeTrack: localBenchmarks.strafeTrack || 0, sphereTrack: localBenchmarks.sphereTrack || 0, tracking: localBenchmarks.tracking, flicking: localBenchmarks.flicking, switching: localBenchmarks.switching }) });
      if (response.ok) { const data = await response.json(); setDiagnostic(data); }
    } catch (err) { console.error('Diagnostic failed:', err); }
    finally { setAnalyzing(false); }
  }, [localBenchmarks, game]);

  const handleBenchmarkChange = (key: keyof BenchmarkScores, value: number) => {
    const updated = { ...localBenchmarks, [key]: value };
    setLocalBenchmarks(updated);
    updated.tracking = ((updated.strafeTrack || 0) + (updated.sphereTrack || 0)) / 2;
    updated.flicking = (updated.sixshot || 0);
    updated.switching = (updated.gridshot || 0);
    onBenchmarksChange(updated);
  };

  const openAimLabTask = (link: string) => window.open(link, '_blank');

  const taskMap: Record<string, string> = { gridshot: 'gridshot', sixshot: 'sixshot', microshot: 'microshot', reflexshot: 'reflexshot', strafe_track: 'strafeTrack', smoothsphere: 'sphereTrack' };
  const hasData = localBenchmarks.gridshot > 0 || localBenchmarks.sixshot > 0 || localBenchmarks.strafeTrack > 0 || localBenchmarks.sphereTrack > 0;

  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <h2 className="text-2xl font-bold text-[var(--app-text-primary)]">Performance Test</h2>
        <p className="text-[var(--app-text-secondary)]">Run Aim Lab tasks and enter your scores</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card variant="bordered">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-[var(--app-text-primary)] font-semibold">Switching</span>
            </div>
            <button onClick={() => openAimLabTask(AIM_LAB_TASKS.switching[0].steamLink)} className="text-xs text-green-500 hover:underline flex items-center gap-1">
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
              <Zap className="w-5 h-5 text-pink-500" />
              <span className="text-[var(--app-text-primary)] font-semibold">Flicking</span>
            </div>
          </div>
          <div className="space-y-4">
            {AIM_LAB_TASKS.flicking.map((task) => (
              <div key={task.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--app-text-secondary)]">{task.name}</span>
                    <span className="text-xs text-[var(--app-text-muted)]">({task.difficulty})</span>
                  </div>
                  <button onClick={() => openAimLabTask(task.steamLink)} className="text-xs text-green-500 hover:underline flex items-center gap-1">
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
              <Crosshair className="w-5 h-5 text-purple-500" />
              <span className="text-[var(--app-text-primary)] font-semibold">Tracking</span>
            </div>
          </div>
          <div className="space-y-4">
            {AIM_LAB_TASKS.tracking.map((task) => (
              <div key={task.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--app-text-secondary)]">{task.name}</span>
                    <span className="text-xs text-[var(--app-text-muted)]">({task.difficulty})</span>
                  </div>
                  <button onClick={() => openAimLabTask(task.steamLink)} className="text-xs text-green-500 hover:underline flex items-center gap-1">
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
        {hasData ? (
          <Card variant="bordered">
            <Button onClick={runDiagnostic} disabled={analyzing} className="w-full">
              {analyzing ? (<><Loader2 className="w-5 h-5 animate-spin mr-2" /> Analyzing Performance...</>) : (<><Sparkles className="w-5 h-5 mr-2" /> Run AI Coach Analysis</>)}
            </Button>
          </Card>
        ) : (
          <Card variant="glow">
            <div className="flex items-start gap-4">
              <Award className="mt-0.5 h-5 w-5 text-green-500" />
              <div className="space-y-4">
                <p className="text-sm text-[var(--app-text-secondary)]">Enter scores from Aim Lab to get personalized AI coaching</p>
                <p className="text-xs text-[var(--app-text-muted)]">Leave empty to use default calibration</p>
              </div>
            </div>
          </Card>
        )}
      </motion.div>

      {diagnostic && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card variant="glow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${
                  diagnostic.skillTier === 'Radiant' ? 'bg-gradient-to-br from-red-500 to-orange-500' :
                  diagnostic.skillTier === 'Ascendant' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                  diagnostic.skillTier === 'Diamond' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                  diagnostic.skillTier === 'Platinum' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                  diagnostic.skillTier === 'Gold' ? 'bg-gradient-to-br from-yellow-500 to-amber-500' : 'bg-gradient-to-br from-gray-500 to-slate-600'
                }`}>
                  {diagnostic.skillTier === 'Radiant' ? '🔥' : diagnostic.skillTier === 'Ascendant' ? '💎' : diagnostic.skillTier === 'Diamond' ? '💠' : '🎯'}
                </div>
                <div>
                  <p className="text-xs text-[var(--app-text-muted)]">SKILL TIER</p>
                  <p className="text-xl font-bold text-[var(--app-text-primary)]">{diagnostic.skillTier}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--app-text-muted)]">PERCENTILE</p>
                <p className="text-xl font-bold text-[var(--app-accent)]">Top {diagnostic.percentile}%</p>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-[var(--app-surface)] p-4 text-center border border-[var(--app-border)]">
                <p className="text-xs text-[var(--app-text-muted)]">Micro</p>
                <p className="text-lg font-bold text-pink-500">{diagnostic.microScore}</p>
              </div>
              <div className="rounded-lg bg-[var(--app-surface)] p-4 text-center border border-[var(--app-border)]">
                <p className="text-xs text-[var(--app-text-muted)]">Macro</p>
                <p className="text-lg font-bold text-green-500">{diagnostic.macroScore}</p>
              </div>
              <div className="rounded-lg bg-[var(--app-surface)] p-4 text-center border border-[var(--app-border)]">
                <p className="text-xs text-[var(--app-text-muted)]">Tension</p>
                <p className="text-lg font-bold text-purple-500">{diagnostic.tensionScore}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--app-text-muted)]">Aim Style:</span>
              <span className="text-[var(--app-text-primary)] font-medium capitalize">{diagnostic.aimStyle}</span>
              <span className="text-[var(--app-text-muted)]">|</span>
              <span className="text-[var(--app-text-muted)]">Consistency:</span>
              <span className="text-[var(--app-text-primary)] font-medium">{diagnostic.consistency}%</span>
            </div>
          </Card>

          <Card variant="bordered">
            <p className="mb-4 text-[var(--app-text-primary)] font-semibold">AI Coach Analysis</p>
            <p className="text-sm text-[var(--app-text-secondary)]">{diagnostic.coachingSummary}</p>
            <p className="mt-4 text-sm text-[var(--app-accent)]">Priority: {diagnostic.priorityFocus}</p>
            {diagnostic.insight && <p className="mt-4 text-xs text-[var(--app-text-muted)]">💡 {diagnostic.insight}</p>}
          </Card>

          <Card variant="bordered">
            <p className="mb-4 text-[var(--app-text-primary)] font-semibold">Learning Resources</p>
            <div className="space-y-4">
              {diagnostic.learningGuidance.map((guide, i) => (
                <div key={i} className="space-y-4 rounded-lg bg-[var(--app-surface)] p-6 border border-[var(--app-border)]">
                  <p className="text-xs text-[var(--app-accent)] font-medium">{guide.category}</p>
                  <p className="text-sm text-[var(--app-text-primary)]">{guide.objective}</p>
                  <p className="text-xs text-[var(--app-text-muted)]">{guide.direction}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              {diagnostic.videos.map((video, i) => (
                <a key={i} href={`https://www.youtube.com/results?search_query=${video.query}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg bg-[var(--app-surface)] p-4 transition-colors hover:bg-[var(--app-surface)] border border-[var(--app-border)]">
                  <div>
                    <p className="text-sm text-[var(--app-text-primary)]">{video.title}</p>
                    <p className="text-xs text-[var(--app-text-muted)]">{video.creator} • {video.focus}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--app-text-muted)]" />
                </a>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 flex gap-4">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={onNext} className="flex-1">Calculate Results</Button>
      </motion.div>

      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} onClick={onNext} className="w-full text-center text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] transition-colors py-2">
        Skip Performance Test →
      </motion.button>
    </div>
  );
}