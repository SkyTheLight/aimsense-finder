'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#94a3b8] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full h-12 bg-[#161a27] border border-[rgba(255,255,255,0.1)] rounded-xl text-white placeholder:text-[#334155] focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all duration-200 ${icon ? 'pl-12 pr-4' : 'px-4'} ${error ? 'border-[#ff4757]' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[#ff4757] text-sm mt-1.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';