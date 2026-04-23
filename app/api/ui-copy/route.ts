import { NextResponse } from 'next/server';

type UiCopySection = 'welcome' | 'setup' | 'preset' | 'psa' | 'benchmark' | 'results' | 'warning';

type UiCopyRequest = {
  game: string;
  section?: UiCopySection;
  step?: number;
  hasData?: boolean;
  isLoggedIn?: boolean;
  benchmarkScore?: number;
};

const STATIC: Record<string, Record<string, { title: string; subtitle: string }>> = {
  welcome: {
    valorant: { title: 'Find Your Perfect Sens', subtitle: 'AI-powered calibration for fraggers' },
    cs2: { title: 'Find Your Perfect Sens', subtitle: 'Precision calibration for clutch players' },
  },
  results: {
    valorant: { title: 'Your Optimal Sens', subtitle: 'The number that unlocks your potential' },
    cs2: { title: 'Your Optimal Sens', subtitle: 'Precision calibrated to your playstyle' },
  },
};

async function fetchUiCopy(input: UiCopyRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const tone = input.game === 'valorant' ? 'aggressive' : 'methodical';
  const hint = input.isLoggedIn ? 'signed-in' : input.hasData ? 'returning' : 'new';

  const prompt = `Generate premium UI copy for "${input.section || 'welcome'}" section. ${tone} FPS app. ${hint} user.
Return JSON: {"title": "...", "subtitle": "..."}`;

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

function getStaticCopy(input: UiCopyRequest) {
  const section = input.section || 'welcome';
  const game = input.game || 'valorant';
  return STATIC[section]?.[game] || { title: 'Find Your Sens', subtitle: 'AI-powered calibration' };
}

export async function POST(request: Request) {
  try {
    const body: UiCopyRequest = await request.json();
    const copy = await fetchUiCopy(body);
    return NextResponse.json(copy || getStaticCopy(body));
  } catch (error) {
    console.error('UI copy failed:', error);
    return NextResponse.json(getStaticCopy({ game: 'valorant' }));
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST to /api/ui-copy' });
}