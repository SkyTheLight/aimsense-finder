'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative inline-flex h-11 w-20 items-center rounded-full border border-[var(--app-border-strong)] bg-[var(--app-surface)] p-1 shadow-[0_10px_30px_rgba(2,6,23,0.12)] transition-colors"
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="absolute h-9 w-9 rounded-full bg-[var(--app-accent)] shadow-[0_10px_24px_rgba(14,165,233,0.35)]"
        style={{ left: isDark ? 4 : 36 }}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1.5 text-[var(--app-text-muted)]">
        <Moon className={`h-4 w-4 transition-colors ${isDark ? 'text-white' : ''}`} />
        <Sun className={`h-4 w-4 transition-colors ${!isDark ? 'text-white' : ''}`} />
      </span>
    </button>
  );
}
