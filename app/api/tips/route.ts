import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface TipContext {
  game: string;
  edpi: number;
  cm360: number;
  label: string;
  tracking: number;
  flicking: number;
  switching: number;
  aimStyle: string;
  mouseGrip: string;
  rank?: string;
  overshooting?: boolean;
  undershooting?: boolean;
  aimIssue?: string;
  previousScores?: {
    tracking: number;
    flicking: number;
    switching: number;
  };
}

async function generateAIAnalysis(body: TipContext) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const scores = { t: body.tracking, f: body.flicking, s: body.switching };
  const keys = Object.keys(scores) as Array<'t' | 'f' | 's'>;
  const weakest = keys.reduce((a, b) => scores[a] < scores[b] ? a : b);
  const strongest = keys.reduce((a, b) => scores[a] > scores[b] ? a : b);
  const gap = scores[strongest] - scores[weakest];
  
  const scoreVariance = Math.sqrt(
    Math.pow(scores.t - (scores.t + scores.f + scores.s) / 3, 2) +
    Math.pow(scores.f - (scores.t + scores.f + scores.s) / 3, 2) +
    Math.pow(scores.s - (scores.t + scores.f + scores.s) / 3, 2)
  ) / 3;
  
  const isImbalanced = gap > 20;
  const hasTrend = body.previousScores && (
    body.previousScores.tracking !== body.tracking ||
    body.previousScores.flicking !== body.flicking ||
    body.previousScores.switching !== body.switching
  );

  const prompt = `ADVANCED FPS ANALYSIS ENGINE. Deep reasoning required.

PLAYER STATE:
- Game: ${body.game} | eDPI: ${body.edpi} | cm/360: ${body.cm360} | Type: ${body.label}
- Style: ${body.aimStyle} | Grip: ${body.mouseGrip} | Rank: ${body.rank || 'unknown'}
- Scores: T${body.tracking} F${body.flicking} S${body.switching} | Variance: ${scoreVariance.toFixed(1)}
- Problem Flag: ${body.overshooting ? 'OVERSHOOTING' : body.undershooting ? 'UNDERSHOOTING' : body.aimIssue || 'NONE'}
${hasTrend ? `- TREND DETECTED: Previous scores differ from current` : ''}

DEEP ANALYSIS:
1. SCORE PATTERN ANALYSIS
   - Weakest: ${weakest} (${scores[weakest]}) - WHY? (habit? tension? visual?)
   - Strongest: ${strongest} (${scores[strongest]}) - Is this their identity or a crutch?
   - Gap: ${gap} - ${isImbalanced ? 'SIGNIFICANT IMBALANCE detected' : 'Relatively balanced'}
   - Variance: ${scoreVariance.toFixed(1)} - ${scoreVariance > 10 ? 'High inconsistency pattern' : 'Consistent performer'}

2. ROOT CAUSE DIAGNOSIS
   ${body.overshooting ? `- OVERSHOOTING: Is this panic flicking, tension, or sens too high?
     * If tension: Grip pressure, adrenaline, or bad pre-aim routine
     * If sens: Check cm/360 - below 30cm is aggressive, above 50cm is controlled` : ''}
   ${body.undershooting ? `- UNDERSHOOTING: Is this hesitation, sens too low, or visual lag?
     * If hesitation: Decision anxiety, confidence, or overthinking
     * If sens: Check if they\'re correcting mid-movement` : ''}
   ${!body.overshooting && !body.undershooting ? `- No flagged issue - but low ${weakest} score suggests underlying ${weakest === 't' ? 'tracking tension' : weaknes === 'f' ? 'flick control issue' : 'switching rhythm problem'}` : ''}

3. SENSITIVITY CORRELATION
   - Current eDPI ${body.edpi} = ${body.cm360}cm/360 (${parseFloat(body.cm360) < 35 ? 'LOW (precision)' : parseFloat(body.cm360) > 50 ? 'HIGH (speed)' : 'MID (balanced)'})
   - Does sensitivity explain their score pattern? Or is it habits/tension?

4. GRIP + STYLE INTERACTION
   - ${body.mouseGrip} grip + ${body.aimStyle} style = 
     ${body.mouseGrip === 'palm' ? 'More surface area = natural tracking, less precise flicks' : ''}
     ${body.mouseGrip === 'claw' ? 'Leverage = faster flicks, potential tension in tracking' : ''}
     ${body.mouseGrip === 'tip' ? 'Precise control, less stability' : ''}

5. HIDDEN INSIGHT DISCOVERY
   ${gap > 15 ? `Score gap of ${gap} suggests specialized play - they\'ve trained one skill intensely while neglecting others` : ''}
   ${scoreVariance > 8 ? `High variance means inconsistent warmup routine or fatigue affecting performance` : ''}
   ${hasTrend ? `Improving ${body.previousScores?.tracking && body.tracking > body.previousScores.tracking ? 'tracking' : body.previousScores?.flicking && body.flicking > body.previousScores.flicking ? 'flicking' : 'switching'} - training is working` : ''}

REASONING ENGINE OUTPUT (FRESH CONSTRUCTION):
{
  "recommendedSensitivity": "X.XX",
  "whyThisFits": "EXPLAIN specific to their eDPI, grip, and score pattern",
  "aiTips": [
    "SPECIFIC drill addressing their ${weakest} gap with clear mechanism",
    "HABIT correction for ${body.overshooting ? 'overshoot' : body.undershooting ? 'undershoot' : 'pattern'} with exact method",
    "ADAPTIVE method for their ${body.aimStyle} style and ${body.mouseGrip} grip combination",
    "CONTEXT-AWARE training considering ${body.rank} rank and game ${body.game}"
  ],
  "improvementPriority": "THE ONE change that unlocks their potential",
  "hiddenInsight": "UNDISCOVERED PATTERN they don\'t see in their own gameplay",
  "confidence": "High/Medium/Experimental",
  "reasoning": "Your 1-sentence analysis of their core issue"
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
    if (!content) return null;

    const parsed = JSON.parse(content);
    if (parsed.aiTips && parsed.recommendedSensitivity) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body: TipContext = await request.json();
    const result = await generateAIAnalysis(body);

    if (result) {
      return NextResponse.json({ ...result, fallback: false });
    }

    const weakest = body.tracking <= body.flicking ? 'tracking' : 'flicking';
    return NextResponse.json({
      recommendedSensitivity: `${(body.edpi / 800).toFixed(2)}`,
      whyThisFits: `Your ${body.label} profile suggests this range.`,
      aiTips: [
        `Target your ${weakest} gap with focused practice.`,
        'Build consistent pre-round routine.',
        'Film sessions to identify patterns.',
        'Train one skill per session.'
      ],
      improvementPriority: weakest,
      hiddenInsight: 'Score gaps reveal habit patterns.',
      confidence: 'Medium',
      fallback: true
    });
  } catch (error) {
    console.error('Tips error:', error);
    return NextResponse.json(
      { recommendedSensitivity: '0.79', aiTips: ['Analyze your gaps.'], improvementPriority: 'consistency', hiddenInsight: 'Consistency beats raw skill.', confidence: 'Experimental' },
      { status: 200 }
    );
  }
}