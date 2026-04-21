'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SelectionGrid } from '@/components/ui/SelectionGrid';
import { UserSetup, Game } from '@/types';
import { calculateEDPI, calculateCm360, getGameConfig, getCm360Feedback, getProComparison } from '@/lib/calculations';
import { SENSITIVITY_LIMITS } from '@/lib/constants';
import { Mouse, Crosshair, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SetupStepProps {
  setup: UserSetup | null;
  onSetupChange: (setup: UserSetup) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SetupStep({ setup, onSetupChange, onNext, onBack }: SetupStepProps) {
  const dpi = setup?.dpi || 800;
  const sensitivity = setup?.sensitivity || 0.5;
  const game = setup?.game || 'valorant';

  const gameConfig = useMemo(() => getGameConfig(game), [game]);

  const edpi = useMemo(() => calculateEDPI(dpi, sensitivity), [dpi, sensitivity]);
  const cm360 = useMemo(
    () => calculateCm360(dpi, sensitivity, game),
    [dpi, sensitivity, game]
  );
  const cm360Feedback = useMemo(() => getCm360Feedback(cm360, game), [cm360, game]);
  const proComparison = useMemo(() => getProComparison(edpi, game), [edpi, game]);

  const games: { value: Game; label: string; icon: string }[] = [
    { value: 'valorant', label: 'Valorant', icon: '🎯' },
    { value: 'cs2', label: 'CS2', icon: '🔫' },
    { value: 'apex', label: 'Apex', icon: '⚡' },
    { value: 'overwatch2', label: 'OW2', icon: '🛡️' },
    { value: 'cod', label: 'CoD', icon: '🎮' },
    { value: 'r6', label: 'R6', icon: '🔰' },
  ];

  const handleDpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      SENSITIVITY_LIMITS.minDPI,
      Math.min(SENSITIVITY_LIMITS.maxDPI, Number(e.target.value) || SENSITIVITY_LIMITS.minDPI)
    );
    onSetupChange({ dpi: value, sensitivity, game });
  };

  const handleSensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      SENSITIVITY_LIMITS.min,
      Math.min(SENSITIVITY_LIMITS.max, Number(e.target.value) || SENSITIVITY_LIMITS.min)
    );
    onSetupChange({ dpi, sensitivity: value, game });
  };

  const handleGameChange = (newGame: Game) => {
    onSetupChange({ dpi, sensitivity, game: newGame });
  };

  const isValid = dpi >= SENSITIVITY_LIMITS.minDPI && sensitivity >= SENSITIVITY_LIMITS.min && dpi > 0 && sensitivity > 0;

  const getTrendIcon = () => {
    if (proComparison.percentile < 35) return <TrendingDown className="w-4 h-4 text-[#ff3366]" />;
    if (proComparison.percentile > 65) return <TrendingUp className="w-4 h-4 text-[#6366f1]" />;
    return <Minus className="w-4 h-4 text-[#00ff88]" />;
  };

  const getCm360Color = () => {
    if (cm360Feedback.status === 'fast') return 'text-[#6366f1]';
    if (cm360Feedback.status === 'slow') return 'text-[#f59e0b]';
    if (cm360Feedback.status === 'ideal') return 'text-[#00ff88]';
    return 'text-white';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Setup Your Gear</h2>
        <p className="text-[#94a3b8]">Enter your current mouse settings</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <Card variant="bordered">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
              <Mouse className="w-5 h-5 text-[#00ff88]" />
            </div>
            <div>
              <p className="text-sm text-[#94a3b8]">Mouse DPI</p>
              <Input
                type="number"
                value={dpi}
                onChange={handleDpiChange}
                min={SENSITIVITY_LIMITS.minDPI}
                max={SENSITIVITY_LIMITS.maxDPI}
                className="font-mono text-lg h-10"
              />
            </div>
          </div>
        </Card>

        <Card variant="bordered">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
              <Crosshair className="w-5 h-5 text-[#00ff88]" />
            </div>
            <div>
              <p className="text-sm text-[#94a3b8]">In-Game Sens</p>
              <Input
                type="number"
                step="0.01"
                value={sensitivity}
                onChange={handleSensChange}
                min={SENSITIVITY_LIMITS.min}
                max={SENSITIVITY_LIMITS.max}
                className="font-mono text-lg h-10"
              />
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
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-[#00ff88]" />
            <span className="text-sm text-[#94a3b8]">Selected Game</span>
          </div>
          <SelectionGrid
            options={games}
            value={game}
            onChange={handleGameChange}
            columns={3}
          />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="glow" className="text-center">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-[#64748b] mb-1">eDPI</p>
              <p className="text-2xl font-mono font-bold text-[#00ff88]">{edpi}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748b] mb-1">cm/360</p>
              <p className={`text-2xl font-mono font-bold ${getCm360Color()}`}>{cm360}</p>
            </div>
          </div>
          <div className="pt-3 border-t border-[#2a2a3a]">
            <div className="flex items-center justify-center gap-2 mb-1">
              {getTrendIcon()}
              <span className="text-sm text-[#94a3b8]">
                {proComparison.range} compared to {gameConfig.name} pros
              </span>
            </div>
            <p className="text-xs text-[#64748b]">{cm360Feedback.message}</p>
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
        <Button onClick={onNext} disabled={!isValid} className="flex-1">
          Continue
        </Button>
      </motion.div>
    </div>
  );
}