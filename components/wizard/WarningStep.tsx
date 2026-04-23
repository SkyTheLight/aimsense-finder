'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, Calendar, CheckCircle, Copy, Share2, RefreshCcw, Save, Sparkles, Volume2, VolumeX, X, ChevronRight, ChevronLeft } from 'lucide-react';
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
  const [showWarning, setShowWarning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reminderCopied, setReminderCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleTYtR6nl1bBtMyVEsm7j08NuGVzAwi5rv8fCNiEkfYJ6a//XzHYQZJaQr/3+/IQdIpM0iPbs//8DIAkYJjYyODmKkpqdopaFdWNwlamPlmpwUzI2aJ3X0dOJZDc2aJHU0NqNVTQtdo/b//39NgwgLkowODmKkp6glYyFdml0lK2SlJVdNjUxaJnS0tiFVTEuTmHKjY6BgYCAgYJ9gH+AgYB+gH6AgIB+f4CAgH9/f4CAgH5+f4CA');
      audio.play().catch(() => {});
    }
  }, [soundEnabled]);

  const copyReminder = () => {
    const text = `🎯 TrueSens Reminder
My recommended sensitivity: ${results.sensitivity}
eDPI: ${results.edpi} | cm/360: ${results.cm360}

⚠️ DON'T CHANGE FOR 7 DAYS!
It takes muscle memory time to adapt.

#TrueSens`;
    navigator.clipboard.writeText(text);
    setReminderCopied(true);
    setTimeout(() => setReminderCopied(false), 2000);
  };

  const saveSettings = async () => {
    try {
      await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: results.label || 'valorant',
          dpi: 800,
          sensitivity: results.sensitivity,
          edpi: results.edpi,
          cm360: results.cm360,
          mouseGrip: 'palm',
          aimStyle: 'hybrid',
          isCurrent: true,
        }),
      });
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const handleConfirm = async () => {
    if (!agreed) return;
    setSaving(true);
    
    try {
      if (status === 'authenticated' && session?.user?.id) {
        await saveSettings();
        onConfirm();
      } else {
        await signIn(undefined, { callbackUrl: '/?save=true' });
      }
    } catch (err) {
      console.error('Failed to proceed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-4 shadow-lg shadow-amber-500/20">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Important Warning</h2>
        <p className="text-[#b8c0cd]">Read before you leave</p>
      </motion.div>

      {/* Main Warning Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-2xl p-6"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full mb-4">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">7 DAYS MUSCLE MEMORY PERIOD</span>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">
            DO NOT CHANGE YOUR SENSITIVITY FOR AT LEAST 7 DAYS
          </h3>
          
          <p className="text-lg text-[#b8c0cd]">
            {DAYS_AGO_WARNING}
          </p>
        </div>

        {/* Why */}
        <div className="space-y-4 mt-6">
          <div className="flex items-start gap-3 p-4 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.08)]">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <X className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-white font-medium mb-1">If you change it now:</p>
              <p className="text-sm text-[#b8c0cd]">Your muscle memory will get confused. You'll play worse. You'll think the sensitivity is wrong. You'll keep changing it and never adapt.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium mb-1">The right way:</p>
              <p className="text-sm text-[#b8c0cd]">Stick with it for 7 days. Play every day. Let your muscles learn. Then evaluate if it feels right.</p>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="mt-6">
          <p className="text-sm text-[#b8c0cd] mb-3">Your calendar for the next week:</p>
          <div className="grid grid-cols-7 gap-2">
            {DAYS.slice(0, 7).map((day, index) => (
              <div 
                key={day} 
                className={`p-3 rounded-lg text-center border ${
                  index === 0 
                    ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                    : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)] text-[#525a6b]'
                }`}
              >
                <p className="text-xs font-medium">{day.slice(0, 3)}</p>
                <p className="text-sm font-bold mt-1">{index === 0 ? '📍' : '⭕'}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#525a6b] mt-2">Start today (marked in green)</p>
        </div>
      </motion.div>

      {/* Your Settings */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-white font-semibold">Your Recommended Settings</p>
          <Sparkles className="w-5 h-5 text-cyan-400" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-[rgba(255,255,255,0.04)] rounded-lg">
            <p className="text-xs text-[#525a6b] mb-1">Sensitivity</p>
            <p className="text-xl font-mono font-bold text-gradient">{results.sensitivity}</p>
          </div>
          <div className="text-center p-3 bg-[rgba(255,255,255,0.04)] rounded-lg">
            <p className="text-xs text-[#525a6b] mb-1">eDPI</p>
            <p className="text-xl font-mono font-bold text-white">{results.edpi}</p>
          </div>
          <div className="text-center p-3 bg-[rgba(255,255,255,0.04)] rounded-lg">
            <p className="text-xs text-[#525a6b] mb-1">cm/360</p>
            <p className="text-xl font-mono font-bold text-white">{results.cm360}</p>
          </div>
        </div>

        <p className="text-center text-sm text-[#525a6b] mt-3">
          Style: <span className="text-cyan-400">{results.label}</span> | {results.profile}
        </p>
      </motion.div>

      {/* Agreement */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setAgreed(!agreed)}
          className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
            agreed 
              ? 'bg-green-500/10 border-green-500/30 text-white' 
              : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)] text-[#b8c0cd]'
          }`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            agreed ? 'bg-green-500 border-green-500' : 'border-[rgba(255,255,255,0.3)]'
          }`}>
            {agreed && <CheckCircle className="w-4 h-4 text-white" />}
          </div>
          <p className="text-sm">
            I understand. I will NOT change my sensitivity for at least 7 days.
          </p>
        </motion.button>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={copyReminder}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.06)] text-white font-medium hover:bg-[rgba(255,255,255,0.1)] transition-all"
        >
          {reminderCopied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
          {reminderCopied ? 'Copied!' : 'Copy Reminder'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.06)] text-white font-medium hover:bg-[rgba(255,255,255,0.1)] transition-all"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          {soundEnabled ? 'Sound On' : 'Sound Off'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const shareText = `🎯 TrueSens: ${results.sensitivity} sens (${results.label})\neDPI: ${results.edpi} | cm/360: ${results.cm360}\n\n⚠️ NOT changing for 7 days! #TrueSens`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.06)] text-white font-medium hover:bg-[rgba(255,255,255,0.1)] transition-all"
        >
          <Share2 className="w-5 h-5" />
          Share
        </motion.button>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex gap-3"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.06)] text-white font-medium hover:bg-[rgba(255,255,255,0.1)] transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={!agreed || saving}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5" />
          {status === 'authenticated' ? (saving ? 'Saving...' : 'I Accept & Continue') : 'Login & Save'}
        </button>
      </motion.div>

      {/* Restart */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={onRestart}
        className="w-full text-center text-sm text-[#525a6b] hover:text-white transition-colors py-2"
      >
        Start Over
      </motion.button>
    </div>
  );
}