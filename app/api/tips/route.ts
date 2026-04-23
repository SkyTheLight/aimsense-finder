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
}

const GAME_NAMES: Record<string, string> = {
  valorant: 'Valorant',
  cs2: 'Counter-Strike 2',
};

async function generateAIAnalysis(body: TipContext) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const { game, edpi, cm360, label, tracking, flicking, switching, aimStyle, mouseGrip, rank, overshooting, undershooting, aimIssue } = body;
  const gameName = GAME_NAMES[game] || 'FPS';
  const weakest = tracking <= flicking && tracking <= switching ? 'tracking' : flicking <= switching ? 'flicking' : 'target switching';

  const prompt = `You are TrueSens, an elite FPS Sensitivity Analyst and Aim Coach. Analyze deeply.

INTERNAL ANALYSIS:
- Player type: ${aimStyle || 'hybrid'} aimer with ${mouseGrip} grip
- Current: eDPI ${edpi}, cm/360 ${cm360.toFixed(1)}, ranked "${rank || 'unknown'}"
- Performance: Tracking ${tracking}, Flicking ${flicking}, Switching ${switching}
- Weakest: ${weakest}
${overshooting ? '- Problem: Overshooting targets' : ''}
${undershooting ? '- Problem: Undershooting/falling short' : ''}
${aimIssue ? `- Primary issue: ${aimIssue}` : ''}

OUTPUT (STRICT JSON):
{
  "recommendedSensitivity": "X.XX or X.XX-X.XX",
  "whyThisFits": "2-3 sentences using THEIR data",
  "aiTips": ["specific tip", "specific tip", "specific tip", "specific tip"],
  "improvementPriority": "THE #1 thing to train first",
  "hiddenInsight": "One thing they may not realize",
  "confidence": "High, Medium, or Experimental"
}

RULES: Never generic. Every tip must reference their specific numbers. Sound like elite coach.`;

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
    const content = data?.output?.[0]?.content?.[0]?.text?.trim();
    if (!content) return null;

    const parsed = JSON.parse(content);
    if (parsed.aiTips && parsed.recommendedSensitivity) {
      return parsed;
    }
  } catch {
    // continue
  }

  return null;
}

async function generatePracticeTip(body: TipContext) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return 'Practice your weakest skill daily for 15 min.';

  const weakest = body.tracking <= body.flicking && body.tracking <= body.switching ? 'tracking' : body.flicking <= body.switching ? 'flicking' : 'target switching';

  const prompt = `One sentence practice tip. Player: ${body.game}, weakest: ${weakest}, eDPI: ${body.edpi}. Under 12 words, start with verb.`;

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

    if (response.ok) {
      const data = await response.json();
      return data?.output?.[0]?.content?.[0]?.text?.trim() || 'Practice daily.';
    }
  } catch {
    // continue
  }

  return 'Practice your weakest skill daily for 15 min.';
}

export async function POST(request: Request) {
  try {
    const body: TipContext = await request.json();

    const [analysis, practiceTip] = await Promise.all([
      generateAIAnalysis(body),
      generatePracticeTip(body)
    ]);

    if (analysis) {
      return NextResponse.json({
        ...analysis,
        practiceTip: practiceTip || analysis.aiTips?.[3] || 'Practice daily.',
        fallback: false
      });
    }

    return NextResponse.json({
      recommendedSensitivity: '0.75 - 0.85',
      whyThisFits: `Based on your ${body.label} sensitivity and ${body.aimStyle} style, this range balances control and reactivity.`,
      aiTips: [
        `Your ${body.tracking <= 50 ? 'tracking' : 'flicking'} needs attention based on scores below 50.`,
        'Film your gameplay to identify crosshair placement habits.',
        'Focus on one skill per training session.',
        'Build a consistent warmup routine.'
      ],
      improvementPriority: body.tracking <= body.flicking ? 'tracking' : 'flicking',
      hiddenInsight: 'Most players blame sensitivity when the real issue is tension or inconsistent routine.',
      confidence: 'Medium',
      practiceTip: practiceTip || 'Practice your weakest skill daily.',
      fallback: true
    });
  } catch (error) {
    console.error('Tips API error:', error);
    return NextResponse.json(
      { recommendedSensitivity: '0.79', aiTips: ['Focus on consistency.', 'Warm up before ranked.', 'Film gameplay.', 'Train weakest skill.'], improvementPriority: 'consistency', hiddenInsight: 'Consistency beats raw skill.', confidence: 'Experimental' },
      { status: 200 }
    );
  }
}