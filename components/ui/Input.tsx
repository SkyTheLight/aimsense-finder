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
          <label className="block text-sm font-medium text-[var(--app-text-secondary)] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-text-muted)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full h-12 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl text-[var(--app-text-primary)] placeholder:text-[var(--app-text-muted)] focus:outline-none focus:border-[var(--app-accent)] focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] transition-all duration-200 ${icon ? 'pl-12 pr-4' : 'px-4'} ${error ? 'border-red-500' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-1.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';