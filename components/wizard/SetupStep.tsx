'use client';

import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserSetup, Game, MOUSE_GRIPS, AIMING_MECHANICS } from '@/types';
import { calculateEDPI, calculateCm360, getGameConfig, getCm360Feedback, getProComparison } from '@/lib/calculations';
import { SENSITIVITY_LIMITS } from '@/lib/constants';
import { Mouse, Crosshair, Activity, Hand, TrendingUp, TrendingDown, Minus, ChevronRight, ChevronLeft } from 'lucide-react';
import { AdaptivePanel } from './AdaptivePanel';

interface SetupStepProps { setup: UserSetup | null; onSetupChange: (setup: UserSetup) => void; onNext: () => void; onBack: () => void; }
const games: { value: Game; label: string; color: string }[] = [{ value: 'valorant', label: 'VALORANT', color: '#FF4655' }, { value: 'cs2', label: 'CS2', color: '#DE9B35' }];

export function SetupStep({ setup, onSetupChange, onNext, onBack }: SetupStepProps) {
  const dpi = setup?.dpi || 0, sensitivity = setup?.sensitivity || 0, game = setup?.game || 'valorant', mouseGrip = setup?.mouseGrip || null, aimingMechanic = setup?.aimingMechanic || null;
  const gameConfig = useMemo(() => getGameConfig(game), [game]);
  const [aiCopy, setAiCopy] = useState<{ title: string; subtitle: string; cta?: string; helperText?: string } | null>(null);
  const [aiSense, setAiSense] = useState<{ optimalSensitivity: number; edpi?: number; cm360?: number; rationale?: string[]; confidence?: number; notes?: string; alternativeRange?: { min: number; max: number }; recommendations?: { warmup: string; dailyDrill: string; weeklyFocus: string } } | null>(null);
  const edpi = useMemo(() => dpi > 0 && sensitivity > 0 ? calculateEDPI(dpi, sensitivity) : 0, [dpi, sensitivity]);
  const cm360 = useMemo(() => dpi > 0 && sensitivity > 0 ? calculateCm360(dpi, sensitivity, game) : 0, [dpi, sensitivity, game]);
  const cm360Feedback = useMemo(() => cm360 > 0 ? getCm360Feedback(cm360, game) : { status: '', message: 'Enter values above' }, [cm360, game]);
  const proComparison = useMemo(() => edpi > 0 ? getProComparison(edpi, game) : { percentile: 50, range: 'Average', recommendation: '' }, [edpi, game]);
  const shouldInjectModules = (mouseGrip === 'claw') || (aiSense?.optimalSensitivity != null && aiSense.optimalSensitivity > 1.2);
  const isValid = dpi >= SENSITIVITY_LIMITS.minDPI && sensitivity > 0;

  useEffect(() => { let mounted = true; const fetchCopy = async () => { try { const res = await fetch('/api/ui-copy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ game, section: 'setup', step: 2, hasData: dpi > 0 && sensitivity > 0 }) }); if (res.ok && mounted) { const data = await res.json(); setAiCopy({ title: data.title || 'Setup Your Gear', subtitle: data.subtitle || 'Tell us about your mouse and game', cta: data.cta, helperText: data.helperText }); } } catch { } }; fetchCopy(); return () => { mounted = false; }; }, [game, dpi, sensitivity]);
  useEffect(() => { let mounted = true; const fetchSense = async () => { if (dpi > 0 && sensitivity > 0) { try { const res = await fetch('/api/ai-sense', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dpi, inGameSens: sensitivity, grip: mouseGrip || 'palm', mousePad: 'cloth', mouseWeight: 'medium', monitorSize: '24"', playstyle: aimingMechanic || 'hybrid', role: 'flex', targetPreference: 'mixed', reactionStyle: 'average', game }) }); if (res.ok && mounted) { const data = await res.json(); if (data.optimalSensitivity) setAiSense(data); } } catch { } } }; fetchSense(); return () => { mounted = false; }; }, [dpi, sensitivity, mouseGrip, aimingMechanic, game]);

  const handleDpiChange = (e: React.ChangeEvent<HTMLInputElement>) => { const val = e.target.value; const value = val === '' ? 0 : Math.max(0, Math.min(SENSITIVITY_LIMITS.maxDPI, Number(val))); onSetupChange({ dpi: value, sensitivity, game, mouseGrip, aimingMechanic, mouseWeight: null, mouseSizeFeel: null, aimIssues: [], mousepadSize: null, mousepadSurface: null, runningOutOfSpace: null, armPosition: null, armAnchoring: null, sittingPosture: null, warmup: null, warmupDuration: null, warmupMethod: null, consistencyFeeling: null, mainWeapon: null, playerRole: null, biggestAimingIssue: null }); };
  const handleSensChange = (e: React.ChangeEvent<HTMLInputElement>) => { const val = e.target.value; const value = val === '' ? 0 : Math.max(0, Math.min(SENSITIVITY_LIMITS.max, Number(val))); onSetupChange({ dpi, sensitivity: value, game, mouseGrip, aimingMechanic, mouseWeight: null, mouseSizeFeel: null, aimIssues: [], mousepadSize: null, mousepadSurface: null, runningOutOfSpace: null, armPosition: null, armAnchoring: null, sittingPosture: null, warmup: null, warmupDuration: null, warmupMethod: null, consistencyFeeling: null, mainWeapon: null, playerRole: null, biggestAimingIssue: null }); };
  const handleGameChange = (newGame: Game) => onSetupChange({ dpi, sensitivity, game: newGame, mouseGrip, aimingMechanic, mouseWeight: null, mouseSizeFeel: null, aimIssues: [], mousepadSize: null, mousepadSurface: null, runningOutOfSpace: null, armPosition: null, armAnchoring: null, sittingPosture: null, warmup: null, warmupDuration: null, warmupMethod: null, consistencyFeeling: null, mainWeapon: null, playerRole: null, biggestAimingIssue: null });
  const handleGripChange = (grip: any) => onSetupChange({ dpi, sensitivity, game, mouseGrip: grip, aimingMechanic, mouseWeight: null, mouseSizeFeel: null, aimIssues: [], mousepadSize: null, mousepadSurface: null, runningOutOfSpace: null, armPosition: null, armAnchoring: null, sittingPosture: null, warmup: null, warmupDuration: null, warmupMethod: null, consistencyFeeling: null, mainWeapon: null, playerRole: null, biggestAimingIssue: null });
  const handleMechanicChange = (mechanic: any) => onSetupChange({ dpi, sensitivity, game, mouseGrip, aimingMechanic: mechanic, mouseWeight: null, mouseSizeFeel: null, aimIssues: [], mousepadSize: null, mousepadSurface: null, runningOutOfSpace: null, armPosition: null, armAnchoring: null, sittingPosture: null, warmup: null, warmupDuration: null, warmupMethod: null, consistencyFeeling: null, mainWeapon: null, playerRole: null, biggestAimingIssue: null });
  const getTrendIcon = () => { if (proComparison.percentile < 35) return <TrendingDown className="w-4 h-4 text-red-400" />; if (proComparison.percentile > 65) return <TrendingUp className="w-4 h-4 text-purple-400" />; return <Minus className="w-4 h-4 text-green-400" />; };
  const getCm360Color = () => { if (cm360Feedback.status === 'fast') return 'text-purple-400'; if (cm360Feedback.status === 'slow') return 'text-amber-400'; if (cm360Feedback.status === 'ideal') return 'text-green-400'; return cm360 > 0 ? 'text-[var(--app-text-primary)]' : 'text-[var(--app-text-muted)]'; };

  return (
    <div className="w-full space-y-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <h2 className="text-2xl font-bold text-[var(--app-text-primary)]">{aiCopy?.title || 'Setup Your Gear'}</h2>
        <p className="text-[var(--app-text-secondary)]">{aiCopy?.subtitle || 'Tell us about your mouse and game'}</p>
        {aiSense && <div className="inline-flex items-center justify-center gap-2 rounded bg-[var(--app-surface)] p-2 text-xs text-[var(--app-text-secondary)]"><span>AI Suggestion:</span><span className="text-[var(--app-text-primary)] font-semibold">{aiSense.optimalSensitivity?.toFixed ? aiSense.optimalSensitivity.toFixed(2) : aiSense.optimalSensitivity}</span></div>}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--app-accent)] to-[var(--app-accent-2)] rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
          <div className="space-y-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 transition-all hover:border-[var(--app-accent)]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--app-accent)]/20 to-[var(--app-accent-2)]/20 flex items-center justify-center"><Mouse className="w-5 h-5 text-[var(--app-accent)]" /></div><p className="text-sm font-medium text-[var(--app-text-secondary)]">Mouse DPI</p></div>
              <div className="w-2 h-2 rounded-full bg-[var(--app-accent)] animate-pulse" />
            </div>
            <div className="relative">
              <input type="number" placeholder="800" value={dpi || ''} onChange={handleDpiChange} min={0} max={SENSITIVITY_LIMITS.maxDPI} className="w-full bg-transparent text-3xl font-mono font-bold text-[var(--app-text-primary)] placeholder-[var(--app-text-muted)] text-center py-2 outline-none" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-[var(--app-accent)] to-transparent opacity-50" />
            </div>
            <p className="text-center text-xs text-[var(--app-text-muted)]">Common: 400 • 800 • 1600 • 3200</p>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
          <div className="space-y-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 transition-all hover:border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center"><Crosshair className="w-5 h-5 text-purple-400" /></div><p className="text-sm font-medium text-[var(--app-text-secondary)]">In-Game Sens</p></div>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            </div>
            <div className="relative">
              <input type="number" step="0.01" placeholder="0.79" value={sensitivity || ''} onChange={handleSensChange} min={0} max={SENSITIVITY_LIMITS.max} className="w-full bg-transparent text-3xl font-mono font-bold text-[var(--app-text-primary)] placeholder-[var(--app-text-muted)] text-center py-2 outline-none" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50" />
            </div>
            <p className="text-center text-xs text-[var(--app-text-muted)]">Valorant: 0.5 • CS2: 0.8 • Apex: 1.0</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="mb-4 flex items-center gap-3"><Activity className="w-5 h-5 text-[var(--app-accent)]" /><span className="text-sm font-medium text-[var(--app-text-primary)]">Select Your Game</span></div>
        <div className="grid grid-cols-2 gap-4">
          {games.map((g) => (
            <motion.button key={g.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleGameChange(g.value)} className={`relative flex items-center justify-center gap-3 rounded-xl px-4 py-4 text-base font-bold transition-all ${game === g.value ? `border-2 text-[var(--app-text-primary)] shadow-[0_0_20px_rgba(${g.color === '#FF4655' ? '255,70,85' : '222,155,53'},0.4)]` : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'}`} style={{ background: game === g.value ? `${g.color}15` : undefined, borderColor: game === g.value ? g.color : undefined }}>
              {g.value === 'valorant' ? <img src="/valorant.png" alt="Valorant" className="w-8 h-8 object-contain" /> : <img src="/cs2-logo.svg" alt="CS2" className="w-8 h-8" />}{g.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="mb-4 flex items-center gap-3"><Hand className="w-5 h-5 text-[var(--app-accent)]" /><span className="text-sm font-medium text-[var(--app-text-primary)]">Mouse Grip</span></div>
        <div className="grid grid-cols-3 gap-4">
          {MOUSE_GRIPS.map((g) => (<motion.button key={g.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleGripChange(g.id)} className={`rounded-lg px-3 py-3 text-sm transition-all ${mouseGrip === g.id ? 'bg-[var(--app-accent)]/15 border-2 border-[var(--app-accent)] text-[var(--app-accent)]' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'}`}>{g.name}</motion.button>))}
        </div>
      </motion.div>

      {shouldInjectModules && <AdaptivePanel />}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="mb-4 flex items-center gap-3"><Crosshair className="w-5 h-5 text-[var(--app-accent)]" /><span className="text-sm font-medium text-[var(--app-text-primary)]">Aiming Style</span></div>
        <div className="grid grid-cols-3 gap-4">
          {AIMING_MECHANICS.map((m) => (<motion.button key={m.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleMechanicChange(m.id)} className={`rounded-lg px-3 py-3 text-sm transition-all ${aimingMechanic === m.id ? 'bg-[var(--app-accent)]/15 border-2 border-[var(--app-accent)] text-[var(--app-accent)]' : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)]'}`}>{m.name}</motion.button>))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4 rounded-xl border border-[var(--app-accent)]/20 bg-gradient-to-br from-[var(--app-accent)]/10 to-purple-500/10 p-6 text-center">
        <div className="grid grid-cols-2 gap-4">
          <div><p className="mb-1 text-xs text-[var(--app-text-muted)]">eDPI</p><p className="text-3xl font-mono font-bold text-[var(--app-text-primary)]">{edpi || '—'}</p></div>
          <div><p className="mb-1 text-xs text-[var(--app-text-muted)]">cm/360</p><p className={`text-3xl font-mono font-bold ${getCm360Color()}`}>{cm360 || '—'}</p></div>
        </div>
        {edpi > 0 && <div className="space-y-4 border-t border-[var(--app-border)] pt-4"><div className="flex items-center justify-center gap-2">{getTrendIcon()}<span className="text-sm text-[var(--app-text-secondary)]">{proComparison.range} vs {gameConfig.name} pros</span></div><p className="text-xs text-[var(--app-text-muted)]">{cm360Feedback.message}</p></div>}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-6 flex flex-row gap-4">
        <button onClick={onBack} className="flex items-center justify-center gap-2 rounded-xl bg-[var(--app-surface)] px-4 py-3 font-medium text-[var(--app-text-primary)] transition-all hover:bg-[var(--app-surface)] border border-[var(--app-border)]"><ChevronLeft className="w-5 h-5" />Back</button>
        <button onClick={onNext} disabled={!isValid} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--app-accent)] to-[var(--app-accent-2)] px-5 py-3 font-medium text-white shadow-lg transition-all hover:shadow-[var(--app-accent)]/40 disabled:cursor-not-allowed disabled:opacity-50">Continue<ChevronRight className="w-5 h-5" /></button>
      </motion.div>

      {!isValid && (<motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} onClick={onNext} className="w-full text-center text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] transition-colors py-2">Skip this step →</motion.button>)}
    </div>
  );
}