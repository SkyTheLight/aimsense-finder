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

const GAME_NAMES: Record<string, string> = {
  valorant: 'Valorant',
  cs2: 'Counter-Strike 2',
};

const SENSITIVITY_LABELS: Record<string, string> = {
  control: 'Control (Low Sensitivity)',
  balanced: 'Balanced',
  speed: 'Speed (High Sensitivity)',
};

async function generateAITips(body: TipContext): Promise<string[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('No OpenAI API key');
  }

  const { game, edpi, cm360, label, tracking, flicking, switching, aimStyle, mouseGrip } = body;
  const gameName = GAME_NAMES[game] || 'FPS';
  const sensitivityLabel = SENSITIVITY_LABELS[label] || 'Balanced';
  const weakest = tracking <= flicking && tracking <= switching ? 'tracking' : flicking <= switching ? 'flicking' : 'target switching';
  const strongest = tracking >= flicking && tracking >= switching ? 'tracking' : flicking >= switching ? 'flicking' : 'target switching';
  
  const prompt = `You are an elite FPS Sensitivity Analyst and Aim Coach. Analyze this player and give exactly 4 personalized coaching tips.

PLAYER DATA:
- Game: ${gameName}
- eDPI: ${edpi}, cm/360: ${cm360.toFixed(2)}
- Sensitivity Type: ${sensitivityLabel} 
- Mouse Grip: ${mouseGrip}
- Aim Style: ${aimStyle}
- Performance: Tracking ${tracking}/100, Flicking ${flicking}/100, Switching ${switching}/100
- Strongest: ${strongest}, Weakest: ${weakest}

RESPONSE FORMAT (STRICT):
Each tip on a new line. No labels. No bullets. Just direct advice.
Make it feel personalized and intelligent. Sound like a real coach.
Keep each tip under 15 words.
Do NOT use GOOD/WATCH/ADVICE labels.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are TrueSens, an elite FPS Sensitivity Analyst and Aim Coach. You help players find their optimal sensitivity and improve their aim. Be direct, smart, and personalized. Never generic.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 400,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API failed');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  
  const tips = content
    .split('\n')
    .map((line: string) => line.replace(/^[\d\.\)\-\s•]+/, '').trim())
    .filter((line: string) => line.length > 5 && line.length < 150)
    .slice(0, 4);

  return tips;
}

async function generatePracticeTip(body: TipContext): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('No OpenAI API key');
  }

  const { game, edpi, cm360, label, tracking, flicking, switching, aimStyle } = body;
  const gameName = GAME_NAMES[game] || 'FPS';
  const sensitivityLabel = SENSITIVITY_LABELS[label] || 'Balanced';
  const weakest = tracking <= flicking && tracking <= switching ? 'tracking' : flicking <= switching ? 'flicking' : 'target switching';
  
  const prompt = `You are an elite FPS Aim Coach. Give ONE specific practice recommendation.

Player: ${gameName}, ${sensitivityLabel}, weakest skill: ${weakest}, eDPI: ${edpi}

Format: Start with a verb. Under 12 words. Be specific.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are TrueSens, an elite FPS Aim Coach. Short, actionable practice tips only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 100,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API failed');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || 'Practice daily to improve consistency.';
}

export async function POST(request: Request) {
  try {
    const body: TipContext = await request.json();
    
    const [tips, practiceTip] = await Promise.all([
      generateAITips(body).catch(() => []),
      generatePracticeTip(body).catch(() => 'Practice daily to improve consistency.')
    ]);

    return NextResponse.json({ tips, practiceTip });
  } catch (error) {
    console.error('Tips API error:', error);
    return NextResponse.json(
      { tips: ['Focus on consistency over raw skill.', 'Warm up before ranked matches.', 'Film your gameplay to analyze mistakes.', 'Train your weakest skill daily.'], practiceTip: 'Practice daily to improve consistency.' },
      { status: 200 }
    );
  }
}