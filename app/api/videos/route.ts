import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type VideoItem = {
  title: string;
  creator: string;
  query: string;
  url: string;
  note?: string;
};

type VideoRequest = {
  weaknesses: string[];
  game?: string;
};

const YOUTUBE_SEARCH_BASE = 'https://www.youtube.com/results?search_query=';

function toSearchUrl(query: string): string {
  return YOUTUBE_SEARCH_BASE + encodeURIComponent(query);
}

async function generateVideos(body: VideoRequest): Promise<VideoItem[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  const { weaknesses, game } = body;
  
  if (!apiKey || weaknesses.length === 0) {
    return getStaticVideos(weaknesses);
  }

  const prompt = `You are TrueSens, an elite FPS Aim Coach. Suggest 3-5 YouTube video recommendations.

Player weaknesses: ${weaknesses.join(', ')}
Game: ${game || 'FPS'}

For each weakness, suggest a video with:
- Creator name (real FPS coaches like Ron Rambo Kim, Viscose, aimlab, kovaaks)
- Title that matches their weakness
- Why it helps them specifically

Return JSON:
{
  "videos": [
    {
      "title": "video title",
      "creator": "creator name",
      "query": "search query",
      "note": "why this helps this player"
    }
  ]
}`;

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
          { role: 'system', content: 'You are TrueSens, an elite FPS Aim Coach. Return valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 600,
        response_format: { type: 'json_object' }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      try {
        const parsed = JSON.parse(content);
        if (parsed.videos && Array.isArray(parsed.videos)) {
          return parsed.videos.map((v: VideoItem) => ({
            ...v,
            url: toSearchUrl(v.query || v.title)
          })).slice(0, 6);
        }
      } catch {
        // fallback
      }
    }
  } catch {
    // fallback
  }

  return getStaticVideos(weaknesses);
}

function getStaticVideos(weaknesses: string[]): VideoItem[] {
  const videos: VideoItem[] = [];
  
  for (const w of weaknesses) {
    const normalized = w.toLowerCase();
    
    if (normalized.includes('micro') || normalized.includes('flick') || normalized.includes('precision')) {
      videos.push(
        { title: 'Flick Training & Precision Mechanics', creator: 'Ron Rambo Kim', query: 'ron+rambo+kim+flick+training+fps', url: toSearchUrl('ron rambo kim flick training'), note: w },
        { title: 'Micro Aim Fundamentals', creator: 'Kovaaks', query: 'kovaaks+micro+aim+training', url: toSearchUrl('kovaaks micro aim training'), note: w }
      );
    }
    
    if (normalized.includes('macro') || normalized.includes('switch') || normalized.includes('tracking')) {
      videos.push(
        { title: 'Target Switching Optimization', creator: 'Kovaaks', query: 'target+switching+optimization+fps', url: toSearchUrl('target switching optimization fps'), note: w }
      );
    }
    
    if (normalized.includes('tension') || normalized.includes('smooth') || normalized.includes('stability')) {
      videos.push(
        { title: 'Aim Smoothness & Tension Control', creator: 'Viscose', query: 'viscose+aim+smoothness+tension+fps', url: toSearchUrl('viscose aim smoothness tension control'), note: w }
      );
    }
  }
  
  if (videos.length === 0) {
    videos.push(
      { title: 'Aim Training Fundamentals', creator: 'Aim Lab', query: 'aim+lab+fundamentals+tutorial', url: toSearchUrl('aim lab fundamentals tutorial'), note: 'General improvement' }
    );
  }
  
  return videos.slice(0, 6);
}

export async function POST(request: Request) {
  try {
    const body: VideoRequest = await request.json();
    const videos = await generateVideos(body);
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Videos generation failed:', error);
    return NextResponse.json({ videos: [] as VideoItem[] });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST to /api/videos with { weaknesses: string[] }' });
}