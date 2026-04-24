import type { AnalysisResult } from './analysis';

interface LearningInput {
  user: {
    grip: string | null;
    sens: number;
    posture: string | null;
  };
  analysis: AnalysisResult;
  history: {
    sessions: number;
    avgScore: number;
    trend: 'improving' | 'stable' | 'declining';
    sensChanges: number[];
  } | null;
}

interface LearningOutput {
  playerModel: string;
  behaviorPatterns: string[];
  ruleAdjustments: { type: string; change: string; reason: string }[];
  nextSessionStrategy: string;
}

export function generateLearningSystem(input: LearningInput): LearningOutput {
  const { analysis, history, user } = input;
  const { consistency, sensitivity, issues } = analysis;

  const playerModel = derivePlayerModel(user,analysis,history);
  const behaviorPatterns = deriveBehaviorPatterns(history,sensitivity,issues);
  const ruleAdjustments = deriveRuleAdjustments(history,sensitivity,consistency,issues);
  const nextSessionStrategy = deriveNextStrategy(history,consistency,issues);

  return { playerModel, behaviorPatterns, ruleAdjustments, nextSessionStrategy };
}

function derivePlayerModel(user: any, analysis: AnalysisResult, history: any): string {
  const sessionCount = history?.sessions || 0;
  const score = analysis.consistency.score;
  const sensChange = analysis.sensitivity.change;
  if (sessionCount < 3) return 'New player - baseline forming';
  if (score >= 75) return 'High-consistency player - stable foundation';
  if (score >= 50) return 'Developing player - building consistency';
  if (sensChange > 10) return 'Sens-chaser - over-adjusting frequently';
  return 'Struggling player - foundation unstable';
}

function deriveBehaviorPatterns(history: any, sensitivity: any, issues: string[]): string[] {
  const patterns: string[] = [];
  if (!history) return ['No historical data - establishing baseline'];
  const sensHistory = history.sensChanges || [];
  if (sensHistory.filter((c: number) => Math.abs(c) > 10).length >= 2) {
    patterns.push('Sens volatility - frequent large changes detected');
  }
  if (history.trend === 'declining' && issues.includes('shaky_aim')) {
    patterns.push('Posture-fatigue correlation - late-session drop');
  }
  if (issues.includes('overflicking') && sensitivity.change < 0) {
    patterns.push('Overflick-reduce cycle - sens adjustment working');
  }
  if (issues.includes('overflicking') && sensitivity.change === 0) {
    patterns.push('Overflicking unaddressed - no sensitivity change applied');
  }
  if (history.trend === 'stable' && issues.length === 0) {
    patterns.push('Stable baseline - maintaining performance');
  }
  return patterns.length ? patterns : ['No clear patterns detected'];
}

function deriveRuleAdjustments(history: any, sensitivity: any, consistency: any, issues: string[]): { type: string; change: string; reason: string }[] {
  const adjustments: { type: string; change: string; reason: string }[] = [];
  const sessionCount = history?.sessions || 0;
  
  if (sessionCount >= 5 && history?.trend === 'stable') {
    adjustments.push({ type: 'stability', change: 'Increase stability phase', reason: 'Consistent performance - lock settings' });
  }
  if (sessionCount >= 3 && Math.abs(sensitivity.change) > 15) {
    adjustments.push({ type: 'aggressiveness', change: 'Reduce sens change magnitude', reason: 'Large changes causing instability' });
  }
  if (issues.includes('shaky_aim') || issues.includes('poor_micro')) {
    adjustments.push({ type: 'warmup', change: 'Increase warm-up importance', reason: 'Physical factors detected' });
  }
  if (consistency.score < 50 && sessionCount < 3) {
    adjustments.push({ type: 'priority', change: 'Prioritize consistency over sens', reason: 'Low baseline - foundation first' });
  }
  if (sensitivity.change === 0 && issues.length > 0) {
    adjustments.push({ type: 'analysis', change: 'Flag non-sens fixes', reason: 'Issues detected but no sens change' });
  }
  if (adjustments.length === 0) {
    adjustments.push({ type: 'baseline', change: 'Continue current approach', reason: 'System behavior optimal' });
  }
  return adjustments;
}

function deriveNextStrategy(history: any, consistency: any, issues: string[]): string {
  const sessionCount = history?.sessions || 0;
  if (sessionCount < 3) return 'Collect more session data - focus on baseline establishment';
  if (history?.trend === 'improving') return 'Lock sensitivity, maintain grip and posture for 2 weeks';
  if (history?.trend === 'declining') return 'Reduce session length, fix posture/warmup before next session';
  if (consistency.score < 50) return 'Establish consistent warm-up before sens adjustments';
  if (issues.includes('overflicking') && history?.trend === 'stable') return 'Test smaller sens adjustment - previous too aggressive';
  return 'Maintain current settings, continue tracking';
}

export function formatLearning(output: LearningOutput): string {
  return `🧠 PLAYER MODEL
${output.playerModel}

📉 BEHAVIOR PATTERNS
${output.behaviorPatterns.map(p => `- ${p}`).join('\n')}

⚙️ RULE ADJUSTMENTS
${output.ruleAdjustments.map(r => `${r.type}: ${r.change} (${r.reason})`).join('\n')}

🔁 NEXT SESSION
${output.nextSessionStrategy}`;
}