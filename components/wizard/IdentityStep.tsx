'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Game, UserSetup, PlayerRole, PlaystyleCategory, MainWeapon, AimIssue } from '@/types';
import { ArrowRight, ArrowLeft, Crosshair, Target, Zap, AlertTriangle } from 'lucide-react';

interface IdentityStepProps {
  setup: UserSetup | null;
  onSetupChange: (setup: Partial<UserSetup>) => void;
  onNext: () => void;
  onBack: () => void;
}

const GAMES = [
  { id: 'valorant' as Game, name: 'Valorant', icon: '🎯' },
  { id: 'cs2' as Game, name: 'CS2', icon: '🔫' },
];

const ROLES: { value: PlayerRole; label: string; icon: string }[] = [
  { value: 'entry', label: 'Entry', icon: '🚪' },
  { value: 'support', label: 'Support', icon: '🛡️' },
  { value: 'awper', label: 'AWPer', icon: '🔭' },
  { value: 'hybrid', label: 'Hybrid', icon: '⚖️' },
];

const WEAPONS: { value: MainWeapon; label: string }[] = [
  { value: 'rifle', label: 'Rifle' },
  { value: 'awp', label: 'AWP/Sniper' },
  { value: 'smg', label: 'SMG' },
  { value: 'shotgun', label: 'Shotgun' },
];

const PLAYSTYLES: { value: PlaystyleCategory; label: string; desc: string }[] = [
  { value: 'aggressive', label: 'Aggressive', desc: 'Peek first, take fights' },
  { value: 'passive', label: 'Passive', desc: 'Hold angles, play safety' },
  { value: 'hybrid', label: 'Hybrid', desc: 'Mix of both' },
];

const AIM_ISSUES: { value: AimIssue; label: string; desc: string }[] = [
  { value: 'overflicking', label: 'Overshooting', desc: 'Flicks go past target' },
  { value: 'underflicking', label: 'Underflicking', desc: 'Falls short of target' },
  { value: 'shaky_aim', label: 'Shaky Aim', desc: 'Unsteady during tracking' },
  { value: 'inconsistent', label: 'Inconsistent', desc: 'Performance varies a lot' },
];

export function IdentityStep({ setup, onSetupChange, onNext, onBack }: IdentityStepProps) {
  const canProceed = setup?.game && setup?.playerRole && setup?.mainWeapon && setup?.playstyleCategory && setup?.biggestAimingIssue;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[var(--app-text-primary)]">Player Identity</h2>
        <p className="text-[var(--app-text-secondary)]">Help us understand your playstyle first</p>
      </div>

      <Card variant="bordered" className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Crosshair className="w-5 h-5 text-green-500" />
          <h3 className="text-[var(--app-text-primary)] font-medium">Select Game</h3>
        </div>
        <div className="flex gap-3">
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => onSetupChange({ game: game.id })}
              className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                setup?.game === game.id
                  ? 'bg-green-500/10 border-green-500 text-green-500'
                  : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
              }`}
            >
              <span className="text-2xl mb-1 block">{game.icon}</span>
              <span className="font-medium">{game.name}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card variant="bordered" className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-green-500" />
          <h3 className="text-[var(--app-text-primary)] font-medium">Role</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((role) => (
            <button
              key={role.value}
              onClick={() => onSetupChange({ playerRole: role.value })}
              className={`py-3 px-4 rounded-xl border transition-all ${
                setup?.playerRole === role.value
                  ? 'bg-green-500/10 border-green-500 text-green-500'
                  : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
              }`}
            >
              <span className="text-xl mr-2">{role.icon}</span>
              {role.label}
            </button>
          ))}
        </div>
      </Card>

      <Card variant="bordered" className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-green-500" />
          <h3 className="text-[var(--app-text-primary)] font-medium">Playstyle</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {PLAYSTYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => onSetupChange({ playstyleCategory: style.value })}
              className={`py-3 px-2 rounded-xl border transition-all text-center ${
                setup?.playstyleCategory === style.value
                  ? 'bg-green-500/10 border-green-500 text-green-500'
                  : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
              }`}
            >
              <div className="font-medium">{style.label}</div>
              <div className="text-xs opacity-70">{style.desc}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card variant="bordered" className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-green-500" />
          <h3 className="text-[var(--app-text-primary)] font-medium">Biggest Aim Issue</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {AIM_ISSUES.map((issue) => (
            <button
              key={issue.value}
              onClick={() => onSetupChange({ biggestAimingIssue: issue.value })}
              className={`py-3 px-4 rounded-xl border transition-all text-left ${
                setup?.biggestAimingIssue === issue.value
                  ? 'bg-green-500/10 border-green-500 text-green-500'
                  : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-green-500/50'
              }`}
            >
              <div className="font-medium">{issue.label}</div>
              <div className="text-xs opacity-70">{issue.desc}</div>
            </button>
          ))}
        </div>
      </Card>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-5 h-5 mr-2" />Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="flex-1">
          Next<ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}