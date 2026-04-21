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
}

const GAME_TIPS: Record<string, string[]> = {
  valorant: [
    'Work on jiggle peeking - essential for Valorant',
    'Practice counter-strafing until it\'s muscle memory',
    'Micro-adjustments are key - your crosshair placement matters more than flicks',
    'Learn anchor points on each site',
    'Practice spray control on the vandal - it\'s different from CS2',
  ],
  cs2: [
    'Master spray patterns - they\'re essential in CS2',
    'Practice peeking wide to deny enemy crosshair placement',
    'Work on counter-strafing for instant stops',
    'Learn common smoke lineups for each map',
    'Prefiring common angles will win you duels',
  ],
  apex: [
    'Tracking is everything in Apex - practice sustained aim',
    'Learn to lead your shots with projectile weapons',
    'Movement + aim = success - practice mobility drills',
    'Hip-fire accuracy matters close range',
    'Work on tracking while strafing',
  ],
  overwatch2: [
    'Heroes have different aim requirements - practice accordingly',
    'Tracking heroes need smooth, continuous movement',
    'Hitscan vs projectile - know which heroes you\'re best at',
    'Headshots matter more than bodyshots',
    'Practice in deathmatch to warm up',
  ],
  cod: [
    'SMG players need fast tracking - practice close range',
    'AR players should focus on burst fire accuracy',
    'Aim assist is real - use it to your advantage',
    'Slide-cancel movement adds to your lethality',
    'Quick scoping is essential for snipers',
  ],
  r6: [
    'Lean mechanics are essential - practice quick peeks',
    'Headshots are 1-shot most operators',
    'Pre-aiming common spots will win you engagements',
    'Vertical play - practice spawn peeking',
    'Drone before pushing - information wins rounds',
  ],
};

const LABEL_TIPS: Record<string, string[]> = {
  control: [
    'Your lower sensitivity is great for precision - use it to hit headshots',
    'Arm aiming takes time to master - keep practicing smooth movements',
    'Pre-aim corners with your control sens - it\'s your strength',
    'Don\'t rush flicks - let enemies come to your crosshair',
  ],
  balanced: [
    'You have versatility - adapt your playstyle to the situation',
    'Practice both flicking and tracking to maintain your balance',
    'Quick peeks work well with your sensitivity',
    'You can play any role - find what feels natural',
  ],
  speed: [
    'Your fast sensitivity is great for aggressive plays',
    'Focus on quick reactions and fast tracking',
    'Close-quarter fights are your best friend',
    'Use movement to compensate for lower precision',
  ],
};

const BENCHMARK_TIPS = {
  low: {
    tracking: 'Focus on smooth tracking in Aim Lab - try Strafe Track',
    flicking: 'Practice flicks in Microshot - start slow, build speed',
    switching: 'Gridshot is your friend - rapid target switching',
  },
  medium: {
    tracking: 'Good tracking! Push for smoother movements in tracking scenarios',
    flicking: 'Nice flicks! Work on consistency under pressure',
    switching: 'Solid switching! Keep grinding Gridshot for faster transitions',
  },
  high: {
    tracking: 'Excellent tracking - you\'re ready for any tracking-heavy hero',
    flicking: 'Deadly flicks! Focus on precision over speed now',
    switching: 'Elite target switching! Maintain this in real matches',
  },
};

const PERSONALITY_TIPS = [
  'Remember: aim is a skill that takes time to develop',
  'Bad days happen - don\'t tilt and switch settings',
  'Warm up for 15 min before competitive play',
  'Focus on one improvement per gaming session',
  'Film your gameplay to analyze mistakes objectively',
  'Crosshair placement > aim - always be ready to shoot',
  'Game sense and positioning matter as much as raw aim',
  'Take breaks to avoid fatigue - tired aim = bad aim',
  'Trust your settings once you\'ve found what works',
  'The best players make it look easy - they just practiced more',
];

export async function POST(request: Request) {
  try {
    const body: TipContext = await request.json();
    const { game, edpi, cm360, label, tracking, flicking, switching, aimStyle, mouseGrip } = body;

    const tips: string[] = [];

    // Game-specific tips (add 1-2)
    const gameSpecific = GAME_TIPS[game] || GAME_TIPS.valorant;
    tips.push(gameSpecific[Math.floor(Math.random() * gameSpecific.length)]);

    // Sensitivity type tips (add 1)
    const labelSpecific = LABEL_TIPS[label] || LABEL_TIPS.balanced;
    tips.push(labelSpecific[Math.floor(Math.random() * labelSpecific.length)]);

    // Benchmark-based tips (add 1-2 based on lowest scores)
    const scores = [
      { name: 'tracking', value: tracking },
      { name: 'flicking', value: flicking },
      { name: 'switching', value: switching },
    ].sort((a, b) => a.value - b.value);

    const lowestCategory = scores[0].name as 'tracking' | 'flicking' | 'switching';
    const lowestScore = scores[0].value;
    
    if (lowestScore < 40) {
      tips.push(BENCHMARK_TIPS.low[lowestCategory]);
    } else if (lowestScore < 60) {
      tips.push(BENCHMARK_TIPS.medium[lowestCategory]);
    } else {
      tips.push(BENCHMARK_TIPS.high[lowestCategory]);
    }

    // Add general personality tip
    tips.push(PERSONALITY_TIPS[Math.floor(Math.random() * PERSONALITY_TIPS.length)]);

    // Add grip-specific tip
    if (mouseGrip === 'claw') {
      tips.push('Claw grip gives quick movements - perfect for aggressive plays');
    } else if (mouseGrip === 'palm') {
      tips.push('Palm grip offers stability - great for controlled aim');
    } else if (mouseGrip === 'fingertip') {
      tips.push('Fingertip grip allows precise micro-adjustments - capitalize on it');
    }

    // Add aim style specific advice
    if (aimStyle === 'flick') {
      tips.push('Flick shooters: clean your mousepad and desk for fast movements');
    } else if (aimStyle === 'tracking') {
      tips.push('Trackers: smooth is key - avoid jerky movements');
    } else {
      tips.push('Balanced players: you can adapt - pick your battles wisely');
    }

    return NextResponse.json({ tips });
  } catch {
    return NextResponse.json({ tips: PERSONALITY_TIPS.slice(0, 3) }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    tips: PERSONALITY_TIPS.slice(0, 3),
    message: 'POST to /api/tips with your data for personalized tips'
  });
}