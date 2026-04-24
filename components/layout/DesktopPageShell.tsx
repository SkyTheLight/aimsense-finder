"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface DesktopPageShellProps {
  theme: "dark" | "light";
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
      {/* Subtle ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[1200px] opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(14,165,233,0.08), transparent)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="shrink-0 border-b border-[var(--app-border)] bg-[var(--app-bg)]/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-[10px] border border-[var(--app-border)] bg-[var(--app-surface-soft)]">
                <Image
                  src="/truesenslogo.png"
                  alt="TrueSens"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--app-text-primary)]">
                  TrueSens
                </div>
                <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
                  Aim Optimization
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {actions}
              {onToggleTheme && (
                <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-8 py-10">
          {/* Page Header */}
          {(eyebrow || title || description || backHref) && (
            <div className="mb-10 flex items-end justify-between gap-8">
              <div className="max-w-2xl">
                {backHref && backLabel && (
                  <Link
                    href={backHref}
                    className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[var(--app-text-secondary)] transition-colors hover:border-[var(--app-border-medium)] hover:text-[var(--app-text-primary)]"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    {backLabel}
                  </Link>
                )}
                {eyebrow && (
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-accent)]">
                    {eyebrow}
                  </div>
                )}
                <h1 className="mt-3 text-[32px] font-bold tracking-[-0.03em] text-[var(--app-text-primary)]">
                  {title}
                </h1>
                {description && (
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--app-text-secondary)]">
                    {description}
                  </p>
                )}
              </div>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}

