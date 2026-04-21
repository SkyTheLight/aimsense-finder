'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Target, Zap, Award, Layers, ChevronRight } from 'lucide-react';

interface WelcomeStepProps {
  onStart: () => void;
}

export function WelcomeStep({ onStart }: WelcomeStepProps) {
  const features = [
    { icon: Target, title: 'PSA Method', description: 'Scientific calibration' },
    { icon: Zap, title: 'Aim Analysis', description: 'Your playstyle profile' },
    { icon: Award, title: 'Pro Benchmarks', description: 'Track your progress' },
    { icon: Layers, title: 'Smart Engine', description: 'Personalized settings' },
  ];

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00ff88]/10 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-[#00ff88] text-xs font-medium">Precision Aim Calibration</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          AimSense <span className="text-[#00ff88]">Finder</span>
        </h1>
        <p className="text-[#94a3b8] text-base mb-8 max-w-sm mx-auto leading-relaxed">
          Find your optimal mouse sensitivity with scientifically-backed calibration
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
        className="grid grid-cols-2 gap-3 mb-8 max-w-lg mx-auto"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4 text-left hover:border-[#00ff88]/30 transition-all duration-200 hover:bg-[#1a1a24]"
          >
            <feature.icon className="w-5 h-5 text-[#00ff88] mb-2" />
            <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
            <p className="text-[#64748b] text-xs">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      >
        <Button onClick={onStart} size="lg" className="w-full max-w-xs">
          <span>Get Started</span>
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
        <p className="text-[#64748b] text-sm mt-4">
          ~10 min • Works with any FPS game
        </p>
      </motion.div>
    </div>
  );
}