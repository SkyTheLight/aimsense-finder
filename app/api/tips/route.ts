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

  const scoreGap = {
    tracking: body.tracking,
    flicking: body.flicking,
    switching: body.switching
  };
  const weakestKey = Object.keys(scoreGap).reduce((a, b) => scoreGap[a] < scoreGap[b] ? a : b);
  const strongestKey = Object.keys(scoreGap).reduce((a, b) => scoreGap[a] > scoreGap[b] ? a : b);
  const gapSize = scoreGap[strongestKey] - scoreGap[weakestKey];
  
  const problemFlag = body.overshooting ? 'OVERSHOOTING' : body.undershooting ? 'UNDERSHOOTING' : body.aimIssue ? `ISSUE: ${body.aimIssue}` : 'NONE';

  const prompt = `REASONING ENGINE ACTIVE. Analyze this player from scratch.

STATE:
- Game: ${body.game}
- eDPI: ${body.edpi} | cm/360: ${body.cm360} | Type: ${body.label}
- Style: ${body.aimStyle} | Grip: ${body.mouseGrip} | Rank: ${body.rank || 'unknown'}
- Scores: T${body.tracking} F${body.flicking} S${body.switching}
- Gap: ${gapSize} between ${strongestKey}(${scoreGap[strongestKey]}) and ${weakestKey}(${scoreGap[weakestKey]})
- Problem: ${problemFlag}

REASONING REQUIRED:
1. WHY is ${weakestKey} their weakest? (habit? sens? tension? reaction?)
2. Is sensitivity CAUSING this or just not helping?
3. What specific behavior would change their ${weakestKey} score?
4. How does ${body.aimStyle} + ${body.mouseGrip} affect their problem?
5. ${problemFlag !== 'NONE' ? `DIAGNOSE ${problemFlag}: root cause?` : 'No flagged problem - what hidden issue might they have?'}

BUILD response. VARY structure. DO NOT use fixed templates.

OUTPUT:
{
  "recommendedSensitivity": "X.XX",
  "whyThisFits": "EXPLANATION based on THIS player's specific data",
  "aiTips": ["UNIQUE action for THIS player", "DIFFERENT approach", "ADAPTIVE method", "CONTEXT-SPECIFIC drill"],
  "improvementPriority": "SINGLE most impactful change",
  "hiddenInsight": "SOMETHING THEY DON'T KNOW about their gameplay",
  "confidence": "High/Medium"
}

STRUCTURE: Fresh each request. Reference specific numbers. Sound like you just analyzed their replay.`;

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
      whyThisFits: `Based on your ${body.label} sensitivity.`,
      aiTips: [
        `Target your ${weakest} gap directly.`,
        'Build a consistent pre-round routine.',
        'Focus on one adjustment at a time.',
        'Film and review your sessions.'
      ],
      improvementPriority: weakest,
      hiddenInsight: 'Score gaps reveal habit patterns, not just skill.',
      confidence: 'Medium',
      fallback: true
    });
  } catch (error) {
    console.error('Tips error:', error);
    return NextResponse.json(
      { recommendedSensitivity: '0.79', aiTips: ['Analyze your score gaps.'], improvementPriority: 'consistency', hiddenInsight: 'Consistency beats raw skill.', confidence: 'Experimental' },
      { status: 200 }
    );
  }
}