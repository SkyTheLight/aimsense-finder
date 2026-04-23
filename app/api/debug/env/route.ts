import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'No GROQ_API_KEY', env: Object.keys(process.env).filter(k => k.includes('KEY')) });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        input: 'Return ONLY JSON: {"status":"ok"}'
      }),
    });

    const data = await response.json();
    const msg = data.output?.find((o: { type: string }) => o.type === 'message');
    const content = msg?.content?.[0]?.text?.trim() || '';
    
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json({ success: true, result: parsed });
    } catch {
      return NextResponse.json({ success: false, raw: content, data: JSON.stringify(data).substring(0, 200) });
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) });
  }
}