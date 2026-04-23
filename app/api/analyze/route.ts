import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface PerformanceMetrics {
  accuracy: number;
  speed: number;
  tracking: number;
  flickPrecision: number;
  consistency: number;
}

interface FullAnalysisRequest {
  dpi: number;
  inGameSens: number;
  playstyle: 'wrist' | 'arm' | 'hybrid';
  mouseGrip: 'fingertip' | 'claw' | 'palm';
  game: string;
  metrics: PerformanceMetrics;
  previousMetrics?: PerformanceMetrics;
  previousSens?: number;
}

interface AnalysisOutput {
  performanceSummary: {
    score: number;
    rank: string;
    confidenceLevel: number;
    trend: 'Improving' | 'Stable' | 'Declining';
  };
  aimAnalysis: {
    issues: string[];
    classification: string;
    coreStrength: string;
    coreWeakness: string;
  };
  sensitivityOptimization: {
    recommendedSens: number;
    optimalRange: { min: number; max: number };
    adjustment: string;
    percentageChange: number;
    reasoning: string[];
  };
  adaptiveFeedback: {
    conditionalUp: string;
    conditionalDown: string;
  };
  nextTestInstructions: {
    focus: string;
    steps: string[];
  };
}

function calculateWeightedScore(metrics: PerformanceMetrics): number {
  return Math.round(
    metrics.accuracy * 0.30 +
    metrics.consistency * 0.25 +
    metrics.tracking * 0.20 +
    metrics.flickPrecision * 0.15 +
    metrics.speed * 0.10
  );
}

function getRankTier(score: number): string {
  if (score >= 90) return 'Diamond';
  if (score >= 80) return 'Platinum';
  if (score >= 70) return 'Gold';
  if (score >= 60) return 'Silver';
  if (score >= 50) return 'Bronze';
  return 'Iron';
}

function getConfidence(metrics: PerformanceMetrics, previousMetrics?: PerformanceMetrics): number {
  if (!previousMetrics) return 0.5;
  
  const currentVar = Math.sqrt(
    Math.pow(metrics.accuracy - 70, 2) +
    Math.pow(metrics.consistency - 70, 2) +
    Math.pow(metrics.tracking - 70, 2) +
    Math.pow(metrics.flickPrecision - 70, 2) +
    Math.pow(metrics.speed - 70, 2)
  ) / 5;
  
  const prevVar = Math.sqrt(
    Math.pow(previousMetrics.accuracy - 70, 2) +
    Math.pow(previousMetrics.consistency - 70, 2) +
    Math.pow(previousMetrics.tracking - 70, 2) +
    Math.pow(previousMetrics.flickPrecision - 70, 2) +
    Math.pow(previousMetrics.speed - 70, 2)
  ) / 5;
  
  const consistencyBonus = prevVar < currentVar ? 0.1 : 0;
  return Math.min(0.95, 0.5 + consistencyBonus);
}

function getTrend(current: PerformanceMetrics, previous?: PerformanceMetrics): 'Improving' | 'Stable' | 'Declining' {
  if (!previous) return 'Stable';
  
  const currentScore = calculateWeightedScore(current);
  const previousScore = calculateWeightedScore(previous);
  const diff = currentScore - previousScore;
  
  if (diff > 3) return 'Improving';
  if (diff < -3) return 'Declining';
  return 'Stable';
}

function analyzeAimStyle(metrics: PerformanceMetrics): { classification: string; strength: string; weakness: string } {
  const { accuracy, speed, tracking, flickPrecision, consistency } = metrics;
  
  if (flickPrecision > tracking + 15 && flickPrecision > accuracy + 10) {
    return { classification: 'Flick-Heavy', strength: 'Flick precision', weakness: 'Tracking flow' };
  }
  if (tracking > flickPrecision + 15 && tracking > accuracy + 10) {
    return { classification: 'Tracking-Focused', strength: 'Smooth tracking', weakness: 'Flick accuracy' };
  }
  if (accuracy > 75 && consistency > 70) {
    return { classification: 'Precision-Based', strength: 'Consistent accuracy', weakness: 'Speed' };
  }
  if (speed > accuracy + 10 && speed > tracking + 5) {
    return { classification: 'Speed-First', strength: 'Quick reactions', weakness: 'Accuracy under pressure' };
  }
  
  return { classification: 'Hybrid', strength: 'Balanced performance', weakness: 'Peak intensity' };
}

function detectIssues(metrics: PerformanceMetrics, playstyle: string): string[] {
  const issues: string[] = [];
  
  if (metrics.flickPrecision < 50 && playstyle === 'wrist') {
    issues.push('Wrist tension causing micro-flicks to miss');
  }
  if (metrics.tracking > metrics.flickPrecision + 20) {
    issues.push('Over-reliance on tracking, flicking underdeveloped');
  }
  if (metrics.consistency < 50) {
    issues.push('Performance variance indicates fatigue or routine issues');
  }
  if (metrics.speed > 80 && metrics.accuracy < 60) {
    issues.push('Speed without accuracy - sensitivity too high or rushed decisions');
  }
  if (metrics.flickPrecision > 80 && metrics.tracking < 50) {
    issues.push('Flick specialist with tracking weakness - target switching gaps');
  }
  
  return issues.length > 0 ? issues : ['No critical issues detected'];
}

function calculateOptimalSens(
  dpi: number,
  currentSens: number,
  metrics: PerformanceMetrics,
  playstyle: string,
  grip: string,
  previousSens?: number,
  previousMetrics?: PerformanceMetrics
): { recommended: number; range: { min: number; max: number }; adjustment: number; reasoning: string[] } {
  
  const reasoning: string[] = [];
  let adjustment = 0;
  let recommended = currentSens;
  
  const baseAdjustment = (previousSens && previousMetrics) ?
    calculateRealtimeAdjustment(currentSens, previousSens, metrics, previousMetrics) : 0;
  
  if (metrics.consistency < 50) {
    const reduce = 0.03;
    recommended = currentSens * (1 - reduce);
    adjustment = -reduce * 100;
    reasoning.push('Low consistency (' + metrics.consistency + ') → reducing sensitivity for stability');
  }
  
  if (metrics.flickPrecision < 50 && playstyle === 'wrist') {
    const reduce = grip === 'claw' ? 0.05 : 0.03;
    recommended = recommended * (1 - reduce);
    adjustment += -reduce * 100;
    reasoning.push('Wrist + low flick precision → slight reduction for control');
  }
  
  if (metrics.speed > 85 && metrics.accuracy < 65) {
    const reduce = 0.05;
    recommended = recommended * (1 - reduce);
    adjustment += -reduce * 100;
    reasoning.push('High speed, low accuracy → sensitivity reducing for controlled flicks');
  }
  
  if (previousSens && baseAdjustment !== 0) {
    adjustment += baseAdjustment * 100;
    recommended = previousSens * (1 + baseAdjustment);
    reasoning.push('Trend-based adjustment: ' + (baseAdjustment * 100 > 0 ? '+' : '') + (baseAdjustment * 100).toFixed(1) + '% from previous session');
  }
  
  recommended = Math.round(recommended * 1000) / 1000;
  
  const range = {
    min: Math.round((recommended * 0.92) * 1000) / 1000,
    max: Math.round((recommended * 1.08) * 1000) / 1000
  };
  
  if (reasoning.length === 0) {
    reasoning.push('Current sensitivity optimal - maintain for consistency');
  }
  
  return {
    recommended,
    range,
    adjustment: Math.round(adjustment * 10) / 10,
    reasoning
  };
}

function calculateRealtimeAdjustment(
  currentSens: number,
  previousSens: number,
  currentMetrics: PerformanceMetrics,
  previousMetrics: PerformanceMetrics
): number {
  const currentScore = calculateWeightedScore(currentMetrics);
  const previousScore = calculateWeightedScore(previousMetrics);
  const scoreDiff = currentScore - previousScore;
  
  if (currentMetrics.accuracy < previousMetrics.accuracy - 5) {
    return -0.03;
  }
  if (currentMetrics.consistency < previousMetrics.consistency - 5) {
    return -0.02;
  }
  if (currentMetrics.accuracy > previousMetrics.accuracy + 5 && currentMetrics.speed < previousMetrics.speed - 5) {
    return 0.03;
  }
  if (scoreDiff > 5) {
    return previousSens > currentSens ? 0.02 : -0.02;
  }
  
  return 0;
}

function generateAdaptiveFeedback(metrics: PerformanceMetrics, recommendation: number): { up: string; down: string } {
  if (metrics.flickPrecision < 60) {
    return {
      up: 'If flick accuracy improves to 65+, increase by 2-3%',
      down: 'If still missing right-side targets, reduce by 3%'
    };
  }
  if (metrics.tracking < 60) {
    return {
      up: 'If tracking smoothness improves, increase by 2%',
      down: 'If target escapes frequently, reduce by 2%'
    };
  }
  if (metrics.consistency < 70) {
    return {
      up: 'Focus on stability - no increase until consistency hits 75+',
      down: 'If sessions vary more than 10 points, reduce by 5% and establish routine'
    };
  }
  
  return {
    up: 'If all metrics hold for 5+ sessions, increase by 2% for progression',
    down: 'If any metric drops below 60, revert to previous sensitivity'
  };
}

function generateTestInstructions(metrics: PerformanceMetrics, classification: string): { focus: string; steps: string[] } {
  let focus = 'General aim maintenance';
  const steps: string[] = [];
  
  if (metrics.flickPrecision < 65) {
    focus = 'Flick accuracy training';
    steps.push('1. Start with 10 min Reflexshot (headshots only)');
    steps.push('2. Focus on perpendicular flicks - 45° and 90° angles');
    steps.push('3. Film 3 sessions and compare flick hit rate');
    steps.push('4. Re-test after 1 week');
  } else if (metrics.tracking < 65) {
    focus = 'Smooth tracking training';
    steps.push('1. 10 min Smooth Sphere - maintain crosshair on target');
    steps.push('2. Focus on fluid movement, not stopping');
    steps.push('3. Gradually increase target speed');
    steps.push('4. Test after 5 sessions');
  } else if (metrics.consistency < 75) {
    focus = 'Consistency building';
    steps.push('1. Same warmup routine for 2 weeks');
    steps.push('2. Track daily scores - aim for variance under 10');
    steps.push('3. Identify peak performance time');
    steps.push('4. Schedule ranked around peak');
  } else {
    steps.push('1. Maintain current routine');
    steps.push('2. Re-test monthly for regression');
    steps.push('3. Film clutch situations for review');
    steps.push('4. Adjust based on ranked performance');
  }
  
  return { focus, steps };
}

async function generateAIInsights(request: FullAnalysisRequest): Promise<Partial<AnalysisOutput> | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const { dpi, inGameSens, playstyle, mouseGrip, metrics } = request;
  const currentEDPI = dpi * inGameSens;
  const score = calculateWeightedScore(metrics);
  const aimStyle = analyzeAimStyle(metrics);
  const issues = detectIssues(metrics, playstyle);

  const prompt = `You are TrueSens, an elite FPS Performance Analytics Engine. Provide deep insights.

PLAYER DATA:
- DPI: ${dpi} | Sens: ${inGameSens} | eDPI: ${currentEDPI}
- Playstyle: ${playstyle} | Grip: ${mouseGrip}
- Performance: Acc${metrics.accuracy} Spd${metrics.speed} Trk${metrics.tracking} Flick${metrics.flickPrecision} Cons${metrics.consistency}
- Overall Score: ${score} | Rank: ${getRankTier(score)}
- Aim Style: ${aimStyle.classification}
- Issues: ${issues.join(', ')}

ANALYSIS REQUIREMENTS:
1. Root cause analysis of their lowest metric
2. How ${playstyle} + ${mouseGrip} affects their performance
3. Sensitivity correlation with their score pattern
4. One hidden pattern they don\'t see

OUTPUT (JSON):
{
  "deepInsight": "1-2 sentences on their core pattern",
  "specificAdvice": "One unique recommendation based on their data",
  "hiddenPattern": "Something their scores reveal but they don\'t realize"
}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        input: prompt,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const msg = data.output?.find((o: { type: string }) => o.type === 'message');
    const content = msg?.content?.[0]?.text?.trim() || '';
    
    if (content) {
      return JSON.parse(content);
    }
  } catch {
    return null;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body: FullAnalysisRequest = await request.json();
    const { dpi, inGameSens, playstyle, mouseGrip, metrics, previousMetrics, previousSens } = body;

    const score = calculateWeightedScore(metrics);
    const rank = getRankTier(score);
    const confidence = getConfidence(metrics, previousMetrics);
    const trend = getTrend(metrics, previousMetrics);
    const aimStyle = analyzeAimStyle(metrics);
    const issues = detectIssues(metrics, playstyle);
    const sensOpt = calculateOptimalSens(dpi, inGameSens, metrics, playstyle, mouseGrip, previousSens, previousMetrics);
    const feedback = generateAdaptiveFeedback(metrics, sensOpt.recommended);
    const testInstructions = generateTestInstructions(metrics, aimStyle.classification);

    const aiInsights = await generateAIInsights(body);

    const output: AnalysisOutput = {
      performanceSummary: {
        score,
        rank,
        confidenceLevel: confidence,
        trend
      },
      aimAnalysis: {
        issues,
        classification: aimStyle.classification,
        coreStrength: aimStyle.strength,
        coreWeakness: aimStyle.weakness
      },
      sensitivityOptimization: {
        recommendedSens: sensOpt.recommended,
        optimalRange: sensOpt.range,
        adjustment: (sensOpt.adjustment > 0 ? '+' : '') + sensOpt.adjustment + '%',
        percentageChange: sensOpt.adjustment,
        reasoning: sensOpt.reasoning
      },
      adaptiveFeedback: {
        conditionalUp: feedback.up,
        conditionalDown: feedback.down
      },
      nextTestInstructions: {
        focus: testInstructions.focus,
        steps: testInstructions.steps
      }
    };

    if (aiInsights) {
      output.aimAnalysis.issues = [...issues, (aiInsights as any).deepInsight || ''];
      output.adaptiveFeedback.conditionalUp = (aiInsights as any).specificAdvice || feedback.up;
    }

    return NextResponse.json({ ...output, fallback: !aiInsights });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST performance data for full analysis',
    required: ['dpi', 'inGameSens', 'playstyle', 'mouseGrip', 'metrics'],
    metrics: ['accuracy', 'speed', 'tracking', 'flickPrecision', 'consistency']
  });
}