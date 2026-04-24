import type { UserSetup } from '@/types';
import type { AnalysisResult } from './analysis';

interface CoachInput {
  user: UserSetup;
  analysis: AnalysisResult;
  history: { avgScore: number; trend: 'improving' | 'declining' | 'stable'; sessions: number } | null;
}

interface CoachOutput {
  mainLimitingFactor: string;
  holdingBack: string[];
  sensChange: string;
  mustDoNext: string[];
  fixOrder: { first: string; second: string; optional: string };
  status: 'improving' | 'stable' | 'declining';
  nextStepRule: string;
  feedbackQuestion: string;
}

export function analyzeUserWithData(input: CoachInput): CoachOutput {
  const { user, analysis, history } = input;
  const { aimType, consistency, sensitivity, issues, posture, equipment } = analysis;

  const mainLimitingFactor = deriveMainLimiter(issues, consistency, sensitivity);
  const holdingBack = deriveHoldingBack(issues, user, consistency);
  
  const sensChange = sensitivity.change === 0 
    ? 'Do NOT change sensitivity yet - no clear need'
    : sensitivity.change < 0 
      ? `Decrease sensitivity by ${Math.abs(sensitivity.change)}% - overflicking detected`
      : `Increase sensitivity by ${sensitivity.change}% - underflicking detected`;
  
  const mustDoNext = deriveMustDoNext(issues, sensitivity, consistency);
  const fixOrder = deriveFixOrder(issues, consistency);
  const status = history?.trend || (history?.sessions ? 'stable' : 'improving');
  const nextStepRule = deriveNextStepRule(status, sensitivity);
  const feedbackQuestion = 'After applying this, your aim will feel:\nA. More stable\nB. Too slow\nC. Still overflicking\nD. No change';

  return { mainLimitingFactor, holdingBack, sensChange, mustDoNext, fixOrder, status, nextStepRule, feedbackQuestion };
}

function deriveMainLimiter(issues: string[], consistency: { score: number }, sensitivity: { change: number }): string {
  const hasOver = issues.includes('overflicking');
  const hasUnder = issues.includes('underflicking');
  const hasShake = issues.includes('shaky_aim');
  const hasPoor = issues.includes('poor_micro');
  const lowCons = consistency.score < 50;

  if (lowCons) return 'Low consistency score - foundation too unstable for sensitivity changes';
  if (hasOver && hasShake) return 'High sensitivity + arm instability causing overcorrection';
  if (hasOver) return `Sensitivity too high causing overshooting on flick shots`;
  if (hasShake) return 'Unsteady aim from fatigue or poor posture';
  if (hasPoor) return 'Poor micro-adjustments from sensitivity mismatch';
  return 'No major limiter detected - focus on stability';
}

function deriveHoldingBack(issues: string[], user: UserSetup, consistency: { score: number }): string[] {
  const points: string[] = [];
  if (issues.includes('overflicking')) points.push('Overshooting - overcorrecting resets tracking mid-duel');
  if (issues.includes('underflicking')) points.push('Under-shooting - slow snap reactions');
  if (issues.includes('shaky_aim')) points.push('Unsteady aim - micro-drift from targets');
  if (!user.warmup) points.push('No warm-up routine - inconsistent starting point');
  if (consistency.score < 50) points.push('Low baseline - cannot measure improvement');
  return points.slice(0, 3);
}

function deriveMustDoNext(issues: string[], sensitivity: { change: number }, consistency: { score: number }): string[] {
  const actions: string[] = [];
  if (issues.includes('overflicking')) {
    if (sensitivity.change !== 0) actions.push(`Apply sensitivity ${sensitivity.change > 0 ? 'increase' : 'decrease'} of ${sensitivity.change}%`);
    actions.push('Practice stop-and-go flick drills for 10 min');
  }
  if (issues.includes('shaky_aim')) {
    actions.push('Check posture - arm height, chair position');
    actions.push('Take breaks every 45 min');
  }
  if (consistency.score < 50) {
    actions.push('Lock sensitivity for 5+ games - establish baseline');
    actions.push('Establish consistent warm-up routine');
  }
  actions.push('Play 3 deathmatches focusing only on stability');
  return actions.slice(0, 5);
}

function deriveFixOrder(issues: string[], consistency: { score: number }): { first: string; second: string; optional: string } {
  if (consistency.score < 50) {
    return {
      first: 'Establish consistent warm-up routine',
      second: 'Lock sensitivity for at least 5 games',
      optional: 'Then consider sensitivity adjustment',
    };
  }
  if (issues.includes('shaky_aim') || issues.includes('poor_micro')) {
    return {
      first: 'Fix posture and grip tension',
      second: 'Apply sensitivity change',
      optional: 'Track improvement over sessions',
    };
  }
  return {
    first: issues.includes('overflicking') ? 'Apply sensitivity decrease' : 'Apply sensitivity change',
    second: 'Track for 3-5 games',
    optional: 'Fine-tune if needed',
  };
}

function deriveNextStepRule(status: string, sensitivity: { change: number }): string {
  if (status === 'improving') return 'Stabilize settings - lock sens and grip for 2 weeks';
  if (status === 'declining') return sensitivity.change !== 0 ? 'Reduce change magnitude + fix posture/warmup' : 'Fix foundation before more changes';
  return 'Re-evaluate baseline + grip + posture';
}

export function convertAnalysisToCoachInput(setup: UserSetup, analysis: AnalysisResult, history: CoachInput['history'] = null): CoachInput {
  return { user: setup, analysis, history };
}

export function formatCoachOutput(output: CoachOutput): string {
  return `1. MAIN LIMITING FACTOR
${output.mainLimitingFactor}

2. WHAT IS HOLDING YOU BACK
${output.holdingBack.map(h => `- ${h}`).join('\n')}

3. SENS CHANGE
${output.sensChange}

4. MUST DO NEXT
${output.mustDoNext.map(m => `- ${m}`).join('\n')}

5. FIX ORDER
1st: ${output.fixOrder.first}
2nd: ${output.fixOrder.second}
3rd: ${output.fixOrder.optional}

6. STATUS
${output.status}

7. NEXT STEP RULE
${output.nextStepRule}

8. FEEDBACK QUESTION
${output.feedbackQuestion}`;
}