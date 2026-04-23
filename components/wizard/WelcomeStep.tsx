'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, Sparkles, Zap, Crosshair, Trophy, Gamepad2, Activity } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';

interface WelcomeStepProps {
  onStart: () => void;
}

const features = [
  { 
    icon: Crosshair, 
    title: 'PSA Method', 
    description: 'Scientific calibration based on TenZ\'s revolutionary approach',
    color: 'from-cyan-500 to-cyan-400'
  },
  { 
    icon: Zap, 
    title: 'AI Analysis', 
    description: 'Personalized tips powered by advanced algorithms',
    color: 'from-purple-500 to-purple-400'
  },
  { 
    icon: Trophy, 
    title: 'Pro Benchmarks', 
    description: 'Compare your scores against Voltaic standards',
    color: 'from-amber-500 to-amber-400'
  },
  { 
    icon: Gamepad2, 
    title: 'Competitive FPS', 
    description: 'Optimized for Valorant and CS2',
    color: 'from-green-500 to-green-400'
  },
];

const socialProof = [
  { count: '50K+', label: 'Calibrations' },
  { count: '4.9/5', label: 'Rating' },
  { count: '98%', label: 'Accuracy' },
];

export function WelcomeStep({ onStart }: WelcomeStepProps) {
  const { data: session } = useSession();
  const [showOptions, setShowOptions] = useState(false);

  const handleSignIn = async (provider: string) => {
    await signIn(provider, { callbackUrl: '/?wizard=true' });
  };

  if (showOptions) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-md mx-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">Ready to find your sens?</h2>
          <p className="text-[#b8c0cd] mb-8">Sign in to save your settings or continue as guest</p>
        </motion.div>

        <div className="space-y-3 mb-8">
          {/* Google */}
          <motion.button
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleSignIn('google')}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl bg-white text-black font-medium hover:bg-gray-100 transition-all shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.38-1.36-.38-2.09s.16-1.43.38-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
            <span className="text-xs text-[#525a6b] uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
          </div>

          {/* Guest */}
          <motion.button
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={onStart}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl bg-[rgba(6,182,217,0.1)] border border-[rgba(6,182,217,0.2)] text-[#22d3ee] font-medium hover:bg-[rgba(6,182,217,0.15)] hover:border-[rgba(6,182,217,0.3)] transition-all"
          >
            <ArrowRight className="w-5 h-5" />
            Continue as Guest
          </motion.button>
        </div>

        <button
          onClick={() => setShowOptions(false)}
          className="text-sm text-[#525a6b] hover:text-[#b8c0cd] transition-colors"
        >
          ← Back
        </button>
      </motion.div>
    );
  }

  return (
    <div className="text-center max-w-2xl mx-auto">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[rgba(6,182,217,0.1)] rounded-full mb-8 border border-[rgba(6,182,217,0.15)]"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
        </span>
        <span className="text-sm font-medium text-cyan-400">Precision Aim Calibration</span>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-10"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-400">Perfect Sensitivity</span>
        </h1>
        
        <p className="text-lg text-[#b8c0cd] max-w-lg mx-auto leading-relaxed">
          Discover your optimal mouse sensitivity with scientifically-backed calibration. 
          Personalized for your playstyle and competitive games.
        </p>
      </motion.div>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex items-center justify-center gap-8 mb-10"
      >
        {socialProof.map((item, i) => (
          <div key={item.label} className="text-center">
            <p className="text-2xl font-bold text-white">{item.count}</p>
            <p className="text-sm text-[#525a6b]">{item.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-3 mb-10"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + index * 0.06 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="group bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-left hover:border-[rgba(6,182,217,0.3)] hover:bg-[rgba(6,182,217,0.05)] transition-all"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 shadow-lg`}>
              <feature.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
            <p className="text-[#525a6b] text-xs leading-tight">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowOptions(true)}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold shadow-xl shadow-cyan-500/25 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all"
        >
          <Sparkles className="w-5 h-5" />
          Get Started
          <ChevronRight className="w-5 h-5" />
        </motion.button>
        
        <p className="text-sm text-[#525a6b] mt-5">
          Takes ~3 minutes • Works with any FPS game
        </p>
      </motion.div>
    </div>
  );
}