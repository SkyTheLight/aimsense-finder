import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type UiCopySection = 'welcome' | 'setup' | 'preset' | 'psa' | 'benchmark' | 'results' | 'warning';

type UiCopyRequest = {
  game: string;
  section?: UiCopySection;
  step?: number;
  hasData?: boolean;
  isLoggedIn?: boolean;
  benchmarkScore?: number;
};

type UiCopyResponse = {
  title: string;
  subtitle: string;
  cta?: string;
  helperText?: string;
};

const SECTION_CONTEXT: Record<string, Record<string, { title: string; subtitle: string }>> = {
  welcome: {
    valorant: { title: 'Find Your Perfect Sens', subtitle: 'AI-powered calibration for fraggers' },
    cs2: { title: 'Find Your Perfect Sens', subtitle: 'Precision calibration for clutch players' },
  },
  setup: {
    valorant: { title: 'Setup Your Gear', subtitle: 'Your hardware defines your baseline' },
    cs2: { title: 'Setup Your Gear', subtitle: 'Know your hardware, own your aim' },
  },
  preset: {
    valorant: { title: 'Choose Your Style', subtitle: 'Pro presets refined for your playstyle' },
    cs2: { title: 'Choose Your Style', subtitle: 'Find the pro settings that match you' },
  },
  psa: {
    valorant: { title: 'PSA Calibration', subtitle: 'The method behind the madness' },
    cs2: { title: 'Fine-Tune Your Sens', subtitle: 'Dial in your perfect feel' },
  },
  benchmark: {
    valorant: { title: 'Test Your Aim', subtitle: 'Let the scores speak truth' },
    cs2: { title: 'Test Your Aim', subtitle: 'Benchmark your actual skill' },
  },
  results: {
    valorant: { title: 'Your Optimal Sens', subtitle: 'The number that unlocks your potential' },
    cs2: { title: 'Your Optimal Sens', subtitle: 'Precision calibrated to your playstyle' },
  },
  warning: {
    valorant: { title: '7-Day Warning', subtitle: 'Muscle memory takes time. Trust the process.' },
    cs2: { title: 'Lock It In', subtitle: 'Consistency wins. Patience is skill.' },
  },
};

async function fetchUiCopyFromAI(input: UiCopyRequest): Promise<UiCopyResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return getStaticCopy(input);
  }

  const section = input.section || 'welcome';
  const isVal = input.game === 'valorant';
  const tone = isVal ? 'aggressive, competitive, precise' : 'technical, analytical, methodical';
  
  const contextHints: string[] = [];
  if (input.isLoggedIn) contextHints.push('signed-in user');
  if (input.hasData) contextHints.push('has previous data');
  if (input.benchmarkScore && input.benchmarkScore > 60) contextHints.push('high performer');
  if (input.benchmarkScore && input.benchmarkScore < 40) contextHints.push('beginner');
  
  const hint = contextHints.length ? `Context: ${contextHints.join(', ')}` : '';

  const prompt = `You are TrueSens, an elite FPS Sensitivity Analyst UI copy generator.
Generate premium UI copy for the "${section}" section of a ${tone} FPS sensitivity calibration app.
${hint}

RULES:
- Title: 3-7 words, action-oriented
- Subtitle: 8-15 words, benefit-focused
- If section is results: include confidence level language
- If section is warning: use strong, urgent but encouraging tone

Return JSON:
{"title": "...", "subtitle": "...", "cta": "button text (optional)", "helperText": "helper text (optional)"}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You generate premium UI copy for esports products.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150,
        response_format: { type: 'json_object' }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content?.trim() || '';
      
      try {
        const parsed = JSON.parse(content);
        if (parsed.title && parsed.subtitle && parsed.title.length > 2) {
          return parsed as UiCopyResponse;
        }
      } catch {
        // continue to fallback
      }
    }
  } catch {
    // continue to fallback
  }

  return getStaticCopy(input);
}

function getStaticCopy(input: UiCopyRequest): UiCopyResponse {
  const section = input.section || 'welcome';
  const game = input.game || 'valorant';
  
  const defaults = SECTION_CONTEXT[section]?.[game] || SECTION_CONTEXT.welcome.valorant;
  
  let cta: string | undefined;
  let helperText: string | undefined;
  
  switch (section) {
    case 'welcome':
      cta = 'Start Calibration';
      helperText = 'Takes ~3 minutes';
      break;
    case 'setup':
      cta = input.isLoggedIn ? undefined : 'Sign in to save';
      break;
    case 'results':
      cta = 'Accept & Continue';
      helperText = 'Your AI-generated sensitivity is ready';
      break;
    case 'warning':
      cta = 'I Accept & Continue';
      break;
    default:
      cta = 'Continue';
  }
  
  return {
    ...defaults,
    cta,
    helperText,
  };
}

export async function POST(request: Request) {
  try {
    const body: UiCopyRequest = await request.json();
    const copy = await fetchUiCopyFromAI(body);
    return NextResponse.json(copy);
  } catch (error) {
    console.error('UI copy generation failed:', error);
    return NextResponse.json(getStaticCopy({ game: 'valorant' }));
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'POST to /api/ui-copy with { game, section, step, hasData, isLoggedIn, benchmarkScore }',
    sections: ['welcome', 'setup', 'preset', 'psa', 'benchmark', 'results', 'warning']
  });
}