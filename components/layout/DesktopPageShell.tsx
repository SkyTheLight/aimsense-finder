'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface DesktopPageShellProps {
  theme: 'dark' | 'light';
  onToggleTheme?: () => void;
  title: string;
  eyebrow?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function DesktopPageShell({
  theme,
  onToggleTheme,
  title,
  eyebrow,
  description,
  backHref,
  backLabel,
  actions,
  children,
}: DesktopPageShellProps) {
  return (
    <div className="min-h-screen w-full bg-[var(--app-bg)] text-[var(--app-text-primary)]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.10),transparent_24%)]" />
      </div>

      <div className="relative z-10 w-full py-6">
        <header className="flex items-center justify-between rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface)] px-6 py-4 shadow-[0_18px_50px_rgba(2,6,23,0.08)]">
          <Link href="/" className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)]">
              <Image src="/truesenslogo.png" alt="TrueSens" fill className="object-cover" />
            </div>
            <div>
              <div className="text-base font-semibold tracking-[-0.03em] text-[var(--app-text-primary)]">TrueSens</div>
              <div className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Competitive Aim Platform</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {actions}
            {onToggleTheme && <ThemeToggle theme={theme} onToggle={onToggleTheme} />}
          </div>
        </header>

        <div className="mt-6 rounded-[36px] border border-[var(--app-border)] bg-[var(--app-surface)] p-8 shadow-[0_24px_80px_rgba(2,6,23,0.10)]">
          {(eyebrow || title || description || backHref) && (
            <div className="mb-12 flex items-end justify-between gap-8">
              <div>
                {backHref && backLabel && (
                  <Link
                    href={backHref}
                    className="mb-6 inline-flex rounded-full border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--app-text-secondary)] transition-colors hover:text-[var(--app-text-primary)]"
                  >
                    {backLabel}
                  </Link>
                )}
                {eyebrow && <div className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--app-accent)]">{eyebrow}</div>}
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[var(--app-text-primary)]">{title}</h1>
                {description && <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--app-text-secondary)]">{description}</p>}
              </div>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
