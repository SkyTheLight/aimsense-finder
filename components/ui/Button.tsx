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
  icon?: ReactNode;
}

export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  onClick,
  type = 'button',
  icon,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0c14] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-[#00d4ff] to-[#7b5cff] text-[#050508] hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-[#161a27] border border-[rgba(255,255,255,0.1)] text-white hover:border-[#00d4ff] hover:text-[#00d4ff] hover:bg-[rgba(0,212,255,0.05)]',
    ghost: 'bg-transparent text-[#94a3b8] hover:text-white hover:bg-white/5',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm gap-1.5 rounded-lg',
    md: 'h-12 px-6 text-base gap-2',
    lg: 'h-14 px-8 text-lg gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}