import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
};

type AiSenseOutput = {
  optimalSensitivity: number;
  edpi: number;
  cm360: number;
  rationale: string[];
  confidence: number;
  notes: string;
  alternativeRange: { min: number; max: number };
  recommendations: {
    warmup: string;
    dailyDrill: string;
    weeklyFocus: string;
  };
};

const GAME_CONFIGS: Record<string, { multiplier: number; baseFOV: string }> = {
  valorant: { multiplier: 0.07, baseFOV: '103' },
  cs2: { multiplier: 0.022, baseFOV: '75-90' },
};

const WEIGHT_MODIFIERS: Record<string, number> = {
  light: -0.05,
  medium: 0,
  heavy: 0.08,
};

const MOUSEPAD_MODIFIERS: Record<string, number> = {
  cloth: 0,
  hybrid: -0.02,
  hard: -0.05,
  glass: -0.08,
};

async function fetchOptimalSensitivity(input: AiSenseInput): Promise< AiSenseOutput> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OpenAI API key');
  }

  const gameConfig = GAME_CONFIGS[input.game] || GAME_CONFIGS.valorant;
  const weightMod = WEIGHT_MODIFIERS[input.mouseWeight || 'medium'];
  const padMod = MOUSEPAD_MODIFIERS[input.mousePad || 'cloth'];
  
  const prompt = `You are TrueSens, an elite FPS Sensitivity Analyst. Analyze this player's setup and determine their optimal sensitivity.

PLAYER DATA:
- Game: ${input.game}
- Current DPI: ${input.dpi}
- Current In-Game Sens: ${input.inGameSens}
- Grip Style: ${input.grip || 'palm'}
- Mouse Pad: ${input.mousePad || 'cloth'}
- Mouse Weight: ${input.mouseWeight || 'medium'}
- Monitor Size: ${input.monitorSize || '24"'}
- FOV: ${input.fov || gameConfig.baseFOV}
- Playstyle: ${input.playstyle || 'balanced'}
- Role: ${input.role || 'flex'}
- Target Preference: ${input.targetPreference || 'mixed'}
- Reaction Style: ${input.reactionStyle || 'average'}
- Known Weaknesses: ${input.aimWeaknesses?.join(', ') || 'none specified'}

TASK:
Calculate ONE optimal sensitivity value using professional calibration principles:
1. Mouse hardware DPI affects native precision
2. Grip style influences control vs speed needs
3. Mousepad surface affects glide feel
4. Heavy mice need slight increase for momentum
5. Game-specific multipliers (Valorant: sens × DPI × 0.0074 = eDPI for 1 inch/360)
6. Player role affects sensitivity preference
7. Target size needs affect precision requirements
8. Identified weaknesses should influence target range

Return ONLY valid JSON:
{
  "optimalSensitivity": 0.795,
  "rationale": ["reason1", "reason2", "reason3"],
  "confidence": 87,
  "notes": "2-3 sentence summary",
  "alternativeRange": { "min": 0.72, "max": 0.88 },
  "recommendations": {
    "warmup": "specific aim lab scenario name",
    "dailyDrill": "specific training routine",
    "weeklyFocus": "skill to prioritize"
  }
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are TrueSens, an elite FPS Sensitivity Analyst. Return valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 800,
      response_format: { type: 'json_object' }
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API call failed');
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || '';
  
  try {
    const parsed = JSON.parse(content);
    if (parsed.optimalSensitivity && typeof parsed.optimalSensitivity === 'number') {
      const mult = gameConfig.multiplier;
      const edpi = Math.round(parsed.optimalSensitivity * input.dpi);
      const cm360 = parseFloat(((360 * 2.54) / (input.dpi * parsed.optimalSensitivity * mult)).toFixed(2));
      return {
        ...parsed,
        edpi,
        cm360,
      } as AiSenseOutput;
    }
  } catch {
    // fallback
  }

  // Fallback calculation
  let baseSens = input.inGameSens;
  if (input.mouseWeight === 'heavy') baseSens *= 1.08;
  if (input.mousePad === 'hard') baseSens *= 0.95;
  if (input.grip === 'claw') baseSens *= 1.02;
  
  const edpi = Math.round(baseSens * input.dpi);
  const cm360 = parseFloat(((360 * 2.54) / (input.dpi * baseSens * gameConfig.multiplier)).toFixed(2));
  
  return {
    optimalSensitivity: parseFloat(baseSens.toFixed(3)),
    edpi,
    cm360,
    rationale: ['Calculated based on grip style', 'Adjusted for mouse weight', 'Adjusted for mousepad surface'],
    confidence: 72,
    notes: 'Fallback calculation using weighted modifiers.',
    alternativeRange: { min: parseFloat((baseSens * 0.9).toFixed(3)), max: parseFloat((baseSens * 1.1).toFixed(3)) },
    recommendations: {
      warmup: 'Gridshot Ultimate',
      dailyDrill: '5 min tracking, 5 min flicks',
      weeklyFocus: 'Micro adjustments'
    }
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await fetchOptimalSensitivity(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error('AI sense engine failed:', err);
    return NextResponse.json({
      optimalSensitivity: 0.79,
      edpi: 632,
      cm360: 46.2,
      rationale: ['System fallback'],
      confidence: 50,
      notes: 'Using fallback calculation',
      alternativeRange: { min: 0.7, max: 0.9 },
      recommendations: {
        warmup: 'Gridshot',
        dailyDrill: '15 min mixed',
        weeklyFocus: 'Consistency'
      }
    } as AiSenseOutput);
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'POST to /api/ai-sense with full player data for AI-powered sensitivity recommendation',
    required: ['dpi', 'inGameSens', 'grip', 'mousePad', 'game'],
    optional: ['mouseWeight', 'monitorSize', 'fov', 'playstyle', 'role', 'targetPreference', 'reactionStyle', 'aimWeaknesses']
  });
}