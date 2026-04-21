'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'glow' | 'bordered';
}

export function Card({ children, className = '', variant = 'default', ...props }: CardProps) {
  const baseStyles = 'bg-[#12121a] rounded-xl p-6';

  const variants = {
    default: '',
    glow: 'hover:shadow-[0_4px_24px_rgba(0,255,136,0.08)] border border-transparent hover:border-[#2a2a3a]',
    bordered: 'border border-[#2a2a3a]',
  };

  return (
    <motion.div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}