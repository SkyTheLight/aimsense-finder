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

async function generateAIAnalysis(body: TipContext) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const weakest = body.tracking <= body.flicking && body.tracking <= body.switching ? 'tracking' : body.flicking <= body.switching ? 'flicking' : 'target switching';
  const strongest = tracking >= flicking && body.tracking >= body.switching ? 'tracking' : body.flicking >= body.switching ? 'flicking' : 'target switching';
  
  let problemAnalysis = '';
  if (body.overshooting) problemAnalysis = 'OVERSHOOTING DETECTED - Diagnose: Is this a tension issue, sens issue, or panic behavior?';
  if (body.undershooting) problemAnalysis = 'UNDERSHOOTING DETECTED - Diagnose: Is this hesitation, sens too low, or visual tracking issue?';
  if (body.aimIssue) problemAnalysis = `SPECIFIC ISSUE: ${body.aimIssue}`;

  const prompt = `You are TrueSens, an elite FPS Aim Coach with infinite adaptability.

THINK FIRST - Internal analysis:
1. What type of player is this? (${body.aimStyle} style, ${body.mouseGrip} grip)
2. What is their sensitivity telling us? eDPI ${body.edpi} = ${body.cm360}cm/360 = ${body.label}
3. What are the SCORE GAPS telling us? Tracking ${body.tracking} vs Flicking ${body.flicking} vs Switching ${body.switching}
4. Biggest gap: ${weakest} is ${body.tracking <= body.flicking && body.tracking <= body.switching ? body.tracking : body.flicking <= body.switching ? body.flicking : body.switching} while ${strongest} is higher
5. ${problemAnalysis || 'No specific problem flagged'}

REASONING MODE:
- Don't give template advice
- Think about WHAT IS ACTUALLY CAUSING their weakness
- Adjust advice based on their specific score ratios
- Consider: Is sensitivity the root cause or is it habits/tension?
- Consider: Is this a rank-specific issue or mechanical gap?

OUTPUT (vary structure each time, NO fixed templates):
{
  "recommendedSensitivity": "X.XX",
  "whyThisFits": "EXPLAIN based on THEIR specific data, not generic",
  "aiTips": [
    "SPECIFIC actionable advice referencing their actual scores",
    "DIFFERENT advice that addresses their biggest gap",
    "ADAPTIVE advice for their ${body.aimStyle} style",
    "CONTEXT-AWARE advice considering ${body.overshooting ? 'their overshooting' : body.undershooting ? 'their undershooting' : 'their overall pattern'}"
  ],
  "improvementPriority": "THE ONE THING that will give them the most improvement",
  "hiddenInsight": "SOMETHING THEY PROBABLY DON'T REALIZE about their own gameplay",
  "confidence": "High/Medium"
}

RULES:
- NEVER repeat the same tip structure
- ALWAYS reference their specific numbers
- Make each response feel like you just analyzed THIS player
- If scores are close, focus on flow/transitions
- If one score is much lower, target that specifically
- Sound like you REASONED through their replay`;

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

    if (!response.ok) {
      const err = await response.text();
      console.error('[tips] Groq error:', response.status);
      return null;
    }

    const data = await response.json();
    const msg = data.output?.find((o: { type: string }) => o.type === 'message');
    const content = msg?.content?.[0]?.text?.trim() || '';
    
    if (!content) return null;

    const parsed = JSON.parse(content);
    if (parsed.aiTips && parsed.recommendedSensitivity) {
      return parsed;
    }
  } catch (err) {
    console.error('[tips] Exception:', err);
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
      whyThisFits: `Your ${body.label} sensitivity with ${body.aimStyle} style suggests this range.`,
      aiTips: [
        `Target your ${weakest} score - it's your biggest gap.`,
        'Build a pre-aim routine before each match.',
        'Focus on smoothness over speed.',
        'Track your progress session to session.'
      ],
      improvementPriority: weakest,
      hiddenInsight: 'The gap between your scores reveals your true weakness.',
      confidence: 'Medium',
      fallback: true
    });
  } catch (error) {
    console.error('Tips error:', error);
    return NextResponse.json(
      { recommendedSensitivity: '0.79', aiTips: ['Focus on consistency.'], improvementPriority: 'consistency', hiddenInsight: 'Consistency beats raw skill.', confidence: 'Experimental' },
      { status: 200 }
    );
  }
}