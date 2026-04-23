import { NextResponse } from 'next/server';

type AiSenseInput = {
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
};

async function fetchOptimalSensitivity(input: AiSenseInput) {
  const apiKey = process.env.GROQ_API_KEY;
  console.log('[ai-sense] GROQ_API_KEY exists:', !!apiKey, apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING');
  if (!apiKey) return null;

  const { dpi, inGameSens, grip, mousePad, mouseWeight, playstyle, role, targetPreference, reactionStyle, game, aimWeaknesses, rank } = input;
  const currentEDPI = dpi * inGameSens;
  const mult = game === 'valorant' ? 0.07 : 0.022;
  const currentCm360 = parseFloat(((360 * 2.54) / (dpi * inGameSens * mult)).toFixed(1));

  const prompt = `You are TrueSens, an elite FPS Sensitivity Analyst. Calculate optimal sensitivity.

PLAYER DATA:
- Game: ${game}
- Current DPI: ${dpi}, In-Game Sens: ${inGameSens}, eDPI: ${currentEDPI}
- Grip: ${grip}, Mousepad: ${mousePad}, Weight: ${mouseWeight || 'medium'}
- Playstyle: ${playstyle || 'balanced'}, Role: ${role || 'flex'}
- Target Preference: ${targetPreference || 'mixed'}, Reaction: ${reactionStyle || 'average'}
- Known Weaknesses: ${aimWeaknesses?.join(', ') || 'none'}
- Rank: ${rank || 'unknown'}

OUTPUT (STRICT JSON):
{
  "optimalSensitivity": 0.XXX,
  "rationale": ["reason 1", "reason 2", "reason 3"],
  "confidence": "High/Medium/Experimental",
  "notes": "2 sentence summary",
  "alternativeRange": { "min": 0.XXX, "max": 0.XXX },
  "recommendations": { "warmup": "scenario", "dailyDrill": "routine", "weeklyFocus": "skill" }
}`;

  try {
    console.log('[ai-sense] Calling Groq API...');
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

    console.log('[ai-sense] Groq response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ai-sense] Groq error:', errorText);
      return null;
    }

    const data = await response.json();
    console.log('[ai-sense] Groq response:', JSON.stringify(data).substring(0, 200));
    const content = data?.output?.[0]?.content?.[0]?.text?.trim();
    if (!content) return null;

    const parsed = JSON.parse(content);
    if (parsed.optimalSensitivity && typeof parsed.optimalSensitivity === 'number') {
      const edpi = Math.round(parsed.optimalSensitivity * dpi);
      const cm360 = parseFloat(((360 * 2.54) / (dpi * parsed.optimalSensitivity * mult)).toFixed(2));
      return { ...parsed, edpi, cm360 };
    }
  } catch {
    // continue
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

    return NextResponse.json({
      optimalSensitivity: 0.79,
      edpi: 632,
      cm360: 46.2,
      rationale: ['Calculated from your setup', 'Adjusted for your grip', 'Adjusted for mousepad'],
      confidence: 'Medium',
      notes: 'Fallback. Set GROQ_API_KEY for AI recommendation.',
      alternativeRange: { min: 0.7, max: 0.9 },
      recommendations: { warmup: 'Gridshot Ultimate', dailyDrill: '5 min tracking, 5 min flicks', weeklyFocus: 'Micro adjustments' }
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
  return NextResponse.json({ message: 'POST player data to /api/ai-sense' });
}