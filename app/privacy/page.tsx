'use client';

import { useEffect, useState } from 'react';
import { DesktopPageShell } from '@/components/layout/DesktopPageShell';

const sections = [
  {
    title: 'Information We Collect',
    body: 'We collect the information you provide directly to the service, including Google account identity, profile fields, hardware settings, and benchmark-related performance data.',
  },
  {
    title: 'How We Use Your Information',
    body: 'We use your information to generate recommendations, personalize coaching outputs, persist your settings, and improve the service through aggregate usage analysis.',
  },
  {
    title: 'Storage and Security',
    body: 'Your data is stored using managed infrastructure and protected with industry-standard controls. No internet system is perfectly secure, but appropriate safeguards are applied.',
  },
  {
    title: 'Third-Party Services',
    body: 'The product relies on third-party providers for authentication, database infrastructure, AI features, and external content recommendations. Those services maintain their own policies.',
  },
  {
    title: 'Your Rights',
    body: 'You may request access, correction, export, or deletion of your personal data, subject to legal and operational requirements.',
  },
];

export default function PrivacyPage() {
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
      title="Privacy Policy"
      description="How TrueSens handles identity, settings, profile data, and recommendation-related information."
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
