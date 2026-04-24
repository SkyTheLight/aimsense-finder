const fs = require('fs');

const content = `'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, Crown, Download, Gauge, History, Monitor, Moon,
  MousePointer, Play, RefreshCw, Settings, Share2, Sparkles,
  Sun, Target, Trophy, Video, Volume2, VolumeX, Zap,
} from 'lucide-react';

interface MetricCard {
  id: string; label: string; value: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode; sparkline?: number[];
}

interface TrainingVideo {
  id: number; title: string; creator: string;
  duration: string; views: string; category: string;
}

interface AICoachTip {
  id: number; text: string; priority: 'high' | 'medium' | 'low';
}

function Sparkline({ data, color = '#0EA5E9' }: { data: number[]; color?: string }) {
  const width = 112, height = 36;
  if (!data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return x + ',' + y;
  }).join(' ');
  return (
    <svg width={width} height={height} className='opacity-90'>
      <polyline points={points} fill='none' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}

function Card({ children, className = '', hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={'rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] ' + (hover ? 'transition-all duration-200 hover:border-[var(--app-border-accent)] hover:bg-[var(--app-surface-soft)] ' : '') + className}>
      {children}
    </div>
  );
}

function Badge({ children, variant = 'blue' }: { children: React.ReactNode; variant?: 'blue' | 'green' | 'amber' | 'rose' }) {
  const variants = {
    blue: 'bg-[var(--app-accent-soft)] text-[var(--app-accent)]',
    green: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    rose: 'bg-rose-500/10 text-rose-400',
  };
  return (
    <span className={'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ' + variants[variant]}>
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className='text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]'>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className='text-xl font-bold tracking-[-0.02em] text-[var(--app-text-primary)]'>
      {children}
    </h2>
  );
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [sensitivityData] = useState({ current: 0.5, recommended: 0.48, change: -4, min: 0.46, max: 0.54 });
  const [sensitivitySlider, setSensitivitySlider] = useState(0.5);

  useEffect(() => {
    const saved = window.localStorage.getItem('truesens-theme') as 'dark' | 'light' | null;
    const resolved = saved === 'light' || saved === 'dark' ? saved : 'dark';
    setTheme(resolved);
    document.documentElement.dataset.theme = resolved;
    const timer = setTimeout(() => setIsLoading(false), 700);
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

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const metrics: MetricCard[] = useMemo(() => [
    { id: 'accuracy', label: 'Accuracy', value: 71, trend: 'up', icon: <Target className='h-4 w-4' />, sparkline: [66, 67, 69, 68, 70, 71, 71] },
    { id: 'tracking', label: 'Tracking', value: 40, trend: 'down', icon: <MousePointer className='h-4 w-4' />, sparkline: [49, 47, 45, 44, 42, 41, 40] },
    { id: 'flick', label: 'Flick Precision', value: 35, trend: 'down', icon: <Zap className='h-4 w-4' />, sparkline: [41, 40, 38, 37, 36, 35, 35] },
    { id: 'speed', label: 'Speed', value: 65, trend: 'up', icon: <Gauge className='h-4 w-4' />, sparkline: [58, 60, 61, 62, 64, 65, 65] },
    { id: 'consistency', label: 'Consistency', value: 60, trend: 'stable', icon: <Activity className='h-4 w-4' />, sparkline: [56, 57, 58, 59, 60, 60, 60] },
  ], []);

  const trainingVideos = [
    { id: 1, title: 'Advanced Tracking Drills for Ranked', creator: 'AimLab Pro', duration: '15:32', views: '125K', category: 'Tracking' },
    { id: 2, title: 'Flick Accuracy Fundamentals', creator: 'Valorant Coach', duration: '22:15', views: '89K', category: 'Flicking' },
    { id: 3, title: 'Micro Adjustment Mastery', creator: 'Senzera', duration: '18:45', views: '156K', category: 'Precision' },
  ];

  const coachTips = [
    { id: 1, text: 'Focus on smooth horizontal tracking for 15 minutes daily.', priority: 'high' as const },
    { id: 2, text: 'Reduce grip tension. Aim for roughly 50% pressure during flicks.', priority: 'high' as const },
    { id: 3, text: 'Film one session weekly so your misses are measurable instead of anecdotal.', priority: 'medium' as const },
    { id: 4, text: 'Practice one skill theme per block instead of mixing everything together.', priority: 'low' as const },
  ];

  const sensitivityHistory = [
    { date: 'Jan', value: 0.52, score: 68 },
    { date: 'Feb', value: 0.5, score: 70 },
    { date: 'Mar', value: 0.55, score: 65 },
    { date: 'Apr', value: 0.48, score: 72 },
    { date: 'May', value: 0.5, score: 71 },
  ];

  const handleRecalibrate = useCallback(() => {
    setIsRecalibrating(true);
    setTimeout(() => setIsRecalibrating(false), 2500);
  }, []);

  const handleExport = useCallback(() => {
    const lines = [
      'Performance Score: 71/100',
      'Rank: Diamond',
      'Confidence: 65%',
      'Current Sensitivity: ' + sensitivityData.current,
      'Recommended Sensitivity: ' + sensitivityData.recommended,
      '',
      'Metrics:',
      ...metrics.map((m) => m.label + ': ' + m.value),
    ];
    const blob = new Blob([lines.join('\\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'truesens-report-' + new Date().toISOString().split('T')[0] + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [metrics, sensitivityData]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({ title: 'My TrueSens Profile', text: 'Check out my aim stats on TrueSens.', url: window.location.href });
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
      <div className='flex min-h-screen items-center justify-center bg-[var(--app-bg)]'>
        <div className='text-center'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--app-accent)] to-[var(--app-accent-2)] text-white'>
            <Sparkles className='h-5 w-5 animate-pulse' />
          </div>
          <div className='mt-4 text-sm font-medium text-[var(--app-text-secondary)]'>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full bg-[var(--app-bg)] text-[var(--app-text-primary)]'>
      <div className='pointer-events-none fixed inset-0 overflow-hidden'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[1200px] opacity-30'
          style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 0%, rgba(14,165,233,0.06), transparent)' }} />
      </div>

      <div className='relative z-10 flex min-h-screen'>
        <aside className='w-[240px] shrink-0 border-r border-[var(--app-border)] bg-[var(--app-bg)]'>
          <div className='flex h-16 items-center gap-3 px-6'>
            <div className='flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[var(--app-accent)] to-[var(--app-accent-2)] text-white'>
              <Sparkles className='h-4 w-4' />
            </div>
            <div>
              <div className='text-[15px] font-semibold tracking-[-0.02em]'>TrueSens</div>
              <div className='text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--app-text-muted)]'>Aim OS</div>
          </div>

          <nav className='px-4 py-6'>
            <div className='space-y-1'>
              {navItems.map((item) => (
                <button key={item.id} onClick={() => setActiveNav(item.id)}
                  className={'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ' +
                    (activeNav === item.id ? 'bg-[var(--app-accent-soft)] text-[var(--app-accent)]' : 'text-[var(--app-text-secondary)] hover:bg-[var(--app-surface)] hover:text-[var(--app-text-primary)]')}>
                  <item.icon className='h-4 w-4' />
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          <div className='px-4'>
            <Card className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <SectionLabel>Rank Progress</SectionLabel>
                  <div className='mt-1 text-[15px] font-semibold text-[var(--app-text-primary)]'>Diamond</div>
                <Crown className='h-4 w-4 text-[var(--app-accent)]' />
              </div>
              <div className='mt-3 h-1.5 rounded-full bg-[var(--app-surface-soft)]'>
                <div className='h-1.5 w-[85%] rounded-full bg-gradient-to-r from-[var(--app-accent)] to-[var(--app-accent-2)]' />
              </div>
              <div className='mt-2 text-[11px] text-[var(--app-text-muted)]'>85% toward next milestone</div>
            </Card>
          </div>

          <div className='absolute bottom-0 w-[240px] border-t border-[var(--app-border)] p-4'>
            <div className='text-[11px] text-[var(--app-text-muted)]'>TrueSens v2.0</div>
            <div className='mt-1 text-[11px] text-[var(--app-text-subtle)]'>Powered by Groq AI</div>
        </aside>

        <main className='flex-1 overflow-auto'>
          <header className='sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-bg)]/90 px-8 backdrop-blur-xl'>
            <div><SectionLabel>Command Center</SectionLabel></div>
            <div className='flex items-center gap-2'>
              {currentTime && (
                <div className='mr-4 text-right'>
                  <div className='text-[13px] font-mono font-medium text-[var(--app-text-primary)]'>{formatTime(currentTime)}</div>
                  <div className='text-[11px] text-[var(--app-text-muted)]'>{formatDate(currentTime)}</div>
              )}
              <button onClick={toggleTheme} className='flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--app-border)] text-[var(--app-text-secondary)] transition-colors hover:bg-[var(--app-surface)] hover:text-[var(--app-text-primary)]'>
                {theme === 'dark' ? <Sun className='h-3.5 w-3.5' /> : <Moon className='h-3.5 w-3.5' />}
              </button>
              <button onClick={() => setSoundEnabled((p: boolean) => !p)} className='flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--app-border)] text-[var(--app-text-secondary)] transition-colors hover:bg-[var(--app-surface)] hover:text-[var(--app-text-primary)]'>
                {soundEnabled ? <Volume2 className='h-3.5 w-3.5' /> : <VolumeX className='h-3.5 w-3.5' />}
              </button>
              <button onClick={handleExport} className='flex h-8 items-center gap-1.5 rounded-lg border border-[var(--app-border)] px-3 text-[12px] font-medium text-[var(--app-text-secondary)] transition-colors hover:bg-[var(--app-surface)] hover:text-[var(--app-text-primary)]'>
                <Download className='h-3.5 w-3.5' />Export
              </button>
              <button onClick={handleShare} className='flex h-8 items-center gap-1.5 rounded-lg bg-[var(--app-accent)] px-3 text-[12px] font-medium text-white transition-opacity hover:opacity-90'>
                <Share2 className='h-3.5 w-3.5' />Share
              </button>
            </div>
          </header>

          <div className='space-y-6 p-8'>
            <div>
              <h1 className='text-[28px] font-bold tracking-[-0.03em]'>Performance Dashboard</h1>
              <p className='mt-1 text-[13px] text-[var(--app-text-secondary)]'>Real-time competitive performance snapshot and sensitivity insights.</p>
            </div>

            <div className='grid grid-cols-2 gap-6'>
              <Card className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <SectionLabel>Current Snapshot</SectionLabel>
                    <div className='mt-1 flex items-baseline gap-3'>
                      <span className='text-[40px] font-bold tracking-[-0.03em]'>71</span>
                      <span className='text-[15px] font-medium text-[var(--app-text-muted)]'>/ 100</span>
                    </div>
                  <Badge>Diamond tier</Badge>
                </div>
                <p className='mt-3 text-[13px] leading-relaxed text-[var(--app-text-secondary)]'>
                  A high-confidence snapshot of where your current sensitivity is helping and where it is still costing precision.
                </p>
                <div className='mt-5 grid grid-cols-5 gap-3'>
                  {metrics.map((metric) => (
                    <div key={metric.id} className='rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] p-4'>
                      <div className='flex items-center justify-between'>
                        <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--app-accent-soft)] text-[var(--app-accent)]'>{metric.icon}</div>
                        <span className={'text-[10px] font-bold uppercase tracking-wider ' + (metric.trend === 'up' ? 'text-emerald-400' : metric.trend === 'down' ? 'text-rose-400' : 'text-[var(--app-text-muted)]')}>{metric.trend}</span>
                      </div>
                      <div className='mt-3 text-[22px] font-bold tracking-[-0.02em]'>{metric.value}</div>
                      <div className='mt-0.5 text-[11px] text-[var(--app-text-muted)]'>{metric.label}</div>
                      <div className='mt-2'>{metric.sparkline && <Sparkline data={metric.sparkline} color={metric.trend === 'down' ? '#F43F5E' : metric.trend === 'up' ? '#10B981' : '#64748B'} />}</div>
                  ))}
                </div>
              </Card>

              <Card className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <SectionLabel>Sensitivity Engine</SectionLabel>
                    <SectionTitle>Live tuning panel</SectionTitle>
                  </div>
                  <Monitor className='h-5 w-5 text-[var(--app-accent)]' />
                </div>
                <div className='mt-5 grid grid-cols-3 gap-3'>
                  {[
                    ['Current', sensitivityData.current.toFixed(2)],
                    ['Delta', sensitivityData.change + '%'],
                    ['Recommended', sensitivityData.recommended.toFixed(2)],
                  ].map(([label, value]) => (
                    <div key={label} className='rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] p-4 text-center'>
                      <div className='text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--app-text-muted)]'>{label}</div>
                      <div className='mt-1 text-[24px] font-bold tracking-[-0.02em]'>{value}</div>
                  ))}
                </div>
                <div className='mt-5 space-y-3'>
                  <div className='flex items-center justify-between text-[13px]'>
                    <span className='text-[var(--app-text-secondary)]'>Optimal range</span>
                    <span className='font-mono font-medium text-[var(--app-text-primary)]'>{sensitivityData.min.toFixed(2)} - {sensitivityData.max.toFixed(2)}</span>
                  </div>
                  <div className='relative h-2 rounded-full bg-[var(--app-surface-soft)]'>
                    <div className='absolute inset-y-0 left-0 w-[66%] rounded-full bg-gradient-to-r from-[var(--app-accent)] to-[var(--app-accent-2)]' />
                    <div className='absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-[3px] border-[var(--app-bg)] bg-[var(--app-accent)] shadow-lg' style={{ left: 'calc(' + (((sensitivitySlider - 0.1) / 0.9) * 100) + '% - 10px)' }} />
                    <input type='range' min='0.1' max='1' step='0.01' value={sensitivitySlider} onChange={(e) => setSensitivitySlider(parseFloat(e.target.value))} className='absolute inset-0 h-full w-full cursor-pointer opacity-0' />
                  </div>
                <button onClick={handleRecalibrate} disabled={isRecalibrating} className='mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--app-accent)] py-3 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50'>
                  {isRecalibrating ? <RefreshCw className='h-4 w-4 animate-spin' /> : <Zap className='h-4 w-4' />}
                  {isRecalibrating ? 'Analyzing sensitivity...' : 'Recalibrate'}
                </button>
              </Card>
            </div>

            <div className='grid grid-cols-2 gap-6'>
              <Card className='p-6'>
                <SectionLabel>AI Coach</SectionLabel>
                <SectionTitle>High-priority guidance</SectionTitle>
                <div className='mt-4 space-y-3'>
                  {coachTips.map((tip) => (
                    <div key={tip.id} className='flex items-start gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] p-4'>
                      <div className={'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ' +
                        (tip.priority === 'high' ? 'bg-rose-500/10 text-rose-400' : tip.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400')}>{tip.id}</div>
                      <p className='text-[13px] leading-relaxed text-[var(--app-text-secondary)]'>{tip.text}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className='space-y-6'>
                <Card className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <SectionLabel>Training Videos</SectionLabel>
                      <SectionTitle>Recommended playlist</SectionTitle>
                    </div>
                    <Video className='h-5 w-5 text-[var(--app-accent)]' />
                  </div>
                  <div className='mt-4 space-y-3'>
                    {trainingVideos.map((video) => (
                      <div key={video.id} className='flex items-center justify-between rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] p-4'>
                        <div>
                          <div className='text-[13px] font-semibold text-[var(--app-text-primary)]'>{video.title}</div>
                          <div className='mt-0.5 text-[12px] text-[var(--app-text-secondary)]'>{video.creator} &middot; {video.duration} &middot; {video.views} views</div>
                        <Badge>{video.category}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <SectionLabel>Sensitivity History</SectionLabel>
                      <SectionTitle>Performance trendline</SectionTitle>
                    </div>
                    <Trophy className='h-5 w-5 text-[var(--app-accent)]' />
                  </div>
                  <div className='mt-5 flex h-40 items-end gap-4'>
                    {sensitivityHistory.map((point) => (
                      <div key={point.date} className='flex flex-1 flex-col items-center gap-2'>
                        <div className='w-full rounded-t-lg bg-gradient-to-t from-[var(--app-accent)]/20 to-[var(--app-accent-2)]/40' style={{ height: point.score + '%' }} />
                        <div className='text-[11px] font-medium text-[var(--app-text-muted)]'>{point.date}</div>
                    ))}
                  </div>
                </Card>
              </div>
          </div>
        </main>
      </div>
  );
}
`;

fs.writeFileSync('app/dashboard/page.tsx', content, 'utf8');
console.log('Dashboard written successfully');
`;

// Execute it
eval(content.replace(/^const fs = require\('fs'\);\n/, '').replace(/fs\.writeFileSync.*/, '').replace(/console.*/, ''));
