'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProPreset, UserSetup } from '@/types';
import { PRO_PRESETS, PRO_eDPI_RANGES } from '@/lib/constants';
import { getProRange } from '@/lib/calculations';
import { calculateEDPI, getFilteredPresets, suggestPresets } from '@/lib/calculations';
import { Users, Crosshair, Info } from 'lucide-react';

interface PresetStepProps {
  setup: UserSetup | null;
  selectedPreset: ProPreset | null;
  onPresetChange: (preset: ProPreset | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PresetStep({
  setup,
  selectedPreset,
  onPresetChange,
  onNext,
  onBack,
}: PresetStepProps) {
  if (!setup) return null;

  const game = setup.game;
  const userEDPI = calculateEDPI(setup.dpi, setup.sensitivity);
  const proRange = getProRange(game);
  const gamePresets = getFilteredPresets(game);
  const suggestedPresets = suggestPresets(userEDPI, game);

  const handlePresetSelect = (preset: ProPreset) => {
    if (selectedPreset?.id === preset.id) {
      onPresetChange(null);
    } else {
      onPresetChange(preset);
    }
  };

  const isUserInProRange = userEDPI >= proRange.min && userEDPI <= proRange.max;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Pro Presets</h2>
        <p className="text-[#94a3b8]">Choose your target playstyle or skip</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="bordered" className="bg-[#1a1a24]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#00ff88]" />
              <span className="text-sm text-[#94a3b8]">Your Current eDPI</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-mono font-bold text-white">{userEDPI}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748b]">Pro range: {proRange.min} - {proRange.max}</span>
            <span className={`px-2 py-0.5 rounded ${isUserInProRange ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'bg-[#ff3366]/10 text-[#ff3366]'}`}>
              {isUserInProRange ? '✓ In pro range' : '✗ Outside pro range'}
            </span>
          </div>
        </Card>
      </motion.div>

      {suggestedPresets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <p className="text-sm text-[#94a3b8] mb-3 flex items-center gap-2">
            <Crosshair className="w-4 h-4" />
            Suggested for your eDPI
          </p>
          <div className="grid grid-cols-3 gap-3">
            {suggestedPresets.map((preset) => {
              const isSelected = selectedPreset?.id === preset.id;
              const midPoint = (preset.edpiRange.min + preset.edpiRange.max) / 2;
              const diff = Math.abs(userEDPI - midPoint);
              const matchPercent = Math.max(0, 100 - (diff / midPoint) * 100);

              return (
                <motion.button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all text-left
                    ${isSelected
                      ? 'border-[#00ff88] bg-[#00ff88]/5'
                      : 'border-[#2a2a3a] bg-[#12121a] hover:border-[#4a4a5a]'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{preset.icon}</span>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
                    )}
                  </div>
                  <p className={`font-semibold text-sm ${isSelected ? 'text-[#00ff88]' : 'text-white'}`}>
                    {preset.name}
                  </p>
                  <p className="text-xs text-[#64748b] mb-2">{preset.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64748b]">{preset.edpiRange.min}-{preset.edpiRange.max} eDPI</span>
                    <span className="text-[#00ff88]">{matchPercent.toFixed(0)}% match</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm text-[#94a3b8] mb-3">All {game} presets</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
          {gamePresets.map((preset) => {
            const isSelected = selectedPreset?.id === preset.id;
            return (
              <motion.button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-3 rounded-xl border-2 transition-all text-left
                  ${isSelected
                    ? 'border-[#00ff88] bg-[#00ff88]/5'
                    : 'border-[#2a2a3a] bg-[#12121a] hover:border-[#4a4a5a]'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{preset.icon}</span>
                    <span className={`font-medium text-xs ${isSelected ? 'text-[#00ff88]' : 'text-white'}`}>
                      {preset.name}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex gap-3"
      >
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          {selectedPreset ? `Calibrate from ${selectedPreset.name}` : 'Skip to Calibration'}
        </Button>
      </motion.div>
    </div>
  );
}