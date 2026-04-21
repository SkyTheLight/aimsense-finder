'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Target, Zap, Award, Layers } from 'lucide-react';

interface WelcomeStepProps {
  onStart: () => void;
}

export function WelcomeStep({ onStart }: WelcomeStepProps) {
  const features = [
    { icon: Target, title: 'PSA Method', description: 'Binary search calibration' },
    { icon: Zap, title: 'Aim Style Detection', description: 'Personalized profile' },
    { icon: Award, title: 'Voltaic Benchmarks', description: 'Performance analysis' },
    { icon: Layers, title: 'Smart Engine', description: 'Personalized results' },
  ];

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          AimSense <span className="text-[#00ff88]">Finder</span>
        </h1>
        <p className="text-[#94a3b8] text-lg mb-8 max-w-md mx-auto">
          Discover your perfect mouse sensitivity with scientifically-backed calibration methods
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-2 gap-4 mb-10 max-w-lg mx-auto"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4 text-left hover:border-[#00ff88]/30 transition-colors"
          >
            <feature.icon className="w-6 h-6 text-[#00ff88] mb-2" />
            <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
            <p className="text-[#64748b] text-xs">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button onClick={onStart} size="lg">
          Start Calibration
        </Button>
        <p className="text-[#64748b] text-sm mt-4">
          Takes ~10 minutes • Works with any game
        </p>
      </motion.div>
    </div>
  );
}