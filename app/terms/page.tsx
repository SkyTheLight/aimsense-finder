'use client';

import { useEffect, useState } from 'react';
import { DesktopPageShell } from '@/components/layout/DesktopPageShell';

const sections = [
  {
    title: 'Acceptance of Terms',
    body: 'By accessing and using TrueSens, you agree to be bound by these terms. If you do not agree, do not use the service.',
  },
  {
    title: 'Description of Service',
    body: 'TrueSens provides AI-powered sensitivity guidance, aim coaching outputs, and performance benchmarking for competitive players. Results vary by user, hardware, and practice.',
  },
  {
    title: 'User Responsibilities',
    body: 'You agree to provide accurate information, protect your account access, and avoid unlawful or disruptive use of the platform.',
  },
  {
    title: 'Intellectual Property',
    body: 'All service content, UI, and functionality remain protected by applicable intellectual property law and may not be copied or redistributed without permission.',
  },
  {
    title: 'Limitations and Warranties',
    body: 'The service is provided as-is. We do not guarantee any specific in-game result, ranking change, or performance gain from recommendations.',
  },
];

export default function TermsPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = window.localStorage.getItem('truesens-theme') as 'dark' | 'light' | null;
    const resolved = saved === 'light' || saved === 'dark' ? saved : 'dark';
    setTheme(resolved);
    document.documentElement.dataset.theme = resolved;
  }, []);

  return (
    <DesktopPageShell
      theme={theme}
      eyebrow="Legal"
      title="Terms of Service"
      description="The rules governing the use of TrueSens, its recommendation system, and account-backed features."
      backHref="/"
      backLabel="Back"
    >
      <div className="space-y-4">
        {sections.map((section) => (
          <section key={section.title} className="rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-6">
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--app-text-primary)]">{section.title}</h2>
            <p className="mt-3 text-sm leading-8 text-[var(--app-text-secondary)]">{section.body}</p>
          </section>
        ))}
        <p className="pt-2 text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Last updated: April 2026</p>
      </div>
    </DesktopPageShell>
  );
}
