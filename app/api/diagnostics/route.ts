import { NextResponse } from 'next/server';

interface AimDiagnosticBody {
  game: string;
  gridshot: number;
  sixshot: number;
  strafeTrack: number;
  sphereTrack: number;
  tracking?: number;
  flicking?: number;
  switching?: number;
  aimStyle?: string;
  mouseGrip?: string;
  rank?: string;
}

async function analyzeAimPattern(body: AimDiagnosticBody) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const { gridshot, sixshot, strafeTrack, sphereTrack, aimStyle, mouseGrip } = body;
  const microScore = Math.round((sixshot * 0.6 + gridshot * 0.2 + strafeTrack * 0.2));
  const macroScore = Math.round((gridshot * 0.5 + strafeTrack * 0.3 + sixshot * 0.2));
  const tensionScore = Math.round((sixshot * 0.3 + sphereTrack * 0.4 + gridshot * 0.3));

  const prompt = `You are TrueSens, an elite FPS Aim Analyst. Analyze this player's performance.

PERFORMANCE:
- Gridshot: ${gridshot}, Sixshot: ${sixshot}
- Strafe Track: ${strafeTrack}, Smooth Sphere: ${sphereTrack}
- Micro: ${microScore}/100, Macro: ${macroScore}/100, Tension: ${tensionScore}/100
- Style: ${aimStyle || 'hybrid'}, Grip: ${mouseGrip || 'palm'}

OUTPUT (STRICT JSON):
{
  "skillTier": "Silver/Gold/etc",
  "percentile": 30,
  "aimStyle": "precision/speed/hybrid",
  "consistency": 65,
  "microScore": ${microScore},
  "macroScore": ${macroScore},
  "tensionScore": ${tensionScore},
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "coachingSummary": "1 sentence profile",
  "priorityFocus": "THE #1 priority",
  "improvementPace": "how fast improving",
  "insight": "ONE hidden observation"
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
    const content = data?.output?.[0]?.content?.[0]?.text?.trim();
    if (!content) return null;

    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body: AimDiagnosticBody = await request.json();
    const result = await analyzeAimPattern(body);

    if (result) {
      return NextResponse.json({ ...result, fallback: false });
    }

    return NextResponse.json({
      skillTier: 'Silver',
      percentile: 15,
      aimStyle: 'hybrid',
      consistency: 60,
      microScore: 35,
      macroScore: 40,
      tensionScore: 45,
      strengths: ['Decent tracking'],
      weaknesses: ['Aim precision'],
      coachingSummary: 'Developing player with room to grow',
      priorityFocus: 'Practice flicking and tracking',
      improvementPace: 'consistent',
      insight: 'Keep practicing to see improvement',
      fallback: true
    });
  } catch (error) {
    console.error('Diagnostics failed:', error);
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST benchmark scores to /api/diagnostics' });
}