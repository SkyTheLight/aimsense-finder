'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle, Copy, Share2, Sparkles, Volume2, VolumeX, X, ChevronLeft, MapPin, Circle } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { FinalResults } from '@/types';

interface WarningStepProps {
  results: FinalResults;
  onConfirm: () => void;
  onBack: () => void;
  onRestart: () => void;
}

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAYS_AGO_WARNING = "Change your sens within 7 days and you'll feel worse, not better.";

export function WarningStep({ results, onConfirm, onBack, onRestart }: WarningStepProps) {
  const [agreed, setAgreed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reminderCopied, setReminderCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => { if (soundEnabled) { const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleTYtR6nl1bBtMyVEsm7j08NuGVzAwi5rv8fCNiEkfYJ6a//XzHYQZJaQr/3+/IQdIpM0iPbs//8DIAkYJjYyODmKkpqdopaFdWNwlamPlmpwUzI2aJ3X0dOJZDc2aJHU0NqNVTQtdo/b//39NgwgLkowODmKkp6glYyFdml0lK2SlJVdNjUxaJnS0tiFVTEuTmHKjY6BgYCAgYJ9gH+AgYB+gH6AgIB+f4CAgH9/f4CAgH5+f4CA'); audio.play().catch(() => {}); } }, [soundEnabled]);

  const copyReminder = () => { navigator.clipboard.writeText(`🎯 TrueSens Reminder\nMy recommended sensitivity: ${results.sensitivity}\neDPI: ${results.edpi} | cm/360: ${results.cm360}\n\n⚠️ DON'T CHANGE FOR 7 DAYS!\nIt takes muscle memory time to adapt.\n\n#TrueSens`); setReminderCopied(true); setTimeout(() => setReminderCopied(false), 2000); };
  const saveSettings = async () => { try { await fetch('/api/user/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ game: results.label || 'valorant', dpi: 800, sensitivity: results.sensitivity, edpi: results.edpi, cm360: results.cm360, mouseGrip: 'palm', aimStyle: 'hybrid', isCurrent: true }) }); } catch (err) { console.error('Failed to save settings:', err); } };
  const handleConfirm = async () => { if (!agreed) return; setSaving(true); try { if (status === 'authenticated' && session?.user?.id) { await saveSettings(); onConfirm(); } else { await signIn(undefined, { callbackUrl: '/?save=true' }); } } catch (err) { console.error('Failed to proceed:', err); } finally { setSaving(false); } };

  return (
    <div className="w-full space-y-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--app-text-primary)]">Important Warning</h2>
        <p className="text-[var(--app-text-secondary)]">Read before you leave</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="space-y-6 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-8">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">7 DAYS MUSCLE MEMORY PERIOD</span>
          </div>
          <h3 className="text-2xl font-bold text-[var(--app-text-primary)]">DO NOT CHANGE YOUR SENSITIVITY FOR AT LEAST 7 DAYS</h3>
          <p className="text-lg text-[var(--app-text-secondary)]">{DAYS_AGO_WARNING}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0"><X className="w-4 h-4 text-red-400" /></div>
            <div className="space-y-4">
              <p className="text-[var(--app-text-primary)] font-medium">If you change it now:</p>
              <p className="text-sm text-[var(--app-text-secondary)]">Your muscle memory will get confused. You'll play worse. You'll think the sensitivity is wrong. You'll keep changing it and never adapt.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-xl border border-green-500/20 bg-green-500/10 p-6">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0"><CheckCircle className="w-4 h-4 text-green-400" /></div>
            <div className="space-y-4">
              <p className="text-[var(--app-text-primary)] font-medium">The right way:</p>
              <p className="text-sm text-[var(--app-text-secondary)]">Stick with it for 7 days. Play every day. Let your muscles learn. Then evaluate if it feels right.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-[var(--app-text-secondary)]">Your calendar for the next week:</p>
          <div className="grid grid-cols-7 gap-4">
            {DAYS.slice(0, 7).map((day, index) => (
              <div key={day} className={`rounded-lg border p-4 text-center ${index === 0 ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-muted)]'}`}>
                <p className="text-xs font-medium">{day.slice(0, 3)}</p>
                <p className="mt-1 text-sm font-bold">{index === 0 ? <MapPin className="w-4 h-4 inline" /> : <Circle className="w-4 h-4 inline" />}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[var(--app-text-muted)]">Start today (marked in green)</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
        <div className="flex items-center justify-between">
          <p className="text-[var(--app-text-primary)] font-semibold">Your Recommended Settings</p>
          <Sparkles className="w-5 h-5 text-[var(--app-accent)]" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-[var(--app-surface)] p-4 text-center border border-[var(--app-border)]">
            <p className="mb-1 text-xs text-[var(--app-text-muted)]">Sensitivity</p>
            <p className="text-xl font-mono font-bold text-[var(--app-text-primary)]">{results.sensitivity}</p>
          </div>
          <div className="rounded-lg bg-[var(--app-surface)] p-4 text-center border border-[var(--app-border)]">
            <p className="mb-1 text-xs text-[var(--app-text-muted)]">eDPI</p>
            <p className="text-xl font-mono font-bold text-[var(--app-text-primary)]">{results.edpi}</p>
          </div>
          <div className="rounded-lg bg-[var(--app-surface)] p-4 text-center border border-[var(--app-border)]">
            <p className="mb-1 text-xs text-[var(--app-text-muted)]">cm/360</p>
            <p className="text-xl font-mono font-bold text-[var(--app-text-primary)]">{results.cm360}</p>
          </div>
        </div>
        <p className="text-center text-sm text-[var(--app-text-muted)]">Style: <span className="text-[var(--app-accent)]">{results.label}</span> | {results.profile}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setAgreed(!agreed)} className={`flex w-full items-center gap-4 rounded-xl border-2 p-6 transition-all ${agreed ? 'bg-green-500/10 border-green-500/30 text-[var(--app-text-primary)]' : 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text-secondary)]'}`}>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${agreed ? 'bg-green-500 border-green-500' : 'border-[var(--app-border)]'}`}>
            {agreed && <CheckCircle className="w-4 h-4 text-white" />}
          </div>
          <p className="text-sm">I understand. I will NOT change my sensitivity for at least 7 days.</p>
        </motion.button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-4">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={copyReminder} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--app-surface)] px-4 py-3 font-medium text-[var(--app-text-primary)] transition-all hover:bg-[var(--app-surface)] border border-[var(--app-border)]">
          {reminderCopied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
          {reminderCopied ? 'Copied!' : 'Copy Reminder'}
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSoundEnabled(!soundEnabled)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--app-surface)] px-4 py-3 font-medium text-[var(--app-text-primary)] transition-all hover:bg-[var(--app-surface)] border border-[var(--app-border)]">
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          {soundEnabled ? 'Sound On' : 'Sound Off'}
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🎯 TrueSens: ${results.sensitivity} sens (${results.label})\neDPI: ${results.edpi} | cm/360: ${results.cm360}\n\n⚠️ NOT changing for 7 days! #TrueSens`)}`, '_blank')} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--app-surface)] px-4 py-3 font-medium text-[var(--app-text-primary)] transition-all hover:bg-[var(--app-surface)] border border-[var(--app-border)]">
          <Share2 className="w-5 h-5" />Share
        </motion.button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-6 flex gap-4">
        <button onClick={onBack} className="flex items-center gap-2 rounded-xl bg-[var(--app-surface)] px-4 py-3 font-medium text-[var(--app-text-primary)] transition-all hover:bg-[var(--app-surface)] border border-[var(--app-border)]">
          <ChevronLeft className="w-5 h-5" />Back
        </button>
        <button onClick={handleConfirm} disabled={!agreed || saving} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-5 py-3 font-medium text-white shadow-lg shadow-green-500/25 transition-all hover:shadow-green-500/40 disabled:cursor-not-allowed disabled:opacity-50">
          <Sparkles className="w-5 h-5" />
          {status === 'authenticated' ? (saving ? 'Saving...' : 'I Accept & Continue') : 'Login & Save'}
        </button>
      </motion.div>

      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} onClick={onRestart} className="w-full text-center text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] transition-colors py-2">Start Over</motion.button>
    </div>
  );
}