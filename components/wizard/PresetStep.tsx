'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProPreset, UserSetup, ProPlayer } from '@/types';
import { PRO_PRESETS, PRO_eDPI_RANGES } from '@/lib/constants';
import { getProRange, calculateEDPI, getFilteredPresets, suggestPresets } from '@/lib/calculations';
import { Users, Crosshair, Info, Sparkles, Trophy } from 'lucide-react';

interface PresetStepProps { setup: UserSetup | null; selectedPreset: ProPreset | null; selectedAimStyle: string | null; selectedGrip: string | null; onPresetChange: (preset: ProPreset | null) => void; onNext: () => void; onBack: () => void; }

export function PresetStep({ setup, selectedPreset, selectedAimStyle, selectedGrip, onPresetChange, onNext, onBack }: PresetStepProps) {
  const [proRecommendations, setProRecommendations] = useState<ProPlayer[]>([]);
  const [loadingPros, setLoadingPros] = useState(false);
  const [showPros, setShowPros] = useState(false);

  useEffect(() => {
    if (!setup || !selectedAimStyle || !selectedGrip) return;
    const fetchProRecommendations = async () => {
      setLoadingPros(true);
      try { const res = await fetch(`/api/pros?game=${setup.game}&edpi=${calculateEDPI(setup.dpi, setup.sensitivity)}&aimStyle=${selectedAimStyle}&grip=${selectedGrip}`); const data = await res.json(); setProRecommendations(data.recommendations || []); }
      catch (err) { console.error('Failed to fetch pro recommendations:', err); }
      finally { setLoadingPros(false); }
    };
    fetchProRecommendations();
  }, [setup, selectedAimStyle, selectedGrip]);

  if (!setup) return null;
  const game = setup.game, userEDPI = calculateEDPI(setup.dpi, setup.sensitivity), proRange = getProRange(game), gamePresets = getFilteredPresets(game), suggestedPresets = suggestPresets(userEDPI, game);
  const isUserInProRange = userEDPI >= proRange.min && userEDPI <= proRange.max;
  const handlePresetSelect = (preset: ProPreset) => { if (selectedPreset?.id === preset.id) onPresetChange(null); else onPresetChange(preset); };

  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <h2 className="text-2xl font-bold text-[var(--app-text-primary)]">Pro Presets</h2>
        <p className="text-[var(--app-text-secondary)]">Choose your target playstyle or skip</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card variant="bordered" className="bg-[var(--app-surface)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3"><Users className="w-5 h-5 text-green-500" /><span className="text-sm text-[var(--app-text-secondary)]">Your Current eDPI</span></div>
            <div className="text-right"><span className="text-2xl font-mono font-bold text-[var(--app-text-primary)]">{userEDPI}</span></div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--app-text-muted)]">Pro range: {proRange.min} - {proRange.max}</span>
            <span className={`px-2 py-0.5 rounded ${isUserInProRange ? 'bg-green-500/10 text-green-500' : 'bg-pink-500/10 text-pink-500'}`}>{isUserInProRange ? '✓ In pro range' : '✗ Outside pro range'}</span>
          </div>
        </Card>
      </motion.div>

      {proRecommendations.length > 0 && !showPros && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Card variant="bordered" className="bg-[var(--app-surface)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-green-500" /><span className="text-sm text-[var(--app-text-primary)] font-medium">AI Pro Matching</span></div>
              <span className="text-xs text-[var(--app-text-muted)]">Based on your eDPI & aim style</span>
            </div>
            <div className="mb-4 space-y-4">
              {proRecommendations.slice(0, 3).map((pro, idx) => (
                <div key={pro.name} className="flex items-center justify-between rounded-lg bg-[var(--app-surface)] p-4 border border-[var(--app-border)]">
                  <div className="flex items-center gap-2"><span className={`text-sm font-bold ${idx === 0 ? 'text-yellow-500' : 'text-[var(--app-text-secondary)]'}`}>#{idx + 1}</span><span className="text-[var(--app-text-primary)] text-sm">{pro.name}</span><span className="text-xs text-[var(--app-text-muted)]">({pro.country})</span></div>
                  <div className="flex items-center gap-3 text-xs"><span className="text-[var(--app-text-secondary)]">{pro.dpi} DPI</span><span className="text-[var(--app-text-primary)] font-mono">{pro.sens}</span></div>
                </div>
              ))}
            </div>
            <Button variant="secondary" onClick={() => setShowPros(true)} className="w-full">View All Matches</Button>
          </Card>
        </motion.div>
      )}

      {showPros && proRecommendations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="mb-4 flex items-center justify-between"><p className="text-sm text-[var(--app-text-secondary)] flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500" />Top Pro Player Matches</p><button onClick={() => setShowPros(false)} className="text-xs text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]">Hide</button></div>
          <div className="max-h-48 space-y-4 overflow-y-auto">
            {proRecommendations.map((pro, idx) => (
              <div key={pro.name} className="flex items-center justify-between p-3 rounded-xl bg-[var(--app-surface)] border border-[var(--app-border)]">
                <div className="flex items-center gap-3"><span className={`text-sm font-bold w-6 ${idx < 3 ? 'text-yellow-500' : 'text-[var(--app-text-muted)]'}`}>#{idx + 1}</span><div><p className="text-[var(--app-text-primary)] font-medium">{pro.name}</p><p className="text-xs text-[var(--app-text-muted)]">{pro.role} • {pro.country}</p></div></div>
                <div className="text-right"><p className="text-[var(--app-text-primary)] font-mono">{pro.edpi} eDPI</p><p className="text-xs text-[var(--app-text-muted)]">{pro.aimStyle} • {pro.grip}</p></div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mb-6 flex items-center gap-2 text-xs text-[var(--app-text-muted)]"><Info className="w-3 h-3" /><span>Pro data from prosettings.net</span></div>

      {suggestedPresets.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <p className="mb-4 flex items-center gap-2 text-sm text-[var(--app-text-secondary)]"><Crosshair className="w-4 h-4" />Suggested for your eDPI</p>
          <div className="grid grid-cols-3 gap-4">
            {suggestedPresets.map((preset) => {
              const isSelected = selectedPreset?.id === preset.id;
              const midPoint = (preset.edpiRange.min + preset.edpiRange.max) / 2;
              const diff = Math.abs(userEDPI - midPoint);
              const matchPercent = Math.max(0, 100 - (diff / midPoint) * 100);
              return (
                <motion.button key={preset.id} onClick={() => handlePresetSelect(preset)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`relative rounded-xl border-2 p-6 text-left transition-all ${isSelected ? 'border-green-500 bg-green-500/5' : 'border-[var(--app-border)] bg-[var(--app-surface)] hover:border-green-500/50'}`}>
                  <div className="mb-4 flex items-center justify-between"><span className="text-lg">{preset.icon}</span>{isSelected && <div className="w-2 h-2 rounded-full bg-green-500" />}</div>
                  <p className={`font-semibold text-sm ${isSelected ? 'text-green-500' : 'text-[var(--app-text-primary)]'}`}>{preset.name}</p>
                  <p className="mb-4 text-xs text-[var(--app-text-muted)]">{preset.description}</p>
                  <div className="flex items-center justify-between text-xs"><span className="text-[var(--app-text-muted)]">{preset.edpiRange.min}-{preset.edpiRange.max} eDPI</span><span className="text-green-500">{matchPercent.toFixed(0)}% match</span></div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p className="mb-4 text-sm text-[var(--app-text-secondary)]">All {game} presets</p>
        <div className="grid max-h-64 grid-cols-2 gap-4 overflow-y-auto sm:grid-cols-3">
          {gamePresets.map((preset) => {
            const isSelected = selectedPreset?.id === preset.id;
            return (
              <motion.button key={preset.id} onClick={() => handlePresetSelect(preset)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`rounded-xl border-2 p-4 text-left transition-all ${isSelected ? 'border-green-500 bg-green-500/5' : 'border-[var(--app-border)] bg-[var(--app-surface)] hover:border-green-500/50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="text-base">{preset.icon}</span><span className={`font-medium text-xs ${isSelected ? 'text-green-500' : 'text-[var(--app-text-primary)]'}`}>{preset.name}</span></div>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-green-500" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-6 flex gap-4">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={onNext} className="flex-1">{selectedPreset ? `Calibrate from ${selectedPreset.name}` : 'Skip to Calibration'}</Button>
      </motion.div>
    </div>
  );
}