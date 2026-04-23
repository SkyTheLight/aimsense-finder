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

type CoachOutput = {
  systemPrompt: string;
  persona: string;
  detectedWeaknesses: string[];
  strengths: string[];
  coachingPlan: {
    week1: { focus: string; drill: string; reps: string; duration: string };
    week2: { focus: string; drill: string; reps: string; duration: string };
    week3: { focus: string; drill: string; reps: string; duration: string };
    week4: { focus: string; drill: string; reps: string; duration: string };
  };
  dailyRoutine: { warmup: string; mainDrill: string; cooldown: string };
  recommendations: {
    content: string;
    creator?: string;
    url: string;
  }[];
  motivation: string;
};

const WEAKNESS_MAP: Record<string, string[]> = {
  tracking: ['smooth tracking', 'moving target accuracy', 'fluid movements'],
  flicking: ['quick flicks', 'perpendicular flicks', 'accuracy under pressure'],
  'micro-adjustments': ['small corrections', 'precision on small targets', 'fine motor control'],
  'crosshair placement': ['positioning', 'height awareness', 'map geometry'],
  'recoil control': ['spray maintenance', 'burst control', 'weapon mastery'],
  'target switching': ['multitarget', 'focused flicking', 'priority targeting'],
  'movement aim': ['strafing synchronization', 'air control', 'directional flicks'],
  confidence: ['clutch situations', 'post-plant plays', '1vX scenarios'],
  consistency: ['performance variance', 'fatigue handling', 'session averages'],
};

const DRILL_PRESETS = {
  tracking: { name: 'Smooth Tracking', scenarios: 'Smooth Sphere, Tracker Pre, Strafe Track' },
  flicking: { name: 'Flick Training', scenarios: 'Reflexshot, Tile Frenzy, Microshot' },
  switching: { name: 'Target Switching', scenarios: 'Gridshot, Sixshot, Chaos' },
  precision: { name: 'Precision', scenarios: 'Microshot, Pinpoint, Fine Tuning' },
  speed: { name: 'Speed', scenarios: 'Reactive Tap, Spiders, Popcorn' },
};

async function generateCoachProfile(input: SystemPromptRequest): Promise<CoachOutput> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return getStaticCoachProfile(input);
  }

  const scores = input.benchmarkScores;
  const detected: string[] = [];
  const strengths: string[] = [];
  
  if (scores) {
    if (scores.tracking < 40) detected.push('tracking');
    else strengths.push('tracking');
    if (scores.flicking < 40) detected.push('flicking');
    else strengths.push('flicking');
    if (scores.switching < 40) detected.push('switching');
    else strengths.push('switching');
  }
  
  if (input.aimWeaknesses) {
    detected.push(...input.aimWeaknesses);
  }

  const week1Focus = detected[0] || 'tracking';
  const week2Focus = detected[1] || (detected[0] === 'tracking' ? 'flicking' : 'tracking');
  const week3Focus = detected[2] || 'switching';
  const week4Focus = 'consistency';

  const prompt = `You are a Professional FPS Aim Coach. Generate a personalized coaching profile for this player.

PLAYER PROFILE:
- Game: ${input.game}
- Skill Level: ${input.skillLevel || 'intermediate'}
- Role: ${input.role || 'flex'}
- Goals: ${input.goals || 'ranked improvement'}
- Benchmark Scores (if any): Tracking ${scores?.tracking || 50}, Flicking ${scores?.flicking || 50}, Switching ${scores?.switching || 50}
- Detected Weaknesses: ${detected.join(', ') || 'analyzing...'}
- Identified Strengths: ${strengths.join(', ') || 'developing'}

Generate a JSON coaching profile:

{
  "persona": "2-3 word coach persona (e.g., 'Precision Mentor', 'Aggressive Coach', 'Patient Analyst')",
  "systemPrompt": "3-4 sentence detailed system prompt establishing your coaching style, expertise, and approach based on this player's profile",
  "detectedWeaknesses": ["weakness1", "weakness2"],
  "strengths": ["strength1", "strength2"],
  "coachingPlan": {
    "week1": { "focus": "specific skill", "drill": "specific aim lab scenario", "reps": "sets or rounds", "duration": "minutes" },
    "week2": { "focus": "specific skill", "drill": "specific aim lab scenario", "reps": "sets or rounds", "duration": "minutes" },
    "week3": { "focus": "specific skill", "drill": "specific aim lab scenario", "reps": "sets or rounds", "duration": "minutes" },
    "week4": { "focus": "integration", "drill": "game scenarios", "reps": "parameter", "duration": "minutes" }
  },
  "dailyRoutine": {
    "warmup": "2-3 sentence warmup routine",
    "mainDrill": "main drill description",
    "cooldown": "1-2 sentence cooldown routine"
  },
  "recommendations": [
    { "content": "specific actionable recommendation", "creator": "channel name (optional)", "url": "youtube search URL" }
  ],
  "motivation": "1-2 sentence motivational message specific to player goals"
}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a Professional FPS Aim Coach. Return valid JSON only with no additional text.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content?.trim() || '';
      
      try {
        const parsed = JSON.parse(content);
        if (parsed.systemPrompt && parsed.coachingPlan) {
          return parsed as CoachOutput;
        }
      } catch {
        // continue to fallback
      }
    }
  } catch {
    // continue to fallback
  }

  return getStaticCoachProfile(input);
}

function getStaticCoachProfile(input: SystemPromptRequest): CoachOutput {
  const isVal = input.game === 'valorant';
  const skillLevel = input.skillLevel || 'intermediate';
  
  const score = input.benchmarkScores;
  const weak = [] as string[];
  const str = [] as string[];
  
  if (score) {
    if (score.tracking < 40) weak.push('tracking');
    else str.push('tracking');
    if (score.flicking < 40) weak.push('flicking');
    else str.push('flicking');
    if (score.switching < 40) weak.push('target switching');
    else str.push('target switching');
  }
  
  if (input.aimWeaknesses) weak.push(...input.aimWeaknesses);

  return {
    systemPrompt: isVal 
      ? `You are an Elite FPS Aim Coach specializing in ${input.game}. Be precise, direct, and focused on headshot mechanics, crosshair placement, and aggressive peeking. Every piece of advice should help the player frag more and dominate engagements.`
      : `You are an Elite FPS Aim Coach specializing in ${input.game}. Be technical, analytical, and focused on consistency, spray control, and positional aim. Every piece of advice should help the player play smarter and win rounds.`,
    persona: isVal ? 'Aggressive Coach' : 'Tactical Mentor',
    detectedWeaknesses: weak,
    strengths: str.length ? str : ['potential'],
    coachingPlan: {
      week1: { focus: weak[0] || 'tracking', drill: DRILL_PRESETS[weak[0] as keyof typeof DRILL_PRESETS]?.scenarios || DRILL_PRESETS.tracking.scenarios, reps: '3 sets', duration: '15 min' },
      week2: { focus: weak[1] || 'flicking', drill: DRILL_PRESETS[weak[1] as keyof typeof DRILL_PRESETS]?.scenarios || DRILL_PRESETS.flicking.scenarios, reps: '3 sets', duration: '15 min' },
      week3: { focus: weak[2] || 'switching', drill: DRILL_PRESETS[weak[2] as keyof typeof DRILL_PRESETS]?.scenarios || DRILL_PRESETS.switching.scenarios, reps: '3 sets', duration: '15 min' },
      week4: { focus: 'integration', drill: 'Ranked gameplay with new habits', reps: '3 games', duration: '60 min' },
    },
    dailyRoutine: {
      warmup: 'Start with 5 min of easy tracking (Smooth Sphere), then 5 min of flicks (Reflexshot). Focus on smooth, controlled movements.',
      mainDrill: `Based on your weak points: ${weak[0] || 'tracking'}. Complete 3 sets of ${DRILL_PRESETS[weak[0] as keyof typeof DRILL_PRESETS]?.scenarios || DRILL_PRESETS.tracking.scenarios}. Reset between sets.`,
      cooldown: 'End with 5 min of Gridshot Ultimate to cement muscle memory. Review your scores and note improvements.'
    },
    recommendations: [
      { content: `${isVal ? 'Headshot-only' : 'Spray control'} practice is essential for ${input.game}. Focus on the fundamentals.`, url: 'https://www.youtube.com/results?search_query=ron+rambo+kim+fps+aim+fundamentals' },
      { content: 'Track your progress in Aim Lab weekly to measure improvement.', url: 'https://www.youtube.com/results?search_query=aim+lab+tracking+tutorial' },
    ],
    motivation: skillLevel === 'beginner' 
      ? 'Every pro was once a beginner. Focus on consistency over flashy plays, and improvement will come.'
      : 'You\'ve put in the work. Trust your training, stay confident, and dominate.'
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await generateCoachProfile(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Coach profile generation failed:', error);
    const fallback = getStaticCoachProfile({ game: 'valorant' });
    return NextResponse.json(fallback);
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'POST to /api/coach/system-prompt with player data for AI-powered coaching',
    required: ['game'],
    optional: ['dpi', 'grip', 'aimWeaknesses', 'skillLevel', 'role', 'goals', 'benchmarkScores']
  });
}