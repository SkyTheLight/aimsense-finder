import { NextResponse } from 'next/server';

type SystemPromptRequest = {
  game: string;
  dpi?: number;
  inGameSens?: number;
  grip?: string;
  mousePad?: string;
  mouseWeight?: string;
  aimWeaknesses?: string[];
  skillLevel?: string;
  role?: string;
  goals?: string;
  benchmarkScores?: {
    tracking: number;
    flicking: number;
    switching: number;
  };
};

const DRILL_PRESETS: Record<string, { scenarios: string }> = {
  tracking: { scenarios: 'Smooth Sphere, Tracker Pre, Strafe Track' },
  flicking: { scenarios: 'Reflexshot, Tile Frenzy, Microshot' },
  switching: { scenarios: 'Gridshot, Sixshot, Chaos' },
};

async function generateCoachProfile(input: SystemPromptRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const scores = input.benchmarkScores;
  const detected: string[] = [];
  if (scores) {
    if (scores.tracking < 40) detected.push('tracking');
    if (scores.flicking < 40) detected.push('flicking');
    if (scores.switching < 40) detected.push('switching');
  }
  if (input.aimWeaknesses) detected.push(...input.aimWeaknesses);

  const prompt = `You are TrueSens, an elite FPS Aim Coach. Generate coaching profile.

PLAYER:
- Game: ${input.game}, Skill: ${input.skillLevel || 'intermediate'}
- Role: ${input.role || 'flex'}, Goals: ${input.goals || 'ranked improvement'}
- Benchmark: T${scores?.tracking || 50}/F${scores?.flicking || 50}/S${scores?.switching || 50}
- Weaknesses: ${detected.join(', ') || 'analyzing...'}

OUTPUT (JSON):
{
  "persona": "2-3 word style",
  "systemPrompt": "3-4 sentence coaching style",
  "detectedWeaknesses": ["weak1", "weak2"],
  "strengths": ["strength1"],
  "coachingPlan": {
    "week1": { "focus": "skill", "drill": "scenario", "reps": "sets", "duration": "min" },
    "week2": { "focus": "skill", "drill": "scenario", "reps": "sets", "duration": "min" },
    "week3": { "focus": "skill", "drill": "scenario", "reps": "sets", "duration": "min" },
    "week4": { "focus": "integration", "drill": "scenarios", "reps": "sets", "duration": "min" }
  },
  "dailyRoutine": { "warmup": "routine", "mainDrill": "drill", "cooldown": "routine" },
  "recommendations": [{ "content": "tip", "url": "search URL" }],
  "motivation": "1 sentence motivational message"
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

function getStaticCoachProfile(input: SystemPromptRequest) {
  const isVal = input.game === 'valorant';
  const score = input.benchmarkScores;
  const weak: string[] = [];
  if (score) {
    if (score.tracking < 40) weak.push('tracking');
    if (score.flicking < 40) weak.push('flicking');
    if (score.switching < 40) weak.push('switching');
  }

  return {
    systemPrompt: isVal ? 'Be precise, direct, focused on headshot mechanics and aggressive peeking.' : 'Be technical, analytical, focused on consistency and spray control.',
    persona: isVal ? 'Aggressive Coach' : 'Tactical Mentor',
    detectedWeaknesses: weak,
    strengths: ['potential'],
    coachingPlan: {
      week1: { focus: weak[0] || 'tracking', drill: DRILL_PRESETS[weak[0]]?.scenarios || 'Smooth Sphere', reps: '3 sets', duration: '15 min' },
      week2: { focus: weak[1] || 'flicking', drill: DRILL_PRESETS[weak[1]]?.scenarios || 'Reflexshot', reps: '3 sets', duration: '15 min' },
      week3: { focus: weak[2] || 'switching', drill: DRILL_PRESETS[weak[2]]?.scenarios || 'Gridshot', reps: '3 sets', duration: '15 min' },
      week4: { focus: 'integration', drill: 'Ranked gameplay', reps: '3 games', duration: '60 min' },
    },
    dailyRoutine: { warmup: '5 min tracking, 5 min flicks.', mainDrill: `Focus on ${weak[0] || 'tracking'}.`, cooldown: '5 min Gridshot Ultimate.' },
    recommendations: [{ content: 'Practice fundamentals.', url: 'https://youtube.com/results?search_query=ron+rambo+kim+aim+fundamentals' }],
    motivation: 'Trust your training and dominate.'
  };
}

export async function POST(request: Request) {
  try {
    const body: SystemPromptRequest = await request.json();
    const result = await generateCoachProfile(body);
    return NextResponse.json(result || getStaticCoachProfile(body));
  } catch (error) {
    console.error('Coach profile failed:', error);
    return NextResponse.json(getStaticCoachProfile({ game: 'valorant' }));
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST player data to /api/coach/system-prompt' });
}