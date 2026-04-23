'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'glow';
  onClick?: () => void;
}

export function Card({ children, className = '', variant = 'default', onClick }: CardProps) {
  const baseClasses = 'relative overflow-hidden';
  
  const variants = {
    default: 'bg-[#161a27] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6',
    bordered: 'bg-[#161a27] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 hover:border-[rgba(0,212,255,0.3)] transition-all',
    glow: 'bg-gradient-to-b from-[#161a27] to-[#0a0c14] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 shadow-[0_0_40px_rgba(0,212,255,0.08)]',
  };

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.99 } : {}}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent opacity-30" />
      {children}
    </motion.div>
  );
}