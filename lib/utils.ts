// Date/time utilities with timezone handling
const DEFAULT_TIMEZONE = 'UTC';

export function getUserTimezone(): string {
  if (typeof window === 'undefined') return DEFAULT_TIMEZONE;
  return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE;
}

export function formatDateTime(date: Date | string | number, timezone?: string): string {
  const tz = timezone || getUserTimezone();
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatDate(date: Date | string | number, timezone?: string): string {
  const tz = timezone || getUserTimezone();
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatTime(date: Date | string | number, timezone?: string): string {
  const tz = timezone || getUserTimezone();
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function toISOString(date: Date | string | number): string {
  return new Date(date).toISOString();
}

export function getRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function isToday(date: Date | string | number): boolean {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

export function isThisWeek(date: Date | string | number): boolean {
  const d = new Date(date);
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 86400000);
  return d >= weekAgo && d <= today;
}

export function isThisMonth(date: Date | string | number): boolean {
  const d = new Date(date);
  const today = new Date();
  return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
}

export function getDateRange(period: 'daily' | 'weekly' | 'monthly'): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case 'daily':
      start.setDate(end.getDate() - 1);
      break;
    case 'weekly':
      start.setDate(end.getDate() - 7);
      break;
    case 'monthly':
      start.setMonth(end.getMonth() - 1);
      break;
  }

  return { start, end };
}

export function parseSafely<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string' && value.trim() === '') return fallback;
  return value as T;
}

export function parseNumber(value: unknown, decimals = 2): number {
  const num = parseFloat(String(value));
  if (isNaN(num)) return 0;
  return Number(num.toFixed(decimals));
}

export function formatNumber(num: number, decimals = 2): string {
  if (isNaN(num)) return '0';
  return Number(num.toFixed(decimals)).toLocaleString();
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number(((current - previous) / previous * 100).toFixed(1));
}

export function formatPercentage(num: number): string {
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function normalizeScore(score: number, min = 0, max = 100): number {
  return clamp(Math.round(score), min, max);
}

export function getRankFromScore(score: number): { rank: string; color: string; glow: string } {
  if (score >= 90) return { rank: 'Radiant', color: '#FF6B6B', glow: '0 0 50px rgba(255, 107, 107, 0.5)' };
  if (score >= 80) return { rank: 'Ascendant', color: '#00FF7F', glow: '0 0 40px rgba(0, 255, 127, 0.5)' };
  if (score >= 70) return { rank: 'Diamond', color: '#B9F2FF', glow: '0 0 40px rgba(185, 242, 255, 0.5)' };
  if (score >= 60) return { rank: 'Platinum', color: '#00CED1', glow: '0 0 30px rgba(0, 206, 209, 0.5)' };
  if (score >= 50) return { rank: 'Gold', color: '#FFD700', glow: '0 0 30px rgba(255, 215, 0, 0.5)' };
  if (score >= 40) return { rank: 'Silver', color: '#C0C0C0', glow: '0 0 20px rgba(192, 192, 192, 0.5)' };
  if (score >= 30) return { rank: 'Bronze', color: '#CD7F32', glow: '0 0 20px rgba(205, 127, 50, 0.5)' };
  return { rank: 'Iron', color: '#6B7280', glow: '0 0 20px rgba(107, 114, 128, 0.5)' };
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function generateCSV(data: Record<string, unknown>[], columns: string[]): string {
  const header = columns.join(',');
  const rows = data.map(row => columns.map(col => {
    const value = row[col];
    if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
    return String(value ?? '');
  }).join(','));
  return [header, ...rows].join('\n');
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}