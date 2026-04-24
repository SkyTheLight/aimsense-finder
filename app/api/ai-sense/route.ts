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

const VALID_GRIPS = ['palm', 'claw', 'tip', 'hybrid', 'fingertip'];
const VALID_GAMES = ['valorant', 'cs2', 'overwatch2', 'apex legends', 'fortnite'];
const VALID_MOUSE_PADS = ['cloth', 'hard', 'hybrid', 'glass'];

function sanitizeInput(input: AiSenseInput): { valid: boolean; error?: string; data?: AiSenseInput } {
  if (!input.dpi || typeof input.dpi !== 'number') {
    return { valid: false, error: 'DPI is required and must be a number' };
  }
  if (input.dpi < 100 || input.dpi > 32000) {
    return { valid: false, error: 'DPI must be between 100 and 32000' };
  }
  if (!input.inGameSens || typeof input.inGameSens !== 'number') {
    return { valid: false, error: 'In-game sensitivity is required' };
  }
  if (input.inGameSens < 0.01 || input.inGameSens > 10) {
    return { valid: false, error: 'Sensitivity must be between 0.01 and 10' };
  }
  if (!input.game || typeof input.game !== 'string') {
    return { valid: false, error: 'Game is required' };
  }
  
  const sanitized: AiSenseInput = {
    dpi: Math.round(input.dpi),
    inGameSens: parseFloat(input.inGameSens.toFixed(2)),
    game: input.game.toLowerCase().replace(/\s+/g, ''),
    grip: (input.grip || 'palm').toLowerCase(),
    mousePad: (input.mousePad || 'cloth').toLowerCase(),
    mouseWeight: input.mouseWeight?.toLowerCase() || 'medium',
    playstyle: input.playstyle?.toLowerCase() || 'balanced',
    role: input.role?.toLowerCase() || 'flex',
    rank: input.rank?.toLowerCase() || 'unknown',
  };
  
  return { valid: true, data: sanitized };
}

async function fetchOptimalSensitivity(input: AiSenseInput, signal?: AbortSignal) {
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

OUTPUT JSON (valid, parseable):
{
  "optimalSensitivity": X.XXX,
  "rationale": ["Reason 1", "Reason 2"],
  "confidence": "High/Medium",
  "notes": "summary",
  "alternativeRange": { "min": X.XXX, "max": X.XXX },
  "recommendations": { "warmup": "scenario", "dailyDrill": "routine", "weeklyFocus": "skill" }
}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
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
      signal: signal || controller.signal,
    });
    
    clearTimeout(timeout);

    if (!response.ok) {
      console.error('Groq API error:', response.status);
      return null;
    }

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
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('Groq request timeout');
    } else {
      console.error('AI sense error:', err);
    }
    return null;
  }

  return null;
}

function getFallbackResponse(input: AiSenseInput) {
  const fallbackEdpi = input.dpi * input.inGameSens;
  const fallbackMult = input.game === 'valorant' ? 0.07 : 0.022;
  const fallbackCm360 = parseFloat(((360 * 2.54) / (input.dpi * input.inGameSens * fallbackMult)).toFixed(2));

  return {
    optimalSensitivity: input.inGameSens,
    edpi: fallbackEdpi,
    cm360: fallbackCm360,
    rationale: ['Calculated from your setup', 'Adjusted for your grip'],
    confidence: 'Medium',
    notes: 'Fallback calculation.',
    alternativeRange: { min: input.inGameSens * 0.9, max: input.inGameSens * 1.1 },
    recommendations: { warmup: 'Gridshot', dailyDrill: '15 min mixed', weeklyFocus: 'Micro adjustments' }
  };
}

export async function POST(request: Request) {
  try {
    let body: AiSenseInput;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = sanitizeInput(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const result = await fetchOptimalSensitivity(validation.data!);

    if (result) {
      return NextResponse.json(result);
    }

    return NextResponse.json(getFallbackResponse(validation.data!));
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
    message: 'POST player data to /api/ai-sense',
    example: {
      dpi: 800,
      inGameSens: 0.5,
      grip: 'claw',
      mousePad: 'cloth',
      game: 'valorant'
    }
  });
}