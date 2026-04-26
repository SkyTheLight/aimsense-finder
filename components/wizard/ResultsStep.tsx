'use client';

import { useEffect, useCallback, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FinalResults, UserSetup, ProPreset } from '@/types';
import { calculateEDPI, calculateCm360, calculateAimStyleBias, calculateVoltaicModifier, calculateFinalSensitivity, getSensitivityLabel, getSensitivityLabelWithBorderline, isBorderline, generateExplanation, getProComparison, getProRange, calculatePresetBias, getTargetCm360Range } from '@/lib/calculations';
import { analyzePlayer } from '@/lib/analysis';
import { analyzeUserWithData, convertAnalysisToCoachInput } from '@/lib/coach';
import { generateDashboard } from '@/lib/dashboard';
import { generateLearningSystem } from '@/lib/learning';
import { generateArchitecture } from '@/lib/architecture';
import { AIM_LAB_TASKS, PRACTICE_TIPS, BORDERLINE_TIPS, SENSITIVITY_TIPS } from '@/lib/constants';
import { Trophy, Save, RefreshCcw, Copy, CheckCircle, TrendingUp, TrendingDown, Minus, Lightbulb, AlertTriangle, Loader2, Target, Zap, Scale, BarChart3, Brain, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Cm360Meter from '@/components/Cm360Meter';

interface ResultsStepProps {
  setup: UserSetup | null;
  selectedPreset: ProPreset | null;
  psaValue: number | null;
  aimStyle: { mechanic: string | null; playstyle: string | null } | null;
  simplified: { tracking: number; flicking: number; switching: number } | null;
  onResults: (results: FinalResults) => void;
  onRestart: () => void;
}

export function ResultsStep({ setup, selectedPreset, psaValue, aimStyle, simplified, onResults, onRestart }: ResultsStepProps) {
  const { data: session, status: sessionStatus } = useSession();
  const [copied, setCopied] = useState(false);
  const [tipsLoading, setTipsLoading] = useState(true);
  const [personalizedTips, setPersonalizedTips] = useState<string[]>([]);
  const [activeMode, setActiveMode] = useState<'coach' | 'dashboard' | 'learning' | 'architecture'>('coach');
  const isLoggedIn = sessionStatus === 'authenticated' && !!session?.user?.id;

  if (!setup || !setup.dpi || !setup.sensitivity || !setup.game) {
    return (
      <div className="w-full space-y-12">
        <div className="bg-[var(--app-surface)] backdrop-blur-xl border border-[var(--app-border)] rounded-2xl p-8 text-center">
          <p className="text-[var(--app-text-primary)] text-lg">Loading results...</p>
          <p className="mt-4 text-sm text-[var(--app-text-muted)]">Please complete the wizard first</p>
          <button onClick={onRestart} className="mt-6 rounded-lg bg-[var(--app-accent)] px-4 py-2 text-white hover:opacity-90">Start Over</button>
        </div>
      </div>
    );
  }

  const fetchPersonalizedTips = useCallback(async () => {
    if (!setup || !simplified || !aimStyle || !setup.dpi || !setup.sensitivity) { setTipsLoading(false); return; }
    const tracking = simplified?.tracking || 5, flicking = simplified?.flicking || 5, switching = simplified?.switching || 5;
    const baseSens = psaValue || 0.4, presetBias = calculatePresetBias(selectedPreset), aimBias = calculateAimStyleBias(aimStyle?.mechanic ?? null, aimStyle?.playstyle ?? null);
    const voltaicMod = calculateVoltaicModifier(tracking, flicking, switching), finalSens = calculateFinalSensitivity(baseSens, presetBias, aimBias, voltaicMod);
    const edpi = Math.round(calculateEDPI(setup.dpi, finalSens)), cm360Val = Number(((360 * 2.54) / (setup.dpi * finalSens * (setup.game === 'valorant' ? 0.07 : setup.game === 'cs2' ? 0.022 : 1))).toFixed(2));
    const labelWithBorderline = getSensitivityLabelWithBorderline(finalSens, baseSens);
    try {
      const response = await fetch('/api/tips', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ game: setup.game, edpi, cm360: cm360Val, label: labelWithBorderline === 'borderline' ? 'balanced' : labelWithBorderline, tracking, flicking, switching, aimStyle: aimStyle?.mechanic || 'hybrid', mouseGrip: setup.mouseGrip || 'palm' }) });
      const data = await response.json();
      if (data.aiTips && Array.isArray(data.aiTips)) setPersonalizedTips(data.aiTips);
      else if (data.tips) setPersonalizedTips(data.tips);
    } catch (error) { console.error('Failed to fetch personalized tips:', error); } finally { setTipsLoading(false); }
  }, [setup, simplified, aimStyle, psaValue, selectedPreset]);

  useEffect(() => { fetchPersonalizedTips(); }, [fetchPersonalizedTips]);

  const coachAnalysis = useMemo(() => {
    if (!setup) return null;
    const analysis = analyzePlayer(setup, aimStyle?.playstyle ?? null);
    const coachInput = convertAnalysisToCoachInput(setup, analysis);
    return analyzeUserWithData(coachInput);
  }, [setup, aimStyle]);

  const dashboardData = useMemo(() => {
    if (!setup || !coachAnalysis) return null;
    const analysis = analyzePlayer(setup, aimStyle?.playstyle ?? null);
    return generateDashboard({ user: setup, analysis, history: null });
  }, [setup, aimStyle, coachAnalysis]);

  const learningData = useMemo(() => {
    if (!setup || !coachAnalysis) return null;
    const analysis = analyzePlayer(setup, aimStyle?.playstyle ?? null);
    return generateLearningSystem({ user: { grip: setup.mouseGrip, sens: setup.sensitivity, posture: setup.sittingPosture }, analysis, history: null });
  }, [setup, aimStyle, coachAnalysis]);

  const architectureData = useMemo(() => {
    return generateArchitecture();
  }, []);

  const game = setup.game;
  const tracking = simplified?.tracking || 5, flicking = simplified?.flicking || 5, switching = simplified?.switching || 5;
  const baseSens = psaValue || 0.4, presetBias = calculatePresetBias(selectedPreset), aimBias = calculateAimStyleBias(aimStyle?.mechanic ?? null, aimStyle?.playstyle ?? null);
  const voltaicMod = calculateVoltaicModifier(tracking, flicking, switching), finalSens = calculateFinalSensitivity(baseSens, presetBias, aimBias, voltaicMod);
  const edpi = calculateEDPI(setup.dpi, finalSens), cm360 = ((360 * 2.54) / (setup.dpi * finalSens * (game === 'valorant' ? 0.07 : game === 'cs2' ? 0.022 : 1)));
  const label = getSensitivityLabel(finalSens, baseSens), labelWithBorderline = getSensitivityLabelWithBorderline(finalSens, baseSens), borderlineRisk = isBorderline(finalSens, baseSens);
  const proComparison = getProComparison(edpi, game), proRange = getProRange(game);
  const tips = labelWithBorderline === 'borderline' ? SENSITIVITY_TIPS.borderline : SENSITIVITY_TIPS[labelWithBorderline === 'balanced' ? 'balanced' : labelWithBorderline === 'control' ? 'control' : 'speed'];
  const practiceTip = PRACTICE_TIPS[Math.floor(Math.random() * PRACTICE_TIPS.length)];
  const explanationLabel = labelWithBorderline === 'borderline' ? 'balanced' : labelWithBorderline;
  const explanation = generateExplanation(explanationLabel, baseSens, aimStyle || { mechanic: null, playstyle: null }, { percentile: proComparison.percentile, range: proComparison.range });

  const resultData: FinalResults = { sensitivity: finalSens, edpi, cm360: Number(cm360.toFixed(2)), label: explanationLabel, explanation, profile: `${aimStyle?.mechanic || 'hybrid'} aiming • ${aimStyle?.playstyle || 'balanced'}`, tips: { pros: tips.pros, cons: tips.cons, struggles: tips.struggles, advice: tips.advice }, comparedToPro: { percentile: proComparison.percentile, range: proComparison.range, recommendation: proComparison.recommendation } };

  const handleCopy = async () => {
    const text = `🎯 AimSense Finder Results\nSensitivity: ${finalSens}\neDPI: ${edpi}\ncm/360: ${cm360.toFixed(2)}\nStyle: ${label} (${proComparison.range} eDPI)\n\n${proComparison.recommendation}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTrendIcon = () => { if (proComparison.percentile < 35) return <TrendingDown className="w-5 h-5 text-pink-500" />; if (proComparison.percentile > 65) return <TrendingUp className="w-5 h-5 text-purple-500" />; return <Minus className="w-5 h-5 text-green-500" />; };

  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <h2 className="text-2xl font-bold text-[var(--app-text-primary)]">Your Results</h2>
        <p className="text-[var(--app-text-secondary)]">Optimized for your playstyle</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card variant="glow" className="text-center">
          <div className="mb-4 flex justify-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${label === 'control' ? 'bg-blue-500/10 text-blue-500' : label === 'speed' ? 'bg-purple-500/10 text-purple-500' : 'bg-green-500/10 text-green-500'}`}>
              {label === 'control' ? <><Target className="w-4 h-4 mr-1" /> Control</> : label === 'speed' ? <><Zap className="w-4 h-4 mr-1" /> Speed</> : <><Scale className="w-4 h-4 mr-1" /> Balanced</>}
            </span>
          </div>
          <p className="mb-1 text-xs text-[var(--app-text-muted)]">Recommended Sensitivity</p>
          <p className="mb-4 text-5xl font-mono font-bold text-green-500">{finalSens}</p>
          <div className="grid grid-cols-2 gap-4 border-t border-[var(--app-border)] pt-4">
            <div><p className="mb-1 text-xs text-[var(--app-text-muted)]">eDPI</p><p className="text-2xl font-mono font-bold text-[var(--app-text-primary)]">{edpi}</p></div>
            <div><p className="mb-1 text-xs text-[var(--app-text-muted)]">cm/360</p><p className="text-2xl font-mono font-bold text-[var(--app-text-primary)]">{cm360.toFixed(2)}</p></div>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Card variant="bordered" className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-[var(--app-text-secondary)]">Sensitivity Meter</h3>
            <span className="text-xs px-2 py-1 rounded bg-[var(--app-surface)] text-[var(--app-text-muted)]">{game.toUpperCase()}</span>
          </div>
          <Cm360Meter 
            value={cm360} 
            recommendedMin={getTargetCm360Range(game).min}
            recommendedMax={getTargetCm360Range(game).max}
          />
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card variant="bordered">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">{getTrendIcon()}</div>
              <div><p className="text-sm text-[var(--app-text-secondary)]">Compared to Pro Players</p><p className="text-lg font-bold text-[var(--app-text-primary)]">{proComparison.range}</p></div>
            </div>
            <div className="text-right"><p className="text-3xl font-mono font-bold text-green-500">{proComparison.percentile}%</p><p className="text-xs text-[var(--app-text-muted)]">percentile</p></div>
          </div>
          <div className="mt-4 space-y-4">
            <div className="mb-1 flex justify-between text-xs text-[var(--app-text-muted)]"><span>Pro Range</span><span>{proRange.min} - {proRange.max}</span></div>
            <div className="h-2 bg-[var(--app-surface)] rounded-full overflow-hidden border border-[var(--app-border)]">
              <motion.div className="h-full bg-gradient-to-r from-green-500 to-purple-500" initial={{ width: 0 }} animate={{ width: `${proComparison.percentile}%` }} transition={{ delay: 0.3, duration: 0.5 }} />
            </div>
          </div>
          <p className="mt-4 text-sm text-[var(--app-text-secondary)]">{proComparison.recommendation}</p>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card variant="bordered">
          <div className="flex items-start gap-4">
            <Lightbulb className="mt-0.5 h-5 w-5 text-green-500" />
            <div className="flex-1 space-y-4">
              <p className="text-[var(--app-text-primary)] font-semibold">💡 Pro Tips for Your Sensitivity</p>
              {tipsLoading ? (
                <div className="flex items-center justify-center py-4"><Loader2 className="w-5 h-5 text-green-500 animate-spin" /></div>
              ) : personalizedTips.length > 0 ? (
                <div className="space-y-4">
                  {personalizedTips.map((tip, index) => (
                    <div key={index} className={`rounded-lg border p-4 text-sm text-[var(--app-text-secondary)] ${index === 0 ? 'bg-green-500/5 border-green-500/20' : index === 1 ? 'bg-purple-500/5 border-purple-500/20' : 'bg-[var(--app-surface)] border-[var(--app-border)]'}`}>{tip}</div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-4"><p className="text-sm text-[var(--app-text-secondary)]">{tips.pros} {tips.advice}</p></div>
                  {tips.struggles && <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4"><p className="text-sm text-amber-300">{tips.struggles}</p></div>}
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {borderlineRisk && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card variant="bordered" className="border-amber-500/30 bg-amber-500/5">
            <div className="mb-4 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-amber-500" /><p className="text-amber-500 font-semibold">Risk Warning</p></div>
            <p className="text-sm text-[var(--app-text-secondary)]">{BORDERLINE_TIPS[Math.floor(Math.random() * BORDERLINE_TIPS.length)]}</p>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card variant="bordered">
          <div className="mb-4 flex items-center gap-3"><Trophy className="w-5 h-5 text-green-500" /><p className="text-[var(--app-text-primary)] font-semibold">Practice Recommendations</p></div>
          <div className="space-y-3">
            <p className="text-sm text-[var(--app-text-secondary)] border-l-2 border-green-500/50 pl-3">{practiceTip}</p>
            {tracking < 6 && (<div className="space-y-4"><p className="text-xs text-[var(--app-text-muted)]">Improve Tracking</p><div className="flex flex-wrap gap-2">{AIM_LAB_TASKS.tracking.slice(0, 2).map((t) => (<span key={t.id} className="text-xs px-2 py-1 rounded bg-[var(--app-surface)] text-[var(--app-text-secondary)] border border-[var(--app-border)]">{t.name}</span>))}</div></div>)}
            {flicking < 6 && (<div className="space-y-4"><p className="text-xs text-[var(--app-text-muted)]">Improve Flicking</p><div className="flex flex-wrap gap-2">{AIM_LAB_TASKS.flicking.slice(0, 2).map((t) => (<span key={t.id} className="text-xs px-2 py-1 rounded bg-[var(--app-surface)] text-[var(--app-text-secondary)] border border-[var(--app-border)]">{t.name}</span>))}</div></div>)}
            {switching < 6 && (<div className="space-y-4"><p className="text-xs text-[var(--app-text-muted)]">Improve Switching</p><div className="flex flex-wrap gap-2">{AIM_LAB_TASKS.switching.slice(0, 2).map((t) => (<span key={t.id} className="text-xs px-2 py-1 rounded bg-[var(--app-surface)] text-[var(--app-text-secondary)] border border-[var(--app-border)]">{t.name}</span>))}</div></div>)}
            {tracking >= 6 && flicking >= 6 && switching >= 6 && (<p className="text-sm text-[var(--app-text-secondary)]">Great scores! Keep practicing to maintain your skills!</p>)}
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card variant="bordered">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-green-500" /><p className="text-[var(--app-text-primary)] font-semibold">AI Engine</p></div>
            <div className="flex gap-1 bg-[var(--app-surface)] rounded-lg p-1">
              <button onClick={() => setActiveMode('coach')} className={`px-3 py-1 rounded text-xs font-medium ${activeMode === 'coach' ? 'bg-[var(--app-accent)] text-white' : 'text-[var(--app-text-muted)]'}`}>Fix</button>
              <button onClick={() => setActiveMode('dashboard')} className={`px-3 py-1 rounded text-xs font-medium ${activeMode === 'dashboard' ? 'bg-[var(--app-accent)] text-white' : 'text-[var(--app-text-muted)]'}`}>Dash</button>
              <button onClick={() => setActiveMode('learning')} className={`px-3 py-1 rounded text-xs font-medium ${activeMode === 'learning' ? 'bg-[var(--app-accent)] text-white' : 'text-[var(--app-text-muted)]'}`}>Learn</button>
              <button onClick={() => setActiveMode('architecture')} className={`px-3 py-1 rounded text-xs font-medium ${activeMode === 'architecture' ? 'bg-[var(--app-accent)] text-white' : 'text-[var(--app-text-muted)]'}`}>Sys</button>
            </div>
          </div>
        </Card>
      </motion.div>

      {activeMode === 'coach' && coachAnalysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card variant="bordered">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-[var(--app-text-primary)]">AI Coach Analysis</h3>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-[var(--app-accent)]">1. MAIN LIMITING FACTOR</h4>
                  <p className="text-[var(--app-text-secondary)]">{coachAnalysis.mainLimitingFactor}</p>
                </div>

                <div>
                  <h4 className="font-medium text-[var(--app-accent)]">2. HOLDING YOU BACK</h4>
                  {coachAnalysis.holdingBack.map((h, i) => (
                    <p key={i} className="text-[var(--app-text-secondary)]">- {h}</p>
                  ))}
                </div>

                <div>
                  <h4 className="font-medium text-[var(--app-accent)]">3. SENS CHANGE</h4>
                  <p className="text-green-500 font-medium">{coachAnalysis.sensChange}</p>
                </div>

                <div>
                  <h4 className="font-medium text-[var(--app-accent)]">4. MUST DO NEXT</h4>
                  {coachAnalysis.mustDoNext.map((m, i) => (
                    <p key={i} className="text-[var(--app-text-secondary)]">- {m}</p>
                  ))}
                </div>

                <div>
                  <h4 className="font-medium text-[var(--app-accent)]">5. FIX ORDER</h4>
                  <p className="text-green-500">1st: {coachAnalysis.fixOrder.first}</p>
                  <p className="text-green-500/80">2nd: {coachAnalysis.fixOrder.second}</p>
                  <p className="text-green-500/60 text-xs">3rd: {coachAnalysis.fixOrder.optional}</p>
                </div>

                <div>
                  <h4 className="font-medium text-[var(--app-accent)]">6. STATUS</h4>
                  <p className="text-[var(--app-text-secondary)] capitalize">{coachAnalysis.status}</p>
                </div>

                <div>
                  <h4 className="font-medium text-[var(--app-accent)]">7. NEXT STEP RULE</h4>
                  <p className="text-[var(--app-text-muted)] text-xs">{coachAnalysis.nextStepRule}</p>
                </div>

                <div className="rounded-lg bg-[var(--app-surface)] p-3 border border-[var(--app-border)]">
                  <h4 className="font-medium text-[var(--app-accent)]">8. FEEDBACK QUESTION</h4>
                  <pre className="text-xs text-[var(--app-text-muted)] mt-1 whitespace-pre-wrap">{coachAnalysis.feedbackQuestion}</pre>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {activeMode === 'dashboard' && dashboardData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card variant="bordered">
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-[var(--app-accent)]">1. PERFORMANCE TREND</h4>
                <p className="text-[var(--app-text-secondary)]">{dashboardData.performanceTrend}</p>
              </div>
              <div>
                <h4 className="font-medium text-[var(--app-accent)]">2. SCORE EVOLUTION</h4>
                <p className="text-[var(--app-text-secondary)]">Current: {dashboardData.scoreEvolution.current}/100 | Avg: {dashboardData.scoreEvolution.average}/100 | Best: {dashboardData.scoreEvolution.best}/100</p>
              </div>
              <div>
                <h4 className="font-medium text-[var(--app-accent)]">3. AIM EVOLUTION</h4>
                <p className="text-[var(--app-text-secondary)]">Type: {dashboardData.aimEvolution.current}</p>
                <p className="text-[var(--app-text-muted)] text-xs">Prev: {dashboardData.aimEvolution.previous || 'N/A'} | {dashboardData.aimEvolution.trend}</p>
              </div>
              <div>
                <h4 className="font-medium text-[var(--app-accent)]">4. ISSUE PATTERN</h4>
                <p className="text-[var(--app-text-secondary)]">{dashboardData.issuePattern.recurring.length ? dashboardData.issuePattern.recurring.join(', ') : 'None detected'}</p>
              </div>
              <div>
                <h4 className="font-medium text-[var(--app-accent)]">5. INSIGHT</h4>
                <p className="text-[var(--app-text-secondary)]">{dashboardData.improvementInsight}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {activeMode === 'learning' && learningData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card variant="bordered">
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-[var(--app-accent)]">1. PLAYER MODEL</h4>
                <p className="text-[var(--app-text-secondary)]">{learningData.playerModel}</p>
              </div>
              <div>
                <h4 className="font-medium text-[var(--app-accent)]">2. PATTERNS</h4>
                {learningData.behaviorPatterns.map((p, i) => (
                  <p key={i} className="text-[var(--app-text-secondary)]">- {p}</p>
                ))}
              </div>
              <div>
                <h4 className="font-medium text-[var(--app-accent)]">3. ADJUSTMENTS</h4>
                {learningData.ruleAdjustments.map((r, i) => (
                  <p key={i} className="text-[var(--app-text-muted)] text-xs">[{r.type}] {r.change}: {r.reason}</p>
                ))}
              </div>
              <div>
                <h4 className="font-medium text-[var(--app-accent)]">4. NEXT SESSION</h4>
                <p className="text-[var(--app-text-secondary)]">{learningData.nextSessionStrategy}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {activeMode === 'architecture' && architectureData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card variant="bordered">
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-[var(--app-accent)]">1. SYSTEM FLOW</h4>
                <p className="text-[var(--app-text-secondary)]">{architectureData.currentFlow}</p>
              </div>
              <div>
                <h4 className="font-medium text-[var(--app-accent)]">2. BOTTLENECKS</h4>
                {architectureData.bottlenecks.map((b, i) => (
                  <p key={i} className="text-[var(--app-text-muted)] text-xs">[{b.severity}] {b.location}: {b.issue}</p>
                ))}
              </div>
              <div>
                <h4 className="font-medium text-[var(--app-accent)]">3. IMPROVEMENTS</h4>
                {architectureData.improvements.map((i, idx) => (
                  <p key={idx} className="text-[var(--app-text-secondary)] text-xs">[{i.priority}] {i.area}: {i.suggestion}</p>
                ))}
              </div>
              <div>
                <h4 className="font-medium text-[var(--app-accent)]">4. UPGRADES</h4>
                {architectureData.intelligenceUpgrades.map((u, idx) => (
                  <p key={idx} className="text-[var(--app-text-muted)] text-xs">{u.type}: {u.upgrade} → {u.impact}</p>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 flex flex-wrap gap-4">
        <Button variant="secondary" onClick={handleCopy} className="flex-none">{copied ? (<><CheckCircle className="w-4 h-4 mr-2" />Copied!</>) : (<><Copy className="w-4 h-4 mr-2" />Copy</>)}</Button>
        <Button onClick={() => onResults(resultData)} className="flex-1"><Save className="w-4 h-4 mr-2" />Save</Button>
        <Button variant="ghost" onClick={onRestart}><RefreshCcw className="w-4 h-4 mr-2" />Restart</Button>
      </motion.div>

      {isLoggedIn && session?.user?.name && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex flex-col items-center gap-4 rounded-xl border border-[var(--app-accent)]/20 bg-gradient-to-r from-[var(--app-accent)]/10 to-purple-500/10 p-6">
          <p className="text-sm text-[var(--app-text-secondary)]">Share your results</p>
          <div className="flex w-full max-w-md items-center gap-4">
            <input type="text" readOnly value={`https://truesens.vercel.app/${session.user.name}`} className="flex-1 px-3 py-2 rounded-lg bg-[var(--app-surface)] text-[var(--app-text-primary)] text-sm border border-[var(--app-border)]" />
            <button onClick={handleCopy} className="px-4 py-2 rounded-lg bg-[var(--app-accent)] text-white text-sm font-medium hover:opacity-90 transition-colors">{copied ? 'Copied!' : 'Copy'}</button>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-center gap-4 py-12">
        <a href="https://steamcommunity.com/id/SkyTheLight666" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--app-surface)] border border-[var(--app-border)] hover:border-green-500 hover:bg-green-500/5 transition-all">
          <svg className="w-5 h-5 text-[#1b8be8]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.979 0C5.668 0 .527 4.92.044 11.15l4.661 6.71c.622-.332 1.367-.457 2.119-.3.752.156 1.433.562 1.946 1.175.513.613.804 1.403.804 2.23 0 .826-.29 1.617-.804 2.23-.513.613-1.194 1.02-1.946 1.175-.752.156-1.497.03-2.119-.3L.044 21.51C2.033 23.013 4.78 24 7.697 24c6.627 0 12.008-5.382 12.008-12 0-1.12-.155-2.207-.445-3.247-.29-1.04-.748-2.027-1.35-2.94C16.793 4.56 14.788 3.13 12.485 2.156 11.938 1.402 10.993.76 9.846.403 8.7.046 7.42-.06 6.153.047 4.886.154 3.716.593 2.75 1.336c-.966.743-1.68 1.77-2.068 2.976-.39 1.206-.487 2.533-.224 3.833.263 1.3.897 2.47 1.843 3.39.946.92 2.204 1.45 3.588 1.52.532.027 1.063-.012 1.585-.114.522-.102 1.023-.29 1.48-.552v-6.18c-.457.233-.917.365-1.38.365-.924 0-1.676-.752-1.676-1.676s.752-1.676 1.676-1.676c.463 0 .923.13 1.38.365V5.09c-.457-.263-.958-.45-1.48-.552-.522-.102-1.053-.14-1.585-.114-1.384.07-2.642.6-3.588 1.52-.946.92-1.58 2.09-1.843 3.39-.263 1.3-.166 2.627.224 3.833.39 1.206 1.103 2.233 2.068 2.976.966.743 2.136 1.182 3.403 1.29 1.267.107 2.497-.14 3.693-.713C14.39 20.87 16.393 19.44 17.91 17.81c1.517-1.63 2.386-3.77 2.386-6.03 0-4.552-3.692-8.244-8.244-8.244-.772 0-1.527.106-2.247.306l2.174-3.177z"/></svg>
          <span className="text-sm text-[var(--app-text-secondary)] hover:text-green-500">Made by SkyTheLight</span>
        </a>
        <span className="text-xs text-[var(--app-text-muted)]">v1.0.0</span>
      </motion.div>
    </div>
  );
}