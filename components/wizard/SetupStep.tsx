'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SelectionGrid } from '@/components/ui/SelectionGrid';
import { UserSetup, Game, MOUSE_GRIPS, AIMING_MECHANICS } from '@/types';
import { calculateEDPI, calculateCm360, getGameConfig, getCm360Feedback, getProComparison } from '@/lib/calculations';
import { SENSITIVITY_LIMITS } from '@/lib/constants';
import { Mouse, Crosshair, Activity, Hand, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SetupStepProps {
  setup: UserSetup | null;
  onSetupChange: (setup: UserSetup) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SetupStep({ setup, onSetupChange, onNext, onBack }: SetupStepProps) {
  const dpi = setup?.dpi || 0;
  const sensitivity = setup?.sensitivity || 0;
  const game = setup?.game || 'valorant';
  const mouseGrip = setup?.mouseGrip || null;
  const aimingMechanic = setup?.aimingMechanic || null;

  const gameConfig = useMemo(() => getGameConfig(game), [game]);

  const edpi = useMemo(() => dpi > 0 && sensitivity > 0 ? calculateEDPI(dpi, sensitivity) : 0, [dpi, sensitivity]);
  const cm360 = useMemo(
    () => dpi > 0 && sensitivity > 0 ? calculateCm360(dpi, sensitivity, game) : 0,
    [dpi, sensitivity, game]
  );
  const cm360Feedback = useMemo(() => cm360 > 0 ? getCm360Feedback(cm360, game) : { status: '', message: 'Enter values above' }, [cm360, game]);
  const proComparison = useMemo(() => edpi > 0 ? getProComparison(edpi, game) : { percentile: 50, range: 'Average', recommendation: '' }, [edpi, game]);

  const getGameLabel = (g: Game) => {
    const labels: Record<Game, string> = {
      valorant: 'Valorant', cs2: 'CS2', apex: 'Apex Legends',
      overwatch2: 'Overwatch 2', cod: 'Call of Duty', r6: 'Rainbow Six'
    };
    return labels[g];
  };
  const games: { value: Game; label: string; icon: string }[] = [
    { value: 'valorant', label: getGameLabel('valorant'), icon: 'valorant' },
    { value: 'cs2', label: getGameLabel('cs2'), icon: 'cs2' },
    { value: 'apex', label: 'Apex Legends', icon: 'apex' },
    { value: 'overwatch2', label: 'Overwatch 2', icon: 'overwatch2' },
    { value: 'cod', label: 'Call of Duty', icon: 'cod' },
    { value: 'r6', label: 'Rainbow Six', icon: 'r6' },
  ];

  const handleDpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const value = val === '' ? 0 : Math.max(0, Math.min(SENSITIVITY_LIMITS.maxDPI, Number(val)));
    onSetupChange({ dpi: value, sensitivity, game, mouseGrip, aimingMechanic });
  };

  const handleSensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const value = val === '' ? 0 : Math.max(0, Math.min(SENSITIVITY_LIMITS.max, Number(val)));
    onSetupChange({ dpi, sensitivity: value, game, mouseGrip, aimingMechanic });
  };

  const handleGameChange = (newGame: Game) => {
    onSetupChange({ dpi, sensitivity, game: newGame, mouseGrip, aimingMechanic });
  };

  const handleGripChange = (grip: any) => {
    onSetupChange({ dpi, sensitivity, game, mouseGrip: grip, aimingMechanic });
  };

  const handleMechanicChange = (mechanic: any) => {
    onSetupChange({ dpi, sensitivity, game, mouseGrip, aimingMechanic: mechanic });
  };

  const isValid = dpi >= SENSITIVITY_LIMITS.minDPI && sensitivity > 0;

  const getTrendIcon = () => {
    if (proComparison.percentile < 35) return <TrendingDown className="w-4 h-4 text-[#ff3366]" />;
    if (proComparison.percentile > 65) return <TrendingUp className="w-4 h-4 text-[#6366f1]" />;
    return <Minus className="w-4 h-4 text-[#00ff88]" />;
  };

  const getCm360Color = () => {
    if (cm360Feedback.status === 'fast') return 'text-[#6366f1]';
    if (cm360Feedback.status === 'slow') return 'text-[#f59e0b]';
    if (cm360Feedback.status === 'ideal') return 'text-[#00ff88]';
    return cm360 > 0 ? 'text-white' : 'text-[#64748b]';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Setup Your Gear</h2>
        <p className="text-[#94a3b8]">Tell us about your setup</p>
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
                placeholder="e.g. 400, 800, 1600"
                value={dpi || ''}
                onChange={handleDpiChange}
                min={0}
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
                placeholder="e.g. 0.5, 1.0, 2.0"
                value={sensitivity || ''}
                onChange={handleSensChange}
                min={0}
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
            <span className="text-sm text-[#94a3b8]">Game</span>
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
        <Card variant="bordered">
          <div className="flex items-center gap-3 mb-4">
            <Hand className="w-5 h-5 text-[#00ff88]" />
            <span className="text-sm text-[#94a3b8]">Mouse Grip</span>
          </div>
          <SelectionGrid
            options={MOUSE_GRIPS.map(g => ({ value: g.id, label: g.name, icon: g.icon, description: g.description }))}
            value={mouseGrip}
            onChange={handleGripChange}
            columns={3}
          />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card variant="bordered">
          <div className="flex items-center gap-3 mb-4">
            <Hand className="w-5 h-5 text-[#00ff88]" />
            <span className="text-sm text-[#94a3b8]">Aiming Style</span>
          </div>
          <SelectionGrid
            options={AIMING_MECHANICS.map(m => ({ value: m.id, label: m.name, description: m.description }))}
            value={aimingMechanic}
            onChange={handleMechanicChange}
            columns={3}
          />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="glow" className="text-center">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-[#64748b] mb-1">eDPI</p>
              <p className="text-2xl font-mono font-bold text-[#00ff88]">{edpi || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748b] mb-1">cm/360</p>
              <p className={`text-2xl font-mono font-bold ${getCm360Color()}`}>{cm360 || '—'}</p>
            </div>
          </div>
          {edpi > 0 && (
            <div className="pt-3 border-t border-[#2a2a3a]">
              <div className="flex items-center justify-center gap-2 mb-1">
                {getTrendIcon()}
                <span className="text-sm text-[#94a3b8]">
                  {proComparison.range} compared to {gameConfig.name} pros
                </span>
              </div>
              <p className="text-xs text-[#64748b]">{cm360Feedback.message}</p>
            </div>
          )}
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
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