'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Mouse, Grip, MousePointer, LayoutGrid, Gauge, Armchair, PersonStanding, Activity, Timer, Target, Battery, Zap, CircleDot } from 'lucide-react';
import { UserSetup, MOUSE_WEIGHTS, MOUSE_SIZE_FEELS, AIM_ISSUES, MOUSEPAD_SIZES, MOUSEPAD_SURFACES, ARM_POSITIONS, ARM_ANCHORINGS, SITTING_POSTURES, WARMUP_METHODS, PLAYER_ROLES, MAIN_WEAPONS } from '@/types';

interface EquipmentStepProps {
  setup: Partial<UserSetup> | null;
  onSetupChange: (setup: Partial<UserSetup>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function EquipmentStep({ setup, onSetupChange, onNext, onBack }: EquipmentStepProps) {
  const handleChange = (field: string, value: unknown) => {
    (onSetupChange as (setup: Partial<UserSetup>) => void)({ ...setup, [field]: value });
  };

  const toggleAimIssue = (issue: string) => {
    const current = (setup?.aimIssues as string[]) || [];
    const next = current.includes(issue) ? current.filter((i) => i !== issue) : [...current, issue];
    handleChange('aimIssues' as keyof UserSetup, next as UserSetup['aimIssues']);
  };

  const mouseWeight = setup?.mouseWeight as string | null;
  const mouseSizeFeel = setup?.mouseSizeFeel as string | null;
  const aimIssues = (setup?.aimIssues as string[]) || [];
  const mousepadSize = setup?.mousepadSize as string | null;
  const mousepadSurface = setup?.mousepadSurface as string | null;
  const runningOutOfSpace = setup?.runningOutOfSpace as boolean | null;
  const armPosition = setup?.armPosition as string | null;
  const armAnchoring = setup?.armAnchoring as string | null;
  const sittingPosture = setup?.sittingPosture as string | null;
  const warmup = setup?.warmup as boolean | null;
  const warmupDuration = setup?.warmupDuration as number | null;
  const warmupMethod = setup?.warmupMethod as string | null;
  const consistencyFeeling = setup?.consistencyFeeling as string | null;
  const mainWeapon = setup?.mainWeapon as string | null;
  const playerRole = setup?.playerRole as string | null;
  const biggestAimingIssue = setup?.biggestAimingIssue as string | null;

  return (
    <div className="w-full space-y-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <h2 className="text-2xl font-bold text-[var(--app-text-primary)]">Equipment & Posture</h2>
        <p className="text-[var(--app-text-secondary)]">Tell us about your setup and habits</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3"><Battery className="w-5 h-5 text-[var(--app-accent)]" /><span className="text-sm font-medium text-[var(--app-text-primary)]">Mouse Weight</span></div>
          <div className="grid grid-cols-5 gap-3">
            {MOUSE_WEIGHTS.map((w) => (
              <button key={w.id} onClick={() => handleChange('mouseWeight', w.id as UserSetup['mouseWeight'])} className={`rounded-lg px-2 py-3 text-xs transition-all ${mouseWeight === w.id ? 'bg-[var(--app-accent)]/15 border-2 border-[var(--app-accent)] text-[var(--app-accent)]' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'}`}>{w.name}</button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3"><LayoutGrid className="w-5 h-5 text-[var(--app-accent)]" /><span className="text-sm font-medium text-[var(--app-text-primary)]">Mouse Size</span></div>
          <div className="grid grid-cols-3 gap-3">
            {MOUSE_SIZE_FEELS.map((s) => (
              <button key={s.id} onClick={() => handleChange('mouseSizeFeel', s.id)} className={`rounded-lg px-3 py-3 text-sm transition-all ${mouseSizeFeel === s.id ? 'bg-[var(--app-accent)]/15 border-2 border-[var(--app-accent)] text-[var(--app-accent)]' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'}`}>{s.name}</button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3"><Target className="w-5 h-5 text-[var(--app-accent)]" /><span className="text-sm font-medium text-[var(--app-text-primary)]">Aim Issues (select all)</span></div>
          <div className="grid grid-cols-2 gap-3">
            {AIM_ISSUES.map((issue) => (
              <button key={issue.id} onClick={() => toggleAimIssue(issue.id)} className={`rounded-lg px-3 py-3 text-sm text-left transition-all ${aimIssues.includes(issue.id) ? 'bg-[var(--app-accent)]/15 border-2 border-[var(--app-accent)] text-[var(--app-accent)]' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'}`}><div className="font-medium">{issue.name}</div><div className="text-xs opacity-70">{issue.description}</div></button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3"><LayoutGrid className="w-5 h-5 text-[var(--app-accent)]" /><span className="text-sm font-medium text-[var(--app-text-primary)]">Mousepad Size</span></div>
          <div className="grid grid-cols-4 gap-3">
            {MOUSEPAD_SIZES.map((s) => (
              <button key={s.id} onClick={() => handleChange('mousepadSize', s.id)} className={`rounded-lg px-2 py-3 text-xs transition-all ${mousepadSize === s.id ? 'bg-[var(--app-accent)]/15 border-2 border-[var(--app-accent)] text-[var(--app-accent)]' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'}`}>{s.name}</button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3"><Gauge className="w-5 h-5 text-[var(--app-accent)]" /><span className="text-sm font-medium text-[var(--app-text-primary)]">Mousepad Surface</span></div>
          <div className="grid grid-cols-3 gap-3">
            {MOUSEPAD_SURFACES.map((s) => (
              <button key={s.id} onClick={() => handleChange('mousepadSurface', s.id)} className={`rounded-lg px-3 py-3 text-sm transition-all ${mousepadSurface === s.id ? 'bg-[var(--app-accent)]/15 border-2 border-[var(--app-accent)] text-[var(--app-accent)]' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'}`}>{s.name}</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--app-text-muted)]">Running out of space?</span>
            <button onClick={() => handleChange('runningOutOfSpace', true)} className={`rounded-lg px-4 py-2 text-sm transition-all ${runningOutOfSpace === true ? 'bg-[var(--app-accent)] text-white' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)]'}`}>Yes</button>
            <button onClick={() => handleChange('runningOutOfSpace', false)} className={`rounded-lg px-4 py-2 text-sm transition-all ${runningOutOfSpace === false ? 'bg-[var(--app-accent)] text-white' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)]'}`}>No</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3"><Armchair className="w-5 h-5 text-[var(--app-accent)]" /><span className="text-sm font-medium text-[var(--app-text-primary)]">Arm Position</span></div>
          <div className="grid grid-cols-3 gap-3">
            {ARM_POSITIONS.map((p) => (
              <button key={p.id} onClick={() => handleChange('armPosition', p.id)} className={`rounded-lg px-3 py-3 text-sm transition-all ${armPosition === p.id ? 'bg-[var(--app-accent)]/15 border-2 border-[var(--app-accent)] text-[var(--app-accent)]' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'}`}>{p.name}</button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3"><Armchair className="w-5 h-5 text-[var(--app-accent)]" /><span className="text-sm font-medium text-[var(--app-text-primary)]">Arm Anchoring</span></div>
          <div className="grid grid-cols-2 gap-3">
            {ARM_ANCHORINGS.map((a) => (
              <button key={a.id} onClick={() => handleChange('armAnchoring', a.id)} className={`rounded-lg px-3 py-3 text-sm transition-all ${armAnchoring === a.id ? 'bg-[var(--app-accent)]/15 border-2 border-[var(--app-accent)] text-[var(--app-accent)]' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'}`}>{a.name}</button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3"><PersonStanding className="w-5 h-5 text-[var(--app-accent)]" /><span className="text-sm font-medium text-[var(--app-text-primary)]">Sitting Posture</span></div>
          <div className="grid grid-cols-3 gap-3">
            {SITTING_POSTURES.map((p) => (
              <button key={p.id} onClick={() => handleChange('sittingPosture', p.id)} className={`rounded-lg px-3 py-3 text-sm transition-all ${sittingPosture === p.id ? 'bg-[var(--app-accent)]/15 border-2 border-[var(--app-accent)] text-[var(--app-accent)]' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'}`}>{p.name}</button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3"><Activity className="w-5 h-5 text-[var(--app-accent)]" /><span className="text-sm font-medium text-[var(--app-text-primary)]">Warm-up Routine</span></div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--app-text-muted)]">Warm up before playing?</span>
            <button onClick={() => handleChange('warmup', true)} className={`rounded-lg px-4 py-2 text-sm transition-all ${warmup === true ? 'bg-[var(--app-accent)] text-white' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)]'}`}>Yes</button>
            <button onClick={() => handleChange('warmup', false)} className={`rounded-lg px-4 py-2 text-sm transition-all ${warmup === false ? 'bg-[var(--app-accent)] text-white' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)]'}`}>No</button>
          </div>
          {warmup && (
            <>
              <div className="flex items-center gap-3">
                <Timer className="w-4 h-4 text-[var(--app-text-muted)]" />
                <span className="text-sm text-[var(--app-text-muted)]">Duration (min)</span>
                <input type="number" min="1" max="60" value={warmupDuration || ''} onChange={(e) => handleChange('warmupDuration', parseInt(e.target.value) || 0)} className="w-20 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm text-[var(--app-text-primary)]" />
              </div>
              <div className="flex flex-wrap gap-3">
                {WARMUP_METHODS.map((m) => (
                  <button key={m.id} onClick={() => handleChange('warmupMethod', m.id)} className={`rounded-lg px-3 py-2 text-sm transition-all ${warmupMethod === m.id ? 'bg-[var(--app-accent)]/15 border border-[var(--app-accent)] text-[var(--app-accent)]' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)]'}`}>{m.name}</button>
                ))}
              </div>
            </>
          )}
          <div className="flex items-center gap-3">
            <CircleDot className="w-4 h-4 text-[var(--app-text-muted)]" />
            <span className="text-sm text-[var(--app-text-muted)]">Aim consistency?</span>
            <button onClick={() => handleChange('consistencyFeeling', 'consistent')} className={`rounded-lg px-4 py-2 text-sm transition-all ${consistencyFeeling === 'consistent' ? 'bg-[var(--app-accent)] text-white' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)]'}`}>Consistent</button>
            <button onClick={() => handleChange('consistencyFeeling', 'inconsistent')} className={`rounded-lg px-4 py-2 text-sm transition-all ${consistencyFeeling === 'inconsistent' ? 'bg-[var(--app-accent)] text-white' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)]'}`}>Inconsistent</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3"><Target className="w-5 h-5 text-[var(--app-accent)]" /><span className="text-sm font-medium text-[var(--app-text-primary)]">Playstyle</span></div>
          <div className="grid grid-cols-2 gap-3">
            {MAIN_WEAPONS.map((w) => (
              <button key={w.id} onClick={() => handleChange('mainWeapon', w.id)} className={`rounded-lg px-3 py-3 text-sm transition-all ${mainWeapon === w.id ? 'bg-[var(--app-accent)]/15 border-2 border-[var(--app-accent)] text-[var(--app-accent)]' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'}`}>{w.name}</button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {PLAYER_ROLES.map((r) => (
              <button key={r.id} onClick={() => handleChange('playerRole', r.id)} className={`rounded-lg px-3 py-3 text-sm transition-all ${playerRole === r.id ? 'bg-[var(--app-accent)]/15 border-2 border-[var(--app-accent)] text-[var(--app-accent)]' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'}`}>{r.name}</button>
            ))}
          </div>
        </div>

        {aimIssues.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3"><MousePointer className="w-5 h-5 text-rose-400" /><span className="text-sm font-medium text-[var(--app-text-primary)]">Biggest Aiming Issue</span></div>
            <div className="grid grid-cols-2 gap-3">
              {AIM_ISSUES.filter((i) => aimIssues.includes(i.id)).map((issue) => (
                <button key={issue.id} onClick={() => handleChange('biggestAimingIssue', issue.id)} className={`rounded-lg px-3 py-3 text-sm transition-all ${biggestAimingIssue === issue.id ? 'bg-rose-500/15 border-2 border-rose-400 text-rose-400' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'}`}>{issue.name}</button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-8 flex flex-row gap-4">
        <button onClick={onBack} className="flex items-center justify-center gap-2 rounded-xl bg-[var(--app-surface)] px-4 py-3 font-medium text-[var(--app-text-primary)] transition-all hover:bg-[var(--app-surface)] border border-[var(--app-border)]"><ChevronLeft className="w-5 h-5" />Back</button>
        <button onClick={onNext} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--app-accent)] to-[var(--app-accent-2)] px-5 py-3 font-medium text-white shadow-lg transition-all hover:shadow-[var(--app-accent)]/40">Continue<ChevronRight className="w-5 h-5" /></button>
      </motion.div>
    </div>
  );
}