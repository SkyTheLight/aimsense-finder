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
}

async function generateAIAnalysis(body: TipContext) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const weakest = body.tracking <= body.flicking && body.tracking <= body.switching ? 'tracking' : body.flicking <= body.switching ? 'flicking' : 'target switching';

  const prompt = `You are TrueSens, an elite FPS Aim Coach. Return ONLY valid JSON.

Player: ${body.game}, eDPI ${body.edpi}, style ${body.aimStyle}, grip ${body.mouseGrip}
Scores: Tracking ${body.tracking}, Flicking ${body.flicking}, Switching ${body.switching}
Weakest: ${weakest}

JSON format:
{
  "recommendedSensitivity": "0.75-0.85",
  "whyThisFits": "2 sentences based on their data",
  "aiTips": ["specific tip 1", "specific tip 2", "specific tip 3", "specific tip 4"],
  "improvementPriority": "THE #1 priority",
  "hiddenInsight": "One hidden observation",
  "confidence": "High"
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

    if (!response.ok) {
      const err = await response.text();
      console.error('[tips] Groq error:', response.status, err.substring(0, 100));
      return null;
    }

    const data = await response.json();
    const msg = data.output?.find((o: { type: string }) => o.type === 'message');
    const content = msg?.content?.[0]?.text?.trim() || '';
    
    if (!content) {
      console.error('[tips] No content in response');
      return null;
    }

    const parsed = JSON.parse(content);
    if (parsed.aiTips && parsed.recommendedSensitivity) {
      return parsed;
    }
    
    console.error('[tips] Parsed JSON invalid:', content.substring(0, 100));
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

    return NextResponse.json({
      recommendedSensitivity: '0.75 - 0.85',
      whyThisFits: `Based on your ${body.label} sensitivity and ${body.aimStyle} style.`,
      aiTips: [
        `Your ${body.tracking <= 50 ? 'tracking' : 'flicking'} needs attention.`,
        'Film your gameplay.',
        'Focus on one skill per session.',
        'Build a warmup routine.'
      ],
      improvementPriority: body.tracking <= body.flicking ? 'tracking' : 'flicking',
      hiddenInsight: 'Most players blame sens when routine is the issue.',
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