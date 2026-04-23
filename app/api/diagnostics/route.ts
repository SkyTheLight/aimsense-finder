import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface AimDiagnosticBody {
  game: string;
  gridshot: number;
  sixshot: number;
  strafeTrack: number;
  sphereTrack: number;
  tracking: number;
  flicking: number;
  switching: number;
  aimStyle?: string;
  mouseGrip?: string;
}

interface WeaknessVideo {
  title: string;
  creator: string;
  query: string;
  why: string;
  focus: string;
  connection: string;
}

interface DiagnosticResult {
  skillTier: string;
  percentile: number;
  aimStyle: string;
  consistency: number;
  microScore: number;
  macroScore: number;
  tensionScore: number;
  strengths: string[];
  weaknesses: string[];
  coachingSummary: string;
  priorityFocus: string;
  improvementPace: string;
  insight: string;
  learningGuidance: {
    category: string;
    objective: string;
    direction: string;
    whyImportant: string;
  }[];
  videos: WeaknessVideo[];
}

const SKILL_TIERS = [
  'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Radiant', 'Pro'
];

const AIM_STYLES = [
  'precision', 'speed', 'hybrid', 'unstable', 'reactive', 'calculated', 'aggressive', 'passive'
];

async function analyzeAimPattern(body: AimDiagnosticBody): Promise<DiagnosticResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  const { gridshot, sixshot, strafeTrack, sphereTrack, aimStyle, mouseGrip } = body;

  if (!apiKey) {
    throw new Error('No API key');
  }

  const avgTracking = (strafeTrack + sphereTrack) / 2;
  const avgFlick = sixshot;
  const avgSwitch = gridshot;

  const microScore = Math.round((avgFlick * 0.6 + avgSwitch * 0.2 + avgTracking * 0.2));
  const macroScore = Math.round((avgSwitch * 0.5 + avgTracking * 0.3 + avgFlick * 0.2));
  const tensionScore = Math.round((avgFlick * 0.3 + avgTracking * 0.4 + avgSwitch * 0.3));

  let skillTier = 'Bronze';
  let percentile = 5;
  const avgScore = (microScore + macroScore + tensionScore) / 3;

  if (avgScore >= 85) { skillTier = 'Pro'; percentile = 99; }
  else if (avgScore >= 75) { skillTier = 'Radiant'; percentile = 95; }
  else if (avgScore >= 65) { skillTier = 'Ascendant'; percentile = 85; }
  else if (avgScore >= 55) { skillTier = 'Diamond'; percentile = 70; }
  else if (avgScore >= 45) { skillTier = 'Platinum'; percentile = 50; }
  else if (avgScore >= 35) { skillTier = 'Gold'; percentile = 30; }
  else if (avgScore >= 25) { skillTier = 'Silver'; percentile = 15; }

  const stylePrompt = `
You are TrueSens, an elite FPS Aim Style Analyst. Analyze this player and return ONE word.

Scores:
- Gridshot (switching): ${gridshot}
- Sixshot (flicking): ${sixshot}
- Strafe Track: ${strafeTrack}
- Smooth Sphere: ${sphereTrack}
- Micro: ${microScore}/100, Macro: ${macroScore}/100, Tension: ${tensionScore}/100

Style: ${aimStyle || 'hybrid'}, Grip: ${mouseGrip || 'palm'}

Choose ONE: ${AIM_STYLES.join(', ')}

Return ONE word only.`;

  const styleResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are TrueSens, an elite FPS Aim Style Analyst. Return ONE word only.' },
        { role: 'user', content: stylePrompt }
      ],
      temperature: 0.3,
      max_tokens: 20,
    }),
  });

  let determinedStyle = 'hybrid';
  if (styleResponse.ok) {
    const styleData = await styleResponse.json();
    const content = styleData.choices?.[0]?.message?.content?.toLowerCase().trim() || '';
    if (AIM_STYLES.includes(content)) {
      determinedStyle = content;
    }
  }

  const consistency = Math.min(100, Math.round(80 - (Math.abs(microScore - macroScore) * 0.5) + (tensionScore * 0.2)));

  const coachingPrompt = `
You are TrueSens, an elite FPS Aim Coach. Analyze this player deeply.

PERFORMANCE DATA:
- Micro Aim: ${microScore}/100 (flick precision, small target accuracy)
- Macro Aim: ${macroScore}/100 (target switching, tracking flow)
- Tension: ${tensionScore}/100 (stability, smoothness)

Raw: Gridshot: ${gridshot} | Sixshot: ${sixshot} | Strafe: ${strafeTrack} | Sphere: ${sphereTrack}
Aim Style: ${determinedStyle}

OUTPUT (JSON only):
{
  "strengths": ["2-3 specific strengths based on their scores"],
  "weaknesses": ["2-3 specific issues based on their scores"],
  "summary": "One sentence coaching profile",
  "priority": "What to train first",
  "pace": "improvement rate (1 word)",
  "insight": "One unique observation about their pattern"
}

Rules:
- Be specific to their numbers
- Never generic
- Sound like a real coach reading their replay`;

  const coachingResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are TrueSens, an elite FPS Aim Coach. Return valid JSON only.' },
        { role: 'user', content: coachingPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    }),
  });

  let strengths: string[] = [];
  let weaknesses: string[] = [];
  let coachingSummary = '';
  let priorityFocus = '';
  let improvementPace = 'moderate';
  let insight = '';

  if (coachingResponse.ok) {
    const data = await coachingResponse.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    try {
      const parsed = JSON.parse(content);
      strengths = parsed.strengths || [];
      weaknesses = parsed.weaknesses || [];
      coachingSummary = parsed.summary || '';
      priorityFocus = parsed.priority || '';
      improvementPace = parsed.pace || 'moderate';
      insight = parsed.insight || '';
    } catch {
      // parse fallback
    }
  }

  if (strengths.length === 0) strengths = ['Clean flicks', 'Good tracking', 'Decent switching'];
  if (weaknesses.length === 0) weaknesses = ['Micro aim accuracy', 'Tracking smoothness'];
  if (!coachingSummary) coachingSummary = `${skillTier} player with ${determinedStyle} aiming style.`;
  if (!priorityFocus) priorityFocus = 'Focus on precision flicks and stability';
  if (!insight) insight = 'Continue practicing to unlock potential';

  const learningGuidance: DiagnosticResult['learningGuidance'] = [];
  const videos: WeaknessVideo[] = [];

  const lowestCategory = microScore < macroScore ? 'micro' : macroScore < microScore ? 'macro' : 'tension';
  const lowestScore = Math.min(microScore, macroScore, tensionScore);

  if (lowestCategory === 'micro' || microScore < 50) {
    learningGuidance.push({
      category: 'Micro Aim',
      objective: 'Improve precision flicks and small target accuracy',
      direction: 'Practice single-target scenarios with focus on perpendicular flicks',
      whyImportant: 'Micro aim score of ' + microScore + ' limits headshot potential'
    });
    
    videos.push({
      title: 'Flick Training | Precision Mechanics',
      creator: 'Ron Rambo Kim',
      query: 'ron+rambo+kim+flick+training+fps+aim',
      why: 'Your flick accuracy needs work based on low sixshot scores',
      focus: 'Watch perpendicular flick techniques and hand placement',
      connection: 'Directly improves micro aim score'
    });
  }

  if (lowestCategory === 'macro' || macroScore < 50) {
    learningGuidance.push({
      category: 'Macro Aim',
      objective: 'Optimize target switching and tracking flow',
      direction: 'Practice Gridshot variants and dynamic tracking scenarios',
      whyImportant: 'Macro aim score of ' + macroScore + ' affects team fight success'
    });
    
    videos.push({
      title: 'Target Switching Optimization',
      creator: 'Kovaaks',
      query: 'kovaaks+target+switching+training',
      why: 'Your switching performance shows room for improvement',
      focus: 'Focus on target prioritization and movement patterns',
      connection: 'Directly improves macro aim score'
    });
  }

  if (lowestCategory === 'tension' || tensionScore < 50) {
    learningGuidance.push({
      category: 'Tension Control',
      objective: 'Reduce hand tension and improve smoothness',
      direction: 'Practice slow scenarios with focus on relaxed grip and smooth movements',
      whyImportant: 'Tension score of ' + tensionScore + ' causes inconsistency'
    });
    
    videos.push({
      title: 'Aim Smoothness & Tension Control',
      creator: 'Viscose',
      query: 'viscose+aim+smoothness+tension+fps',
      why: 'Signs of tension affecting your aim consistency',
      focus: 'Watch grip relaxation and smooth tracking techniques',
      connection: 'Improves overall stability'
    });
  }

  if (videos.length < 3 && avgFlick > 60) {
    videos.push({
      title: 'Advanced Flick Mechanics',
      creator: 'Minigodcs',
      query: 'minigodcs+flick+mechanics+fps',
      why: 'Builds on your strong flick foundation',
      focus: 'Learn advanced flick pathways',
      connection: 'Extends your strengths'
    });
  }

  if (videos.length === 0) {
    videos.push({
      title: 'Aim Fundamentals',
      creator: 'Aim Lab',
      query: 'aim+lab+fundamentals+tutorial',
      why: 'Core fundamentals apply to all skill levels',
      focus: 'Master the basics',
      connection: 'Foundation for improvement'
    });
  }

  return {
    skillTier,
    percentile,
    aimStyle: determinedStyle,
    consistency,
    microScore,
    macroScore,
    tensionScore,
    strengths,
    weaknesses,
    coachingSummary,
    priorityFocus,
    improvementPace,
    insight,
    learningGuidance,
    videos: videos.slice(0, 3)
  };
}

export async function POST(request: Request) {
  try {
    const body: AimDiagnosticBody = await request.json();
    const result = await analyzeAimPattern(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI diagnostics failed:', error);
    
    const fallback: DiagnosticResult = {
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
      learningGuidance: [{
        category: 'General',
        objective: 'Improve overall aim',
        direction: 'Daily practice routine',
        whyImportant: 'Consistent training leads to improvement'
      }],
      videos: [{
        title: 'Aim Fundamentals',
        creator: 'Aim Lab',
        query: 'aim+lab+tutorial+fundamentals',
        why: 'Core skills apply to all players',
        focus: 'Master basic mechanics',
        connection: 'Foundation for growth'
      }]
    };
    
    return NextResponse.json({ ...fallback, fallback: true });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'POST aim diagnostic data to /api/diagnostics',
    required: ['gridshot', 'sixshot', 'strafeTrack', 'sphereTrack'],
    optional: ['aimStyle', 'mouseGrip']
  });
}