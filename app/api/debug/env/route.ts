import { NextResponse } from 'next/server';

export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  const keyPreview = hasKey 
    ? `${process.env.OPENAI_API_KEY?.substring(0, 20)}...`
    : 'NOT FOUND';
  
  const status = {
    openaiKeyLoaded: hasKey,
    keyPrefix: keyPreview,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'local',
  };

  console.log('[Debug] Env status:', status);

  if (!hasKey) {
    return NextResponse.json({ 
      error: 'OPENAI_API_KEY not found in environment',
      ...status 
    }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return NextResponse.json({ 
        success: true,
        message: 'OpenAI API key is valid',
        ...status 
      });
    } else {
      const error = await response.text();
      return NextResponse.json({ 
        error: 'OpenAI API key is invalid',
        status: response.status,
        details: error,
        ...status 
      }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ 
      error: 'Failed to connect to OpenAI',
      details: String(err),
      ...status 
    }, { status: 500 });
  }
}