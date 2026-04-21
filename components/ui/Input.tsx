'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-[#94a3b8] mb-2">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full h-12 px-4 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#00ff88] focus:shadow-[0_0_0_2px_rgba(0,255,136,0.1)] transition-all duration-200 ${error ? 'border-[#ef4444]' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[#ef4444]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';