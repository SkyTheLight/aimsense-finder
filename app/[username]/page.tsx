'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Copy, Share2, TrendingUp } from 'lucide-react';
import { DesktopPageShell } from '@/components/layout/DesktopPageShell';

interface SharedSettings {
  game: string;
  dpi: number;
  sensitivity: number;
  edpi: number;
  cm360: number;
  mouseGrip?: string;
  aimStyle?: string;
  label?: string;
  rank?: string;
  score?: number;
  history?: { date: string; sens: number; score: number }[];
}

const rankColors: Record<string, string> = {
  Iron: '#6B7280',
  Bronze: '#CD7F32',
  Silver: '#94A3B8',
  Gold: '#F59E0B',
  Platinum: '#14B8A6',
  Diamond: '#38BDF8',
  Ascendant: '#22C55E',
  Radiant: '#F43F5E',
  Pro: '#A855F7',
};

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [data, setData] = useState<SharedSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('truesens-theme') as 'dark' | 'light' | null;
    const resolved = saved === 'light' || saved === 'dark' ? saved : 'dark';
    setTheme(resolved);
    document.documentElement.dataset.theme = resolved;
  }, []);

  useEffect(() => {
    if (!username) return;
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/share/${username}`);
        if (!res.ok) {
          setError('Profile not found');
          return;
        }
        const json = await res.json();
        setData({
          ...json,
          rank: json.rank || 'Gold',
          score: json.score || 72,
          history: json.history || [
            { date: '2024-01', sens: 0.48, score: 65 },
            { date: '2024-02', sens: 0.50, score: 68 },
            { date: '2024-03', sens: 0.49, score: 72 },
          ],
        });
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [username]);

  const rank = useMemo(() => data?.rank || 'Gold', [data?.rank]);
  const rankColor = rankColors[rank] || '#38BDF8';

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareProfile = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `@${username} | TrueSens Profile`,
        text: `Check out my aim profile on TrueSens! Rank: ${rank}`,
        url: window.location.href,
      });
    } else {
      copyLink();
    }
  };

  if (loading) {
    return (
      <DesktopPageShell theme={theme} eyebrow="Share Profile" title="Loading profile..." description="Fetching public sensitivity data.">
        <div className="h-[480px] rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface-soft)]" />
      </DesktopPageShell>
    );
  }

  if (error || !data) {
    return (
      <DesktopPageShell
        theme={theme}
        eyebrow="Share Profile"
        title="Profile not found"
        description={`The public profile for @${username} could not be loaded.`}
        backHref="/"
        backLabel="Back"
      >
        <div className="rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-12 text-center text-[var(--app-text-secondary)]">
          No public sensitivity profile is available for this user.
        </div>
      </DesktopPageShell>
    );
  }

  return (
    <DesktopPageShell
      theme={theme}
      eyebrow="Share Profile"
      title={`@${username}`}
      description="Public competitive sensitivity profile."
      backHref="/"
      backLabel="Back"
      actions={
        <>
          <button onClick={copyLink} className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-2.5 text-sm font-medium text-[var(--app-text-primary)]">
            {copied ? 'Copied' : 'Copy link'}
          </button>
          <button onClick={shareProfile} className="rounded-2xl bg-[var(--app-accent)] px-4 py-2.5 text-sm font-medium text-white">
            Share
          </button>
        </>
      }
    >
      <div className="grid grid-cols-[0.85fr_1.15fr] gap-6">
        <section className="rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-8">
          <div
            className="flex h-28 w-28 items-center justify-center rounded-[32px] text-4xl font-semibold text-[var(--app-text-primary)]"
            style={{ background: `linear-gradient(135deg, ${rankColor}, ${rankColor}80)` }}
          >
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="mt-6 inline-flex rounded-full px-4 py-2 text-sm font-semibold" style={{ color: rankColor, backgroundColor: `${rankColor}18` }}>
            {rank} Tier
          </div>
          <div className="mt-6 grid gap-3">
            {[
              ['Game', data.game.toUpperCase()],
              ['DPI', `${data.dpi}`],
              ['Sensitivity', data.sensitivity.toFixed(2)],
              ['eDPI', `${data.edpi}`],
              ['cm/360', data.cm360.toFixed(1)],
              ['Aim Style', data.aimStyle || 'Hybrid'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3">
                <span className="text-sm text-[var(--app-text-muted)]">{label}</span>
                <span className="font-medium text-[var(--app-text-primary)]">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface)] p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.16em] text-[var(--app-text-muted)]">Performance Snapshot</div>
              <div className="text-3xl font-semibold tracking-[-0.04em] text-[var(--app-text-primary)]">{data.score || 72}/100</div>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-6">
            <div className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Sensitivity History</div>
            <div className="flex h-48 items-end gap-3">
              {(data.history || []).map((point) => (
                <div key={point.date} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-[20px]"
                    style={{
                      height: `${point.score}%`,
                      background: `linear-gradient(180deg, ${rankColor}AA, ${rankColor}35)`,
                    }}
                  />
                  <div className="text-xs text-[var(--app-text-muted)]">{point.date.slice(-2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={copyLink} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-3 text-sm font-medium text-[var(--app-text-primary)]">
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button onClick={shareProfile} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--app-accent)] px-4 py-3 text-sm font-medium text-white">
              <Share2 className="h-4 w-4" />
              Share Profile
            </button>
          </div>
        </section>
      </div>
    </DesktopPageShell>
  );
}
