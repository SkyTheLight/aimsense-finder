'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FinalResults, UserSetup, ProPreset } from '@/types';
import {
  calculateEDPI,
  calculateAimStyleBias,
  calculateVoltaicModifier,
  calculateFinalSensitivity,
  getSensitivityLabel,
  generateExplanation,
  getProComparison,
  calculatePresetBias,
} from '@/lib/calculations';
import { AIM_LAB_TASKS, SENSITIVITY_TIPS } from '@/lib/constants';
import { getProRange } from '@/lib/calculations';
import {
  Trophy,
  Activity,
  Save,
  RefreshCcw,
  Copy,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  Target,
  Share2,
} from 'lucide-react';
import { useState } from 'react';

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
  const [copied, setCopied] = useState(false);

  if (!setup) return null;

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
  const proComparison = getProComparison(edpi, game);
  const proRange = getProRange(game);
  const tips = SENSITIVITY_TIPS[label];

  const explanation = generateExplanation(
    label,
    baseSens,
    aimStyle || { mechanic: null, playstyle: null },
    { percentile: proComparison.percentile, range: proComparison.range }
  );

  const resultData: FinalResults = {
    sensitivity: finalSens,
    edpi,
    cm360: Number(cm360.toFixed(2)),
    label,
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
    <div className="space-y-6">
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
            <div>
              <p className="text-white font-semibold mb-3">💡 Pro Tips for Your Sensitivity</p>
              <div className="space-y-3">
                <div className="p-3 bg-[#00ff88]/5 rounded-lg border border-[#00ff88]/20">
                  <p className="text-xs text-[#00ff88] font-semibold">✅ Good</p>
                  <p className="text-sm text-[#94a3b8]">{tips.pros}</p>
                </div>
                <div className="p-3 bg-[#ff3366]/5 rounded-lg border border-[#ff3366]/20">
                  <p className="text-xs text-[#ff3366] font-semibold">⚠️ Watch Out</p>
                  <p className="text-sm text-[#94a3b8]">{tips.cons}</p>
                </div>
                <div className="p-3 bg-[#f59e0b]/5 rounded-lg border border-[#f59e0b]/20">
                  <p className="text-xs text-[#f59e0b] font-semibold">🎯 Struggles</p>
                  <p className="text-sm text-[#94a3b8]">{tips.struggles}</p>
                </div>
                <div className="p-3 bg-[#6366f1]/5 rounded-lg border border-[#6366f1]/20">
                  <p className="text-xs text-[#6366f1] font-semibold">💪 Advice</p>
                  <p className="text-sm text-[#94a3b8]">{tips.advice}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

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
              <p className="text-sm text-[#94a3b8]">Keep practicing to maintain your skills!</p>
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
              Copy Text
            </>
          )}
        </Button>
        <Button variant="secondary" onClick={() => {
          const shareText = `🎯 My AimSense: ${finalSens} sens (${label})\neDPI: ${edpi} | cm/360: ${cm360.toFixed(2)}\n${proComparison.range} percentile\n\n#AimSenseFinder`;
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
          window.open(twitterUrl, '_blank');
        }} className="flex-1 sm:flex-none">
          <Share2 className="w-4 h-4 mr-2" />
          Share
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
    </div>
  );
}