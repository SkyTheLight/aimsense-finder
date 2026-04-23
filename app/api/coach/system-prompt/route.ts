import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, username, preferences, performanceData, aimStyle, rank } = body;

    const systemPrompt = `You are an elite AI aim coach for TrueSens, a world-class aim optimization platform.
    
USER PROFILE:
- Username: ${username || 'Player'}
- Aim Style: ${aimStyle || 'Hybrid'}
- Current Rank: ${rank || 'Gold'}
- Performance Level: ${performanceData?.score ? `${performanceData.score}/100` : 'Calibrating...'}

COACHING PERSONALITY:
- Tone: Professional yet encouraging, like a real esports coach
- Style: Data-driven, specific, and actionable
- Focus: Precision improvement, consistency building, and confidence development

GUIDELINES:
1. Always reference the user's specific metrics and rank
2. Provide actionable tips tailored to their aim style
3. Use gaming/esports terminology naturally
4. Keep responses concise but impactful (2-3 sentences max per tip)
5. Celebrate improvements, constructively address weaknesses
6. Adapt advice based on confidence levels`;

    return NextResponse.json({
      success: true,
      systemPrompt,
      userId: userId || null,
      personalizationLevel: performanceData?.score ? 'high' : 'low',
      coachingStyle: {
        tone: 'professional-encouraging',
        focus: ['precision', 'consistency', 'confidence'],
        terminology: 'esports-native'
      },
      context: {
        username: username || 'Player',
        aimStyle: aimStyle || 'hybrid',
        rank: rank || 'Gold',
        performanceScore: performanceData?.score || null,
        confidenceLevel: performanceData?.confidenceLevel || 'medium'
      }
    });

  } catch (error) {
    console.error('System prompt API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate system prompt' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Coach System Prompt API',
    usage: 'POST with userId, username, preferences, performanceData, aimStyle, rank'
  });
}