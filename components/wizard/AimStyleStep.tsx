'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SelectionGrid } from '@/components/ui/SelectionGrid';
import { AimStyleData, AimingMechanic, Playstyle } from '@/types';
import { Hand, Zap, Crosshair, Activity, Lightbulb, Dumbbell, RefreshCw, Target, Scale } from 'lucide-react';

interface AimStyleStepProps {
  aimStyle: AimStyleData | null;
  onAimStyleChange: (aimStyle: AimStyleData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AimStyleStep({
  aimStyle,
  onAimStyleChange,
  onNext,
  onBack,
}: AimStyleStepProps) {
  const mechanics: { value: AimingMechanic; label: string; icon: React.ReactNode; description: string }[] = [
    { value: 'wrist', label: 'Wrist', icon: <Hand className="w-5 h-5" />, description: 'Small movements, fast flicks' },
    { value: 'arm', label: 'Arm', icon: <Dumbbell className="w-5 h-5" />, description: 'Large movements, smooth' },
    { value: 'hybrid', label: 'Hybrid', icon: <RefreshCw className="w-5 h-5" />, description: 'Balanced approach' },
  ];

  const playstyles: { value: Playstyle; label: string; icon: React.ReactNode; description: string }[] = [
    { value: 'flick', label: 'Fast Flicks', icon: <Zap className="w-5 h-5" />, description: 'Quick reactions' },
    { value: 'tracking', label: 'Tracking', icon: <Target className="w-5 h-5" />, description: 'Smooth following' },
    { value: 'balanced', label: 'Balanced', icon: <Scale className="w-5 h-5" />, description: 'Both equally' },
  ];

  const isComplete = aimStyle?.mechanic && aimStyle?.playstyle;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Aim Style Detection</h2>
        <p className="text-[#94a3b8]">How you play</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="bordered">
          <div className="flex items-center gap-3 mb-4">
            <Hand className="w-5 h-5 text-[#00ff88]" />
            <h3 className="text-white font-semibold">Aiming Mechanic</h3>
          </div>
          <SelectionGrid
            options={mechanics}
            value={aimStyle?.mechanic || null}
            onChange={(mechanic) => onAimStyleChange({ ...aimStyle!, mechanic, playstyle: aimStyle?.playstyle || null })}
            columns={3}
          />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="bordered">
          <div className="flex items-center gap-3 mb-4">
            <Crosshair className="w-5 h-5 text-[#00ff88]" />
            <h3 className="text-white font-semibold">Playstyle Preference</h3>
          </div>
          <SelectionGrid
            options={playstyles}
            value={aimStyle?.playstyle || null}
            onChange={(playstyle) => onAimStyleChange({ ...aimStyle!, mechanic: aimStyle?.mechanic || null, playstyle })}
            columns={3}
          />
        </Card>
      </motion.div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glow" className="text-center">
            <Activity className="w-8 h-8 text-[#00ff88] mx-auto mb-3" />
            <p className="text-white font-semibold">
              {aimStyle!.mechanic === 'wrist'
                ? 'Wrist Aimer'
                : aimStyle!.mechanic === 'arm'
                  ? 'Arm Aimer'
                  : 'Hybrid Aimer'}{' '}
              •{' '}
              {aimStyle!.playstyle === 'flick'
                ? 'Flick-focused'
                : aimStyle!.playstyle === 'tracking'
                  ? 'Tracking-focused'
                  : 'Balanced'}
            </p>
            <p className="text-sm text-[#94a3b8] mt-1">
              This profile will adjust your final sensitivity
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
