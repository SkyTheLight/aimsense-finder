import { NextResponse } from 'next/server';

export async function GET() {
  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    groqKeyExists: !!groqKey,
    groqKeyPrefix: groqKey ? `${groqKey.substring(0, 15)}...` : 'MISSING',
    openaiKeyExists: !!openaiKey,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });
}