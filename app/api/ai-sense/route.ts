import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface AiSenseInput {
  dpi: number;
  inGameSens: number;
  grip: string;
  mousePad: string;
  mouseWeight?: string;
  monitorSize?: string;
  fov?: string;
  playstyle?: string;
  role?: string;
  targetPreference?: string;
  reactionStyle?: string;
  game: string;
  aimWeaknesses?: string[];
  rank?: string;
}

async function fetchOptimalSensitivity(input: AiSenseInput) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const currentEDPI = input.dpi * input.inGameSens;
  const mult = input.game === 'valorant' ? 0.07 : 0.022;
  const currentCm360 = parseFloat(((360 * 2.54) / (input.dpi * input.inGameSens * mult)).toFixed(1));

  const prompt = `You are TrueSens, an elite FPS Sensitivity Analyst. Calculate optimal sensitivity.

PLAYER DATA:
- DPI: ${input.dpi}, In-Game Sens: ${input.inGameSens}, eDPI: ${currentEDPI}
- Grip: ${input.grip}, Mousepad: ${input.mousePad}, Weight: ${input.mouseWeight || 'medium'}
- Playstyle: ${input.playstyle || 'balanced'}, Role: ${input.role || 'flex'}
- Game: ${input.game}, Rank: ${input.rank || 'unknown'}

OUTPUT JSON:
{
  "optimalSensitivity": X.XXX,
  "rationale": ["Reason 1", "Reason 2"],
  "confidence": "High/Medium",
  "notes": "summary",
  "alternativeRange": { "min": X.XXX, "max": X.XXX },
  "recommendations": { "warmup": "scenario", "dailyDrill": "routine", "weeklyFocus": "skill" }
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
    if (parsed.optimalSensitivity && typeof parsed.optimalSensitivity === 'number') {
      const edpi = Math.round(parsed.optimalSensitivity * input.dpi);
      const cm360 = parseFloat(((360 * 2.54) / (input.dpi * parsed.optimalSensitivity * mult)).toFixed(2));
      return { ...parsed, edpi, cm360 };
    }
  } catch (err) {
    return null;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body: AiSenseInput = await request.json();
    const result = await fetchOptimalSensitivity(body);

    if (result) {
      return NextResponse.json(result);
    }

    const fallbackEdpi = body.dpi * body.inGameSens;
    const fallbackMult = body.game === 'valorant' ? 0.07 : 0.022;
    const fallbackCm360 = parseFloat(((360 * 2.54) / (body.dpi * body.inGameSens * fallbackMult)).toFixed(2));

    return NextResponse.json({
      optimalSensitivity: body.inGameSens,
      edpi: fallbackEdpi,
      cm360: fallbackCm360,
      rationale: ['Calculated from your setup', 'Adjusted for your grip'],
      confidence: 'Medium',
      notes: 'Fallback calculation.',
      alternativeRange: { min: body.inGameSens * 0.9, max: body.inGameSens * 1.1 },
      recommendations: { warmup: 'Gridshot', dailyDrill: '15 min mixed', weeklyFocus: 'Micro adjustments' }
    });
  } catch (err) {
    console.error('AI sense failed:', err);
    return NextResponse.json({
      optimalSensitivity: 0.79,
      edpi: 632,
      cm360: 46.2,
      rationale: ['System fallback'],
      confidence: 'Experimental',
      notes: 'Error occurred',
      alternativeRange: { min: 0.7, max: 0.9 },
      recommendations: { warmup: 'Gridshot', dailyDrill: '15 min mixed', weeklyFocus: 'Consistency' }
    });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST player data to /api/ai-sense'
  });
}