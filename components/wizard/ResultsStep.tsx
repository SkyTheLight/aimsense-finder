'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FinalResults, UserSetup, ProPreset } from '@/types';
import {
  calculateEDPI,
  calculateAimStyleBias,
  calculateVoltaicModifier,
  calculateFinalSensitivity,
  getSensitivityLabel,
  getSensitivityLabelWithBorderline,
  isBorderline,
  generateExplanation,
  getProComparison,
  getProRange,
  calculatePresetBias,
} from '@/lib/calculations';
import { AIM_LAB_TASKS, PRACTICE_TIPS, BORDERLINE_TIPS, SENSITIVITY_TIPS } from '@/lib/constants';
import {
  Trophy,
  Activity,
  Save,
  RefreshCcw,
  Copy,
  Camera,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  Target,
  Share2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface ResultsStepProps {
  setup: UserSetup | null;
  selectedPreset: ProPreset | null;
  psaValue: number | null;
  aimStyle: { mechanic: string | null; playstyle: string | null } | null;
  simplified: { tracking: number; flicking: number; switching: number } | null;
  onResults: (results: FinalResults) => void;
  onRestart: () => void;
}

export function ResultsStep({
  setup,
  selectedPreset,
  psaValue,
  aimStyle,
  simplified,
  onResults,
  onRestart,
}: ResultsStepProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const { data: session, status: sessionStatus } = useSession();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tipsLoading, setTipsLoading] = useState(true);
  const [personalizedTips, setPersonalizedTips] = useState<string[]>([]);
  const [tipsError, setTipsError] = useState(false);

  const isLoggedIn = sessionStatus === 'authenticated' && !!session?.user?.id;

  // Guard: if no setup, render loading message
  if (!setup || !setup.dpi || !setup.sensitivity || !setup.game) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-[rgba(26,29,38,0.8)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 text-center">
          <p className="text-white text-lg">Loading results...</p>
          <p className="text-[#525a6b] text-sm mt-2">Please complete the wizard first</p>
          <button 
            onClick={onRestart}
            className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const fetchPersonalizedTips = useCallback(async () => {
    // Skip if no valid setup
    if (!setup || !simplified || !aimStyle || !setup.dpi || !setup.sensitivity) {
      setTipsLoading(false);
      setTipsError(true);
      return;
    }

    const tracking = simplified?.tracking || 5;
    const flicking = simplified?.flicking || 5;
    const switching = simplified?.switching || 5;
    const baseSens = psaValue || 0.4;
    const presetBias = calculatePresetBias(selectedPreset);
    const aimBias = calculateAimStyleBias(aimStyle?.mechanic ?? null, aimStyle?.playstyle ?? null);
    const voltaicMod = calculateVoltaicModifier(tracking, flicking, switching);
    const finalSens = calculateFinalSensitivity(baseSens, presetBias, aimBias, voltaicMod);
    const edpi = Math.round(calculateEDPI(setup.dpi, finalSens));
    const cm360Val = Number(((360 * 2.54) / (setup.dpi * finalSens * (setup.game === 'valorant' ? 0.07 : setup.game === 'cs2' ? 0.022 : 1))).toFixed(2));
    const labelWithBorderline = getSensitivityLabelWithBorderline(finalSens, baseSens);

    try {
      const response = await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: setup.game,
          edpi,
          cm360: cm360Val,
          label: labelWithBorderline === 'borderline' ? 'balanced' : labelWithBorderline,
          tracking,
          flicking,
          switching,
          aimStyle: aimStyle?.mechanic || 'hybrid',
          mouseGrip: setup.mouseGrip || 'palm',
        }),
      });
      const data = await response.json();
      if (data.tips) {
        setPersonalizedTips(data.tips);
      }
    } catch (error) {
      console.error('Failed to fetch personalized tips:', error);
      setTipsError(true);
    } finally {
      setTipsLoading(false);
    }
  }, [setup, simplified, aimStyle, psaValue, selectedPreset]);

  useEffect(() => {
    fetchPersonalizedTips();
  }, [fetchPersonalizedTips]);

  // Guard: render with safe defaults if no setup
  if (!setup) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card variant="bordered" className="text-center p-8">
          <p className="text-white">Loading results...</p>
        </Card>
      </div>
    );
  }

  const game = setup.game;
  const tracking = simplified?.tracking || 5;
  const flicking = simplified?.flicking || 5;
  const switching = simplified?.switching || 5;
  const baseSens = psaValue || 0.4;
  const presetBias = calculatePresetBias(selectedPreset);
  const aimBias = calculateAimStyleBias(aimStyle?.mechanic ?? null, aimStyle?.playstyle ?? null);
  const voltaicMod = calculateVoltaicModifier(tracking, flicking, switching);
  const finalSens = calculateFinalSensitivity(baseSens, presetBias, aimBias, voltaicMod);
  const edpi = calculateEDPI(setup.dpi, finalSens);
  const cm360 = ((360 * 2.54) / (setup.dpi * finalSens * (game === 'valorant' ? 0.07 : game === 'cs2' ? 0.022 : 1)));
  const label = getSensitivityLabel(finalSens, baseSens);
  const labelWithBorderline = getSensitivityLabelWithBorderline(finalSens, baseSens);
  const borderlineRisk = isBorderline(finalSens, baseSens);
  const proComparison = getProComparison(edpi, game);
  const proRange = getProRange(game);
  const tips = labelWithBorderline === 'borderline' ? SENSITIVITY_TIPS.borderline : SENSITIVITY_TIPS[labelWithBorderline === 'balanced' ? 'balanced' : labelWithBorderline === 'control' ? 'control' : 'speed'];
  const practiceTip = PRACTICE_TIPS[Math.floor(Math.random() * PRACTICE_TIPS.length)];
  const explanationLabel = labelWithBorderline === 'borderline' ? 'balanced' : labelWithBorderline;
  const explanation = generateExplanation(
    explanationLabel,
    baseSens,
    aimStyle || { mechanic: null, playstyle: null },
    { percentile: proComparison.percentile, range: proComparison.range }
  );

  const resultData: FinalResults = {
    sensitivity: finalSens,
    edpi,
    cm360: Number(cm360.toFixed(2)),
    label: explanationLabel,
    explanation,
    profile: `${aimStyle?.mechanic || 'hybrid'} aiming • ${aimStyle?.playstyle || 'balanced'}`,
    tips: {
      pros: tips.pros,
      cons: tips.cons,
      struggles: tips.struggles,
      advice: tips.advice,
    },
    comparedToPro: {
      percentile: proComparison.percentile,
      range: proComparison.range,
      recommendation: proComparison.recommendation,
    },
  };

  const handleScreenshot = async () => {
    if (!resultsRef.current) return;
    setSaving(true);
    try {
      // Generate text-based report instead of image
      const report = `TrueSens Results
==================
Sensitivity: ${finalSens}
eDPI: ${edpi}
cm/360: ${cm360.toFixed(2)}
Style: ${label} (${proComparison.range} eDPI)
Recommendation: ${proComparison.recommendation}

Data:
- DPI: ${setup.dpi}
- In-Game Sens: ${setup.sensitivity}
- Game: ${setup.game}
- Playstyle: ${aimStyle?.playstyle || 'balanced'}
- Grip: ${setup.mouseGrip}
`;

      const blob = new Blob([report], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `aimsense-results-${Date.now()}.txt`;
      link.click();
      URL.revokeObjectURL(link.href);
      setSaving(false);
    } catch (error) {
      console.error('Failed to save results:', error);
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    const text = `🎯 AimSense Finder Results
Sensitivity: ${finalSens}
eDPI: ${edpi}
cm/360: ${cm360.toFixed(2)}
Style: ${label} (${proComparison.range} eDPI)

${proComparison.recommendation}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTrendIcon = () => {
    if (proComparison.percentile < 35) return <TrendingDown className="w-5 h-5 text-[#ff3366]" />;
    if (proComparison.percentile > 65) return <TrendingUp className="w-5 h-5 text-[#6366f1]" />;
    return <Minus className="w-5 h-5 text-[#00ff88]" />;
  };

  return (
    <div className="space-y-6" ref={resultsRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Your Results</h2>
        <p className="text-[#94a3b8]">Optimized for your playstyle</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="glow" className="text-center">
          <div className="flex justify-center mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              label === 'control' ? 'bg-[#3b82f6]/10 text-[#3b82f6]' :
              label === 'speed' ? 'bg-[#6366f1]/10 text-[#6366f1]' :
              'bg-[#00ff88]/10 text-[#00ff88]'
            }`}>
              {label === 'control' ? '🎯 Control' : label === 'speed' ? '⚡ Speed' : '⚖️ Balanced'}
            </span>
          </div>

          <p className="text-xs text-[#64748b] mb-1">Recommended Sensitivity</p>
          <p className="text-5xl font-mono font-bold text-[#00ff88] mb-4">{finalSens}</p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2a2a3a]">
            <div>
              <p className="text-xs text-[#64748b] mb-1">eDPI</p>
              <p className="text-2xl font-mono font-bold text-white">{edpi}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748b] mb-1">cm/360</p>
              <p className="text-2xl font-mono font-bold text-white">{cm360.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card variant="bordered">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
                {getTrendIcon()}
              </div>
              <div>
                <p className="text-sm text-[#94a3b8]">Compared to Pro Players</p>
                <p className="text-lg font-bold text-white">{proComparison.range}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-mono font-bold text-[#00ff88]">{proComparison.percentile}%</p>
              <p className="text-xs text-[#64748b]">percentile</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-[#64748b] mb-1">
              <span>Pro Range</span>
              <span>{proRange.min} - {proRange.max}</span>
            </div>
            <div className="h-2 bg-[#1a1a24] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00ff88] to-[#6366f1]"
                initial={{ width: 0 }}
                animate={{ width: `${proComparison.percentile}%` }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </div>
          </div>
          <p className="text-sm text-[#94a3b8] mt-4">{proComparison.recommendation}</p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="bordered">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#00ff88] mt-0.5" />
            <div className="flex-1">
              <p className="text-white font-semibold mb-3">💡 Pro Tips for Your Sensitivity</p>
              {tipsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 text-[#00ff88] animate-spin" />
                </div>
              ) : personalizedTips.length > 0 ? (
                <div className="space-y-2">
                  {personalizedTips.map((tip, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border text-sm text-[#94a3b8] ${
                        index === 0 ? 'bg-[#00ff88]/5 border-[#00ff88]/20' :
                        index === 1 ? 'bg-[#6366f1]/5 border-[#6366f1]/20' :
                        'bg-[#1a1a24] border-[#2a2a3a]'
                      }`}
                    >
                      {tip}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-[rgba(255,255,255,0.04)] rounded-lg border border-[rgba(255,255,255,0.08)]">
                    <p className="text-sm text-[#b8c0cd]">{tips.pros} {tips.advice}</p>
                  </div>
                  {tips.struggles && (
                    <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <p className="text-sm text-amber-300">{tips.struggles}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {borderlineRisk && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="bordered" className="border-[#f59e0b]/30 bg-[#f59e0b]/5">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
              <p className="text-[#f59e0b] font-semibold">Risk Warning</p>
            </div>
            <p className="text-sm text-[#94a3b8]">
              {BORDERLINE_TIPS[Math.floor(Math.random() * BORDERLINE_TIPS.length)]}
            </p>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card variant="bordered">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-[#00ff88]" />
            <p className="text-white font-semibold">Practice Recommendations</p>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-[#94a3b8] border-l-2 border-[#00ff88]/50 pl-3">
              {practiceTip}
            </p>
            {tracking < 6 && (
              <div>
                <p className="text-xs text-[#64748b] mb-2">Improve Tracking</p>
                <div className="flex flex-wrap gap-2">
                  {AIM_LAB_TASKS.tracking.slice(0, 2).map((t) => (
                    <span key={t.id} className="text-xs px-2 py-1 rounded bg-[#1a1a24] text-[#94a3b8]">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {flicking < 6 && (
              <div>
                <p className="text-xs text-[#64748b] mb-2">Improve Flicking</p>
                <div className="flex flex-wrap gap-2">
                  {AIM_LAB_TASKS.flicking.slice(0, 2).map((t) => (
                    <span key={t.id} className="text-xs px-2 py-1 rounded bg-[#1a1a24] text-[#94a3b8]">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {switching < 6 && (
              <div>
                <p className="text-xs text-[#64748b] mb-2">Improve Switching</p>
                <div className="flex flex-wrap gap-2">
                  {AIM_LAB_TASKS.switching.slice(0, 2).map((t) => (
                    <span key={t.id} className="text-xs px-2 py-1 rounded bg-[#1a1a24] text-[#94a3b8]">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {tracking >= 6 && flicking >= 6 && switching >= 6 && (
              <p className="text-sm text-[#94a3b8]">Great scores! Keep practicing to maintain your skills!</p>
            )}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-3"
      >
        <Button variant="secondary" onClick={handleCopy} className="flex-1 sm:flex-none">
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </>
          )}
        </Button>
        <Button onClick={() => onResults(resultData)} className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
      </motion.div>

      {/* Share URL */}
      {isLoggedIn && session?.user?.name && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20"
        >
          <p className="text-sm text-[#94a3b8]">Share your results</p>
          <div className="flex items-center gap-2 w-full max-w-md">
            <input 
              type="text" 
              readOnly 
              value={`https://truesens.vercel.app/${session.user.name}`}
              className="flex-1 px-3 py-2 rounded-lg bg-[#1a1a24] text-white text-sm border border-[#2a2a3a]"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-400 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-3 pt-8 pb-4"
      >
        <a 
          href="https://steamcommunity.com/id/SkyTheLight666" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#00ff88] hover:bg-[#00ff88]/5 transition-all"
        >
          <svg className="w-5 h-5 text-[#1b8be8]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.979 0C5.668 0 .527 4.92.044 11.15l4.661 6.71c.622-.332 1.367-.457 2.119-.3.752.156 1.433.562 1.946 1.175.513.613.804 1.403.804 2.23 0 .826-.29 1.617-.804 2.23-.513.613-1.194 1.02-1.946 1.175-.752.156-1.497.03-2.119-.3L.044 21.51C2.033 23.013 4.78 24 7.697 24c6.627 0 12.008-5.382 12.008-12 0-1.12-.155-2.207-.445-3.247-.29-1.04-.748-2.027-1.35-2.94C16.793 4.56 14.788 3.13 12.485 2.156 11.938 1.402 10.993.76 9.846.403 8.7.046 7.42-.06 6.153.047 4.886.154 3.716.593 2.75 1.336c-.966.743-1.68 1.77-2.068 2.976-.39 1.206-.487 2.533-.224 3.833.263 1.3.897 2.47 1.843 3.39.946.92 2.204 1.45 3.588 1.52.532.027 1.063-.012 1.585-.114.522-.102 1.023-.29 1.48-.552v-6.18c-.457.233-.917.365-1.38.365-.924 0-1.676-.752-1.676-1.676s.752-1.676 1.676-1.676c.463 0 .923.13 1.38.365V5.09c-.457-.263-.958-.45-1.48-.552-.522-.102-1.053-.14-1.585-.114-1.384.07-2.642.6-3.588 1.52-.946.92-1.58 2.09-1.843 3.39-.263 1.3-.166 2.627.224 3.833.39 1.206 1.103 2.233 2.068 2.976.966.743 2.136 1.182 3.403 1.29 1.267.107 2.497-.14 3.693-.713C14.39 20.87 16.393 19.44 17.91 17.81c1.517-1.63 2.386-3.77 2.386-6.03 0-4.552-3.692-8.244-8.244-8.244-.772 0-1.527.106-2.247.306l2.174-3.177z"/>
          </svg>
          <span className="text-sm text-[#94a3b8] hover:text-[#00ff88]">Made by SkyTheLight</span>
        </a>
        <span className="text-xs text-[#3a3a4a]">v1.0.0</span>
      </motion.div>
    </div>
  );
}