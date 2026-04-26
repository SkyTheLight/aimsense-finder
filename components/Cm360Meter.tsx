'use client';

import { motion } from 'framer-motion';

interface Cm360MeterProps {
  value: number;
  recommendedMin?: number;
  recommendedMax?: number;
  targetValue?: number;
}

export default function Cm360Meter({ value, recommendedMin, recommendedMax, targetValue }: Cm360MeterProps) {
  const min = 20;
  const max = 70;

  const getPosition = (val: number) => {
    return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
  };

  const getStatus = (cm: number): { label: string; color: string; message: string } => {
    if (cm < 30) return { label: 'TOO FAST', color: 'bg-red-500', message: 'Too fast causes overflicking and instability' };
    if (cm < 40) return { label: 'FAST', color: 'bg-orange-400', message: 'Good for close-range combat' };
    if (cm < 45) return { label: 'BALANCED', color: 'bg-green-500', message: 'Pro baseline range - ideal for all distances' };
    if (cm < 60) return { label: 'SLOW', color: 'bg-blue-400', message: 'Good for precision and long-range' };
    return { label: 'TOO SLOW', color: 'bg-purple-500', message: 'Too slow limits reaction speed' };
  };

  const status = getStatus(value);
  const targetStatus = targetValue ? getStatus(targetValue) : null;

  return (
    <div className="w-full space-y-3">
      <div className="relative h-5 rounded-xl overflow-hidden flex shadow-inner">
        {/* Zone: TOO FAST (red) */}
        <div className="w-[14%] bg-red-500/80" />
        
        {/* Zone: FAST (orange) */}
        <div className="w-[14%] bg-orange-400/80" />
        
        {/* Zone: BALANCED (green) */}
        <div className="w-[7%] bg-green-500/80" />
        
        {/* Zone: SLOW (blue) */}
        <div className="w-[21%] bg-blue-400/80" />
        
        {/* Zone: TOO SLOW (purple) */}
        <div className="w-[14%] bg-purple-500/80" />

        {/* Recommended Zone Overlay */}
        {recommendedMin !== undefined && recommendedMax !== undefined && (
          <div
            className="absolute top-0 h-full bg-white/20 border-x-2 border-white/50 z-10"
            style={{
              left: `${getPosition(recommendedMin)}%`,
              width: `${getPosition(recommendedMax) - getPosition(recommendedMin)}%`,
            }}
          />
        )}

        {/* Target Marker */}
        {targetValue && (
          <div
            className="absolute top-0 h-full w-1 bg-yellow-400 z-20"
            style={{ left: `${getPosition(targetValue)}%` }}
          />
        )}

        {/* Current Position Marker */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-black rounded-full shadow-lg z-30"
          style={{ left: `${getPosition(value)}%`, marginLeft: '-10px' }}
          initial={{ left: '0%' }}
          animate={{ left: `${getPosition(value)}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs font-mono opacity-50">
        <span>20</span>
        <span>30</span>
        <span>40</span>
        <span>45</span>
        <span>60</span>
        <span>70</span>
      </div>

      {/* Status Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${status.color}`} />
          <span className="font-bold text-[var(--app-text-primary)]">{status.label}</span>
        </div>
        <span className="text-2xl font-mono font-bold text-[var(--app-text-primary)]">
          {value.toFixed(1)} <span className="text-sm font-normal opacity-50">cm/360</span>
        </span>
      </div>

      {/* Message */}
      <p className="text-sm opacity-70">{status.message}</p>

      {/* Target Indicator */}
      {targetValue && targetStatus && targetValue !== value && (
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--app-border)]">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="text-sm text-yellow-400">
            Recommended: {targetValue.toFixed(1)} cm/360 ({targetStatus.label})
          </span>
        </div>
      )}
    </div>
  );
}