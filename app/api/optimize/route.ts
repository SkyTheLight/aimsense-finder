import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface FullRequest {
  dpi: number;
  inGameSens: number;
  playstyle: 'wrist' | 'arm' | 'hybrid';
  mouseGrip: 'fingertip' | 'claw' | 'palm';
  game: string;
  accuracy?: number;
  speed?: number;
  tracking: number;
  flickPrecision?: number;
  consistency?: number;
  previousSession?: {
    tracking: number;
    flickPrecision?: number;
    consistency?: number;
    sens?: number;
  };
}

interface OptimizationOutput {
  performanceSummary: {
    score: number;
    rank: string;
    confidenceLevel: number;
    trend: string;
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
  feedback: {
    conditionalUp: string;
    conditionalDown: string;
  };
  trainingPlan: {
    focus: string;
    drills: string[];
  };
}

function calculateWeightedScore(data: FullRequest): number {
  const acc = data.accuracy || 60;
  const spd = data.speed || 60;
  const trk = data.tracking;
  const flick = data.flickPrecision || 60;
  const cons = data.consistency || 60;
  
  return Math.round(acc * 0.30 + cons * 0.25 + trk * 0.20 + flick * 0.15 + spd * 0.10);
}

function getRankTier(score: number): string {
  if (score >= 90) return 'Diamond';
  if (score >= 80) return 'Platinum';
  if (score >= 70) return 'Gold';
  if (score >= 60) return 'Silver';
  if (score >= 50) return 'Bronze';
  return 'Iron';
}

function analyzeAimStyle(data: FullRequest): { classification: string; strength: string; weakness: string } {
  const { tracking, flickPrecision, playstyle } = data;
  const flick = flickPrecision || 60;
  
  if (flick > tracking + 15) return { classification: 'Flick-Heavy', strength: 'Flick precision', weakness: 'Tracking flow' };
  if (tracking > flick + 15) return { classification: 'Tracking-Focused', strength: 'Smooth tracking', weakness: 'Flick accuracy' };
  if (playstyle === 'arm') return { classification: 'Arm-Dominant', strength: 'Large movements', weakness: 'Fine adjustments' };
  if (playstyle === 'wrist') return { classification: 'Wrist-Precision', strength: 'Fine control', weakness: 'Speed' };
  
  return { classification: 'Hybrid', strength: 'Balanced', weakness: 'Peak intensity' };
}

function calculateSensAdjustment(data: FullRequest): { recommended: number; range: { min: number; max: number }; adjustment: number; reasoning: string[] } {
  const { dpi, inGameSens, playstyle, mouseGrip, tracking, flickPrecision, consistency, previousSession } = data;
  const flick = flickPrecision || 60;
  const cons = consistency || 60;
  
  let adjustment = 0;
  const reasoning: string[] = [];
  
  if (cons < 50) {
    adjustment -= 3;
    reasoning.push('Low consistency (' + cons + ') → -3% for stability');
  }
  
  if (flick < 50 && playstyle === 'wrist') {
    adjustment -= mouseGrip === 'claw' ? 5 : 3;
    reasoning.push('Wrist + weak flick (' + flick + ') → reduce for control');
  }
  
  if (data.accuracy && data.accuracy < 55 && data.speed && data.speed > 80) {
    adjustment -= 5;
    reasoning.push('Fast but inaccurate → -5% for precision');
  }
  
  if (previousSession?.sens && previousSession?.tracking) {
    const trendDiff = tracking - previousSession.tracking;
    if (trendDiff > 10) {
      adjustment += 2;
      reasoning.push('Tracking improved +' + trendDiff + ' → +2% to challenge');
    } else if (trendDiff < -10) {
      adjustment -= 3;
      reasoning.push('Tracking dropped -' + Math.abs(trendDiff) + ' → -3% for recovery');
    }
  }
  
  const recommended = Math.round(inGameSens * (1 + adjustment / 100) * 1000) / 1000;
  const range = {
    min: Math.round((recommended * 0.92) * 1000) / 1000,
    max: Math.round((recommended * 1.08) * 1000) / 1000
  };
  
  if (reasoning.length === 0) {
    reasoning.push('Current sensitivity optimal');
  }
  
  return { recommended, range, adjustment: Math.round(adjustment * 10) / 10, reasoning };
}

function getTrend(data: FullRequest): string {
  const prev = data.previousSession;
  if (!prev?.tracking) return 'Stable';
  
  const currentScore = calculateWeightedScore(data);
  const prevScore = prev.tracking + (prev.flickPrecision || 60) + (prev.consistency || 60);
  const diff = currentScore - prevScore;
  
  if (diff > 15) return 'Improving';
  if (diff < -15) return 'Declining';
  return 'Stable';
}

function generateTrainingPlan(data: FullRequest): { focus: string; drills: string[] } {
  const { tracking, flickPrecision } = data;
  const flick = flickPrecision || 60;
  const drills: string[] = [];
  let focus = 'Aim maintenance';
  
  if (tracking < 60) {
    focus = 'Tracking improvement';
    drills.push('Smooth Sphere - 10 min daily');
    drills.push('Strafe Track - focus on fluid movement');
    drills.push('Tracker Pre - reaction tracking');
  } else if (flick < 60) {
    focus = 'Flick precision';
    drills.push('Reflexshot - headshot flicks');
    drills.push('Tile Frenzy - 360 flicks');
    drills.push('Microshot - micro-adjustments');
  } else {
    drills.push('Gridshot Ultimate - consistency');
    drills.push('Voltaic Medium - all skills');
  }
  
  drills.push('Film sessions for review');
  drills.push('Re-test after 2 weeks');
  
  return { focus, drills };
}

async function generateAIInsights(data: FullRequest, style: { classification: string; strength: string; weakness: string }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const { dpi, inGameSens, tracking, flickPrecision, consistency, playstyle, mouseGrip } = data;
  const flick = flickPrecision || 60;
  const cons = consistency || 60;
  const currentEDPI = dpi * inGameSens;

  const prompt = `You are TrueSens, elite FPS Performance Analyst.

DATA:
- DPI ${dpi} | Sens ${inGameSens} | eDPI ${currentEDPI}
- Style: ${playstyle} | Grip: ${mouseGrip}
- Scores: T${tracking} F${flick} C${cons}
- Aim Type: ${style.classification} (Strength: ${style.strength})

ANALYZE:
1. Why is ${tracking < 60 ? 'tracking' : flick < 60 ? 'flicking' : 'consistency'} their weakest link?
2. How does ${playstyle}+${mouseGrip} affect their problem?
3. What hidden pattern do their scores reveal?

OUTPUT (JSON):
{
  "hiddenInsight": "1 sentence on their pattern",
  "specificFix": "1 specific drill recommendation",
  "causeAnalysis": "Why this is happening"
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

    const responseData = await response.json();
    const msg = responseData.output?.find((o: { type: string }) => o.type === 'message');
    const content = msg?.content?.[0]?.text?.trim() || '';
    
    if (content) return JSON.parse(content);
  } catch {
    return null;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const data: FullRequest = await request.json();
    
    const score = calculateWeightedScore(data);
    const rank = getRankTier(score);
    const aimStyle = analyzeAimStyle(data);
    const sensOpt = calculateSensAdjustment(data);
    const trend = getTrend(data);
    const training = generateTrainingPlan(data);
    const aiInsights = await generateAIInsights(data, aimStyle);
    
    const output: OptimizationOutput = {
      performanceSummary: {
        score,
        rank,
        confidenceLevel: aiInsights ? 0.85 : 0.65,
        trend
      },
      aimAnalysis: {
        issues: aiInsights?.causeAnalysis ? [aiInsights.causeAnalysis] : [],
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
      feedback: {
        conditionalUp: aiInsights?.specificFix || 'If scores improve, increase by 2%',
        conditionalDown: 'If accuracy drops, reduce by 3%'
      },
      trainingPlan: {
        focus: training.focus,
        drills: training.drills
      }
    };

    return NextResponse.json({ ...output, fallback: !aiInsights });
  } catch (error) {
    console.error('Optimization error:', error);
    return NextResponse.json({ error: 'Optimization failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST full performance data for optimization',
    required: ['dpi', 'inGameSens', 'playstyle', 'mouseGrip', 'game', 'tracking'],
    optional: ['accuracy', 'speed', 'flickPrecision', 'consistency', 'previousSession']
  });
}