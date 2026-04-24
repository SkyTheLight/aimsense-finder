'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Crown,
  Download,
  Gauge,
  History,
  Monitor,
  Moon,
  MousePointer,
  Play,
  RefreshCw,
  Settings,
  Share2,
  Sparkles,
  Sun,
  Target,
  Trophy,
  Video,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';

interface MetricCard {
  id: string;
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  sparkline?: number[];
}

interface TrainingVideo {
  id: number;
  title: string;
  creator: string;
  duration: string;
  views: string;
  category: string;
}

interface AICoachTip {
  id: number;
  text: string;
  priority: 'high' | 'medium' | 'low';
}

function Sparkline({ data, color = '#38BDF8' }: { data: number[]; color?: string }) {
  const width = 112;
  const height = 36;
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="opacity-90">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [sensitivityData, setSensitivityData] = useState({
    current: 0.5,
    recommended: 0.48,
    change: -4,
    min: 0.46,
    max: 0.54,
  });
  const [sensitivitySlider, setSensitivitySlider] = useState(0.5);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('truesens-theme') as 'dark' | 'light' | null;
    const resolved = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
    setTheme(resolved);
    document.documentElement.dataset.theme = resolved;
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      window.localStorage.setItem('truesens-theme', next);
      return next;
    });
  };

  const metrics: MetricCard[] = useMemo(
    () => [
      { id: 'accuracy', label: 'Accuracy', value: 71, trend: 'up', icon: <Target className="h-5 w-5" />, sparkline: [66, 67, 69, 68, 70, 71, 71] },
      { id: 'tracking', label: 'Tracking', value: 40, trend: 'down', icon: <MousePointer className="h-5 w-5" />, sparkline: [49, 47, 45, 44, 42, 41, 40] },
      { id: 'flick', label: 'Flick Precision', value: 35, trend: 'down', icon: <Zap className="h-5 w-5" />, sparkline: [41, 40, 38, 37, 36, 35, 35] },
      { id: 'speed', label: 'Speed', value: 65, trend: 'up', icon: <Gauge className="h-5 w-5" />, sparkline: [58, 60, 61, 62, 64, 65, 65] },
      { id: 'consistency', label: 'Consistency', value: 60, trend: 'stable', icon: <Activity className="h-5 w-5" />, sparkline: [56, 57, 58, 59, 60, 60, 60] },
    ],
    [],
  );

  const trainingVideos: TrainingVideo[] = [
    { id: 1, title: 'Advanced Tracking Drills for Ranked', creator: 'AimLab Pro', duration: '15:32', views: '125K', category: 'Tracking' },
    { id: 2, title: 'Flick Accuracy Fundamentals', creator: 'Valorant Coach', duration: '22:15', views: '89K', category: 'Flicking' },
    { id: 3, title: 'Micro Adjustment Mastery', creator: 'Senzera', duration: '18:45', views: '156K', category: 'Precision' },
  ];

  const coachTips: AICoachTip[] = [
    { id: 1, text: 'Focus on smooth horizontal tracking for 15 minutes daily.', priority: 'high' },
    { id: 2, text: 'Reduce grip tension. Aim for roughly 50% pressure during flicks.', priority: 'high' },
    { id: 3, text: 'Film one session weekly so your misses are measurable instead of anecdotal.', priority: 'medium' },
    { id: 4, text: 'Practice one skill theme per block instead of mixing everything together.', priority: 'low' },
  ];

  const sensitivityHistory = [
    { date: 'JAN', value: 0.52, score: 68 },
    { date: 'FEB', value: 0.5, score: 70 },
    { date: 'MAR', value: 0.55, score: 65 },
    { date: 'APR', value: 0.48, score: 72 },
    { date: 'MAY', value: 0.5, score: 71 },
  ];

  const handleRecalibrate = useCallback(() => {
    setIsRecalibrating(true);
    setTimeout(() => {
      setIsRecalibrating(false);
      setSensitivityData((prev) => ({ ...prev, current: prev.recommended }));
    }, 2500);
  }, []);

  const handleExport = useCallback(() => {
    const data = `Performance Score: 71/100
Rank: Diamond
Confidence: 65%
Current Sensitivity: ${sensitivityData.current}
Recommended Sensitivity: ${sensitivityData.recommended}

Metrics:
${metrics.map((metric) => `${metric.label}: ${metric.value}`).join('\n')}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `truesens-report-${new Date().toISOString().split('T')[0]}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [metrics, sensitivityData.current, sensitivityData.recommended]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'My TrueSens Profile',
        text: 'Check out my aim stats on TrueSens.',
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Target },
    { id: 'analyzer', label: 'Analyzer', icon: Settings },
    { id: 'history', label: 'History', icon: History },
    { id: 'training', label: 'Training', icon: Play },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)]">
        <div className="rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-center shadow-[0_30px_90px_rgba(2,6,23,0.16)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white shadow-[0_18px_40px_rgba(14,165,233,0.24)]">
            <Sparkles className="h-7 w-7 animate-pulse" />
          </div>
          <div className="mt-6 text-lg font-semibold text-[var(--app-text-primary)]">Initializing TrueSens dashboard</div>
          <div className="mt-2 text-sm text-[var(--app-text-muted)]">Preparing your competitive performance snapshot.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[var(--app-bg)] text-[var(--app-text-primary)]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.10),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.10),transparent_24%)]" />
      </div>
      <div className="relative z-10 flex w-full gap-6 py-16">
        <aside className={`space-y-6 rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.10)] ${sidebarCollapsed ? 'w-[112px]' : 'w-[284px]'}`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} gap-3`}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div className="text-base font-semibold tracking-[-0.03em]">TrueSens</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Aim OS</div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button onClick={() => setSidebarCollapsed(true)} className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-3 py-2 text-xs text-[var(--app-text-secondary)]">
                Collapse
              </button>
            )}
          </div>

          <nav className="grid gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} rounded-2xl py-3 text-sm font-medium transition-colors ${
                  activeNav === item.id
                    ? 'bg-[var(--app-accent)] text-white'
                    : 'bg-transparent text-[var(--app-text-secondary)] hover:bg-[var(--app-surface-soft)]'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {!sidebarCollapsed && item.label}
              </button>
            ))}
          </nav>

          <div className="space-y-4 rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-6">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <>
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-[var(--app-text-muted)]">Rank Progress</div>
                    <div className="text-lg font-semibold text-[var(--app-text-primary)]">Diamond</div>
                  </div>
                  <Crown className="h-5 w-5 text-cyan-400" />
                </>
              )}
              {sidebarCollapsed && <Crown className="mx-auto h-5 w-5 text-cyan-400" />}
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="h-2 rounded-full bg-[var(--app-border)]">
                  <div className="h-2 w-[85%] rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" />
                </div>
                <div className="text-xs text-[var(--app-text-muted)]">85% toward next competitive milestone</div>
              </>
            )}
          </div>
        </aside>

        <main className="flex-1 space-y-12 rounded-[36px] border border-[var(--app-border)] bg-[var(--app-surface)] p-8 shadow-[0_24px_80px_rgba(2,6,23,0.10)]">
          <header className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--app-accent)]">Command Center</div>
              <h1 className="text-4xl font-semibold tracking-[-0.05em]">Performance Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-3 text-[var(--app-text-primary)]">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button onClick={() => setSoundEnabled((prev) => !prev)} className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-3 text-[var(--app-text-primary)]">
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button onClick={handleExport} className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-3 text-sm font-medium text-[var(--app-text-primary)]">
                <Download className="mr-2 inline h-4 w-4" />
                Export
              </button>
              <button onClick={handleShare} className="rounded-2xl bg-[var(--app-accent)] px-4 py-3 text-sm font-medium text-white">
                <Share2 className="mr-2 inline h-4 w-4" />
                Share
              </button>
            </div>
          </header>

          <section className="grid grid-cols-[1.1fr_0.9fr] gap-6">
            <div className="space-y-6 rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="text-sm uppercase tracking-[0.16em] text-[var(--app-text-muted)]">Current Snapshot</div>
                  <div className="text-5xl font-semibold tracking-[-0.06em]">71/100</div>
                </div>
                <div className="rounded-[24px] bg-[var(--app-accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--app-accent)]">Diamond tier</div>
              </div>
              <p className="max-w-2xl text-base leading-8 text-[var(--app-text-secondary)]">
                A high-confidence snapshot of where your current sensitivity is helping and where it is still costing precision.
              </p>

              <div className="grid grid-cols-5 gap-4">
                {metrics.map((metric) => (
                  <div key={metric.id} className="space-y-4 rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--app-accent-soft)] text-[var(--app-accent)]">{metric.icon}</div>
                      <span className={`text-xs font-semibold uppercase tracking-[0.16em] ${metric.trend === 'up' ? 'text-emerald-500' : metric.trend === 'down' ? 'text-rose-500' : 'text-[var(--app-text-muted)]'}`}>
                        {metric.trend}
                      </span>
                    </div>
                    <div className="text-3xl font-semibold tracking-[-0.05em]">{metric.value}</div>
                    <div className="text-xs uppercase tracking-[0.14em] text-[var(--app-text-muted)]">{metric.label}</div>
                    <div>{metric.sparkline && <Sparkline data={metric.sparkline} color={metric.trend === 'down' ? '#F43F5E' : metric.trend === 'up' ? '#22C55E' : '#64748B'} />}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="text-sm uppercase tracking-[0.16em] text-[var(--app-text-muted)]">Sensitivity Engine</div>
                  <div className="text-3xl font-semibold tracking-[-0.05em]">Live tuning panel</div>
                </div>
                <Monitor className="h-6 w-6 text-[var(--app-accent)]" />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  ['Current', sensitivityData.current.toFixed(2)],
                  ['Delta', `${sensitivityData.change}%`],
                  ['Recommended', sensitivityData.recommended.toFixed(2)],
                ].map(([label, value]) => (
                  <div key={label} className="space-y-4 rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
                    <div className="text-xs uppercase tracking-[0.16em] text-[var(--app-text-muted)]">{label}</div>
                    <div className="text-3xl font-semibold tracking-[-0.05em]">{value}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-[var(--app-text-secondary)]">
                  <span>Optimal range</span>
                  <span>{sensitivityData.min.toFixed(2)} - {sensitivityData.max.toFixed(2)}</span>
                </div>
                <div className="relative h-3 rounded-full bg-[var(--app-border)]">
                  <div className="absolute inset-y-0 left-0 w-[66%] rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-500" />
                  <div className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-white bg-[var(--app-accent)] shadow-[0_14px_30px_rgba(14,165,233,0.35)]" style={{ left: `calc(${((sensitivitySlider - 0.1) / 0.9) * 100}% - 12px)` }} />
                  <input type="range" min="0.1" max="1" step="0.01" value={sensitivitySlider} onChange={(e) => setSensitivitySlider(parseFloat(e.target.value))} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                </div>
              </div>

              <button
                onClick={handleRecalibrate}
                disabled={isRecalibrating}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--app-accent)] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(14,165,233,0.22)] disabled:opacity-70"
              >
                {isRecalibrating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {isRecalibrating ? 'Analyzing sensitivity...' : 'Recalibrate with new sensitivity'}
              </button>
            </div>
          </section>

          <section className="grid grid-cols-[0.9fr_1.1fr] gap-6">
            <div className="space-y-6 rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-8">
              <div className="text-sm uppercase tracking-[0.16em] text-[var(--app-text-muted)]">AI Coach</div>
              <div className="text-3xl font-semibold tracking-[-0.05em]">High-priority guidance</div>
              <div className="grid gap-4">
                {coachTips.map((tip) => (
                  <div key={tip.id} className="rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold ${tip.priority === 'high' ? 'bg-rose-500/12 text-rose-500' : tip.priority === 'medium' ? 'bg-amber-500/12 text-amber-500' : 'bg-emerald-500/12 text-emerald-500'}`}>
                        {tip.id}
                      </div>
                      <p className="text-sm leading-7 text-[var(--app-text-secondary)]">{tip.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="space-y-6 rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-4">
                    <div className="text-sm uppercase tracking-[0.16em] text-[var(--app-text-muted)]">Training Videos</div>
                    <div className="text-3xl font-semibold tracking-[-0.05em]">Recommended playlist</div>
                  </div>
                  <Video className="h-6 w-6 text-[var(--app-accent)]" />
                </div>
                <div className="grid gap-4">
                  {trainingVideos.map((video) => (
                    <div key={video.id} className="flex items-center justify-between rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
                      <div className="space-y-4">
                        <div className="text-base font-semibold tracking-[-0.02em]">{video.title}</div>
                        <div className="text-sm text-[var(--app-text-secondary)]">{video.creator} · {video.duration} · {video.views} views</div>
                      </div>
                      <div className="rounded-full bg-[var(--app-accent-soft)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--app-accent)]">{video.category}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 rounded-[32px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-4">
                    <div className="text-sm uppercase tracking-[0.16em] text-[var(--app-text-muted)]">History</div>
                    <div className="text-3xl font-semibold tracking-[-0.05em]">Sensitivity trendline</div>
                  </div>
                  <Trophy className="h-6 w-6 text-[var(--app-accent)]" />
                </div>
                <div className="flex h-48 items-end gap-4">
                  {sensitivityHistory.map((point) => (
                    <div key={point.date} className="flex flex-1 flex-col items-center gap-4">
                      <div className="w-full rounded-t-[24px] bg-gradient-to-t from-cyan-500/30 to-violet-500/65" style={{ height: `${point.score}%` }} />
                      <div className="text-xs uppercase tracking-[0.16em] text-[var(--app-text-muted)]">{point.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <footer className="flex items-center justify-between rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-6">
            <div className="text-sm text-[var(--app-text-secondary)]">TrueSens v2.0 · Powered by Groq AI · Built for tactical FPS players</div>
            <div className="text-sm text-[var(--app-text-muted)]">{currentTime ? currentTime.toLocaleTimeString() : ""}</div>
          </footer>
        </main>
      </div>
    </div>
  );
}
