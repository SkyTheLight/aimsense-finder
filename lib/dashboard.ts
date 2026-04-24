import type { UserSetup } from '@/types';
import type { AnalysisResult } from './analysis';

interface DashboardInput {
  user: UserSetup;
  analysis: AnalysisResult;
  history: {
    sessions: Array<{
      date: string;
      sens: number;
      score: number;
      aimType: string;
      issues: string[];
    }>;
    avgScore: number;
    bestScore: number;
    trend: 'improving' | 'stable' | 'declining';
  } | null;
}

interface DashboardOutput {
  performanceTrend: string;
  scoreEvolution: { current: number; average: number; best: number };
  aimEvolution: { current: string; previous: string | null; trend: string };
  issuePattern: { recurring: string[]; frequency: Record<string, number> };
  improvementInsight: string;
}

export function generateDashboard(input: DashboardInput): DashboardOutput {
  const { analysis, history } = input;
  const { aimType, consistency, issues } = analysis;

  const sessions = history?.sessions || [];
  const current = consistency.score;
  const average = history?.avgScore || current;
  const best = history?.bestScore || current;

  const performanceTrend = calculateTrend(sessions.map(s => s.score), history?.trend);
  const aimEvol = calculateAimEvolution(history?.sessions || [], aimType.type);
  const pattern = calculateIssuePattern(sessions);
  const insight = deriveInsight(sessions, current, average, pattern.recurring);

  return {
    performanceTrend,
    scoreEvolution: { current, average, best },
    aimEvolution: aimEvol,
    issuePattern: pattern,
    improvementInsight: insight,
  };
}

function calculateTrend(scores: number[], trend?: string): string {
  if (scores.length < 2) return 'No baseline yet - first session';
  if (trend) return trend === 'improving' ? 'Trending up over recent sessions' : trend === 'declining' ? 'Trending down - check fatigue/posture' : 'Stable - maintaining performance';
  const recent = scores.slice(-3);
  const earlier = scores.slice(0, -3);
  if (!earlier.length) return 'Building baseline';
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
  if (recentAvg > earlierAvg + 5) return 'Improving - positive trend';
  if (recentAvg < earlierAvg - 5) return 'Declining - needs attention';
  return 'Stable - maintaining performance';
}

function calculateAimEvolution(historySessions: { aimType: string }[] | null | undefined, currentAim: string): { current: string; previous: string | null; trend: string } {
  const sessions = historySessions || [];
  const aimTypes = sessions.map(s => s.aimType);
  const previous = aimTypes.length > 1 ? aimTypes[aimTypes.length - 2] : null;
  let trend = 'No change';
  if (previous && previous !== currentAim) trend = `Shifted from ${previous}`;
  return { current: currentAim, previous, trend };
}

function calculateIssuePattern(sessions: { issues: string[] }[]): { recurring: string[]; frequency: Record<string, number> } {
  const all = sessions.flatMap(s => s.issues);
  const freq: Record<string, number> = {};
  all.forEach(i => { freq[i] = (freq[i] || 0) + 1; });
  const recurring = Object.entries(freq).filter(([_, c]) => c >= 2).map(([k]) => k);
  return { recurring, frequency: freq };
}

function deriveInsight(sessions: { score: number; issues: string[] }[], current: number, average: number, recurring: string[]): string {
  if (!sessions.length) return 'Insufficient data for insight';
  if (current > average + 10) return 'Warm-up routine establishing consistent baseline';
  if (current < average - 10) return 'Recent decline - likely fatigue, posture, or session length';
  if (recurring.includes('shaky_aim')) return 'Posture/fatigue is limiting factor - ergonomic check needed';
  if (recurring.includes('overflicking')) return 'Sens too high - overcorrection loop detected';
  return 'Consistent performance - maintain current approach';
}

export function formatDashboard(output: DashboardOutput): string {
  return `📊 PERFORMANCE TREND
${output.performanceTrend}

📊 SCORE EVOLUTION
Current: ${output.scoreEvolution.current}/100
Average: ${output.scoreEvolution.average}/100
Best: ${output.scoreEvolution.best}/100

🎯 AIM EVOLUTION
Current: ${output.aimEvolution.current}
Previous: ${output.aimEvolution.previous || 'N/A'}
Trend: ${output.aimEvolution.trend}

⚠️ ISSUE PATTERN
Recurring: ${output.issuePattern.recurring.join(', ') || 'None'}
Frequency: ${JSON.stringify(output.issuePattern.frequency)}

🔥 IMPROVEMENT INSIGHT
${output.improvementInsight}`;
}