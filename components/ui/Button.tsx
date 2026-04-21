'use client';

import { ReactNode, MouseEventHandler } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  onClick,
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none';

  const variants = {
    primary: 'bg-[#00ff88] text-[#0a0a0f] hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] active:scale-[0.98]',
    secondary: 'bg-transparent border border-[#2a2a3a] text-white hover:border-[#00ff88] hover:text-[#00ff88]',
    ghost: 'bg-transparent text-[#94a3b8] hover:text-white',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-5 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}