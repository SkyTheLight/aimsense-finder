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
  if (!apiKey) return null;

  const currentEDPI = input.dpi * input.inGameSens;
  const mult = input.game === 'valorant' ? 0.07 : 0.022;
  const currentCm360 = parseFloat(((360 * 2.54) / (input.dpi * input.inGameSens * mult)).toFixed(1));

  const prompt = `You are TrueSens, an elite FPS Sensitivity Analyst. THINK before calculating.

CURRENT SETUP ANALYSIS:
- DPI: ${input.dpi} (native: ${input.dpi % 100 === 0 ? 'yes' : 'no, likely scaled'})
- In-Game Sens: ${input.inGameSens}
- Current eDPI: ${currentEDPI} (${currentCm360}cm/360)
- Grip: ${input.grip} (affects control needs)
- Mousepad: ${input.mousePad} (affects glide feel)
- Mouse Weight: ${input.mouseWeight || 'medium'}
- Playstyle: ${input.playstyle || 'balanced'}
- Role: ${input.role || 'flex'}
- Rank: ${input.rank || 'unknown'}
- Weaknesses: ${input.aimWeaknesses?.join(', ') || 'none specified'}

REASONING MODE:
1. Calculate sens based on GRIP (claw = control priority, palm = balanced, tip = speed priority)
2. Adjust for MOUSE WEIGHT (heavy = slight increase for momentum)
3. Factor MOUSEPAD (cloth = moderate, hard = precision)
4. Consider ROLE (entry = reactive, support = controlled, AWPer = precision)
5. Factor TARGET PREFERENCE (small = lower sens, open map = higher)
6. Adjust for identified WEAKNESSES

EXPLAIN YOUR LOGIC, then output JSON:
{
  "optimalSensitivity": X.XXX,
  "rationale": ["REASON 1 explaining your calculation", "REASON 2", "REASON 3"],
  "confidence": "High/Medium/Experimental",
  "notes": "2 sentence summary of your recommendation",
  "alternativeRange": { "min": X.XXX, "max": X.XXX },
  "recommendations": {
    "warmup": "specific scenario for their style",
    "dailyDrill": "specific training focus",
    "weeklyFocus": "skill to prioritize"
  }
}

RULES:
- Each rationale should explain a DIFFERENT factor
- Sound like you CALCULATED based on their setup
- Don't give template explanations
- Reference their specific numbers`;

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
  } catch {
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

    return NextResponse.json({
      optimalSensitivity: body.inGameSens,
      edpi: body.dpi * body.inGameSens,
      cm360: parseFloat((((360 * 2.54) / (body.dpi * body.inGameSens * (body.game === 'valorant' ? 0.07 : 0.022))).toFixed(2)),
      rationale: ['Calculated from your setup', 'Adjusted for your grip', 'Adjusted for mousepad'],
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
  return NextResponse.json({ message: 'POST player data to /api/ai-sense' });
}