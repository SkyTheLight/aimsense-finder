import { NextResponse } from 'next/server';

type VideoRequest = {
  weaknesses: string[];
  game?: string;
};

const YOUTUBE_SEARCH = 'https://www.youtube.com/results?search_query=';

async function generateVideos(body: VideoRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || body.weaknesses.length === 0) return getStaticVideos(body.weaknesses);

  const prompt = `You are TrueSens, elite FPS Coach. Suggest 3-5 YouTube videos for these weaknesses: ${body.weaknesses.join(', ')}

Return JSON:
{
  "videos": [
    { "title": "video title", "creator": "real creator", "query": "search query", "note": "why this helps" }
  ]
}`;

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

    if (!response.ok) return getStaticVideos(body.weaknesses);

    const data = await response.json();
    const content = data?.output?.[0]?.content?.[0]?.text?.trim();
    if (!content) return getStaticVideos(body.weaknesses);

    const parsed = JSON.parse(content);
    if (parsed.videos) {
      return parsed.videos.map((v: { title: string; creator: string; query: string; note?: string }) => ({
        ...v,
        url: YOUTUBE_SEARCH + encodeURIComponent(v.query)
      }));
    }
  } catch {
    return getStaticVideos(body.weaknesses);
  }

  return getStaticVideos(body.weaknesses);
}

function getStaticVideos(weaknesses: string[]) {
  const videos = [];
  for (const w of weaknesses) {
    const n = w.toLowerCase();
    if (n.includes('flick') || n.includes('micro')) {
      videos.push({ title: 'Flick Training', creator: 'Ron Rambo Kim', query: 'ron+rambo+kim+flick+training', url: YOUTUBE_SEARCH + 'ron+rambo+kim+flick', note: w });
    }
    if (n.includes('track')) {
      videos.push({ title: 'Smooth Tracking', creator: 'Viscose', query: 'viscose+aim+smoothness', url: YOUTUBE_SEARCH + 'viscose+aim+smoothness', note: w });
    }
  }
  if (videos.length === 0) {
    videos.push({ title: 'Aim Fundamentals', creator: 'Aim Lab', query: 'aim+lab+fundamentals', url: YOUTUBE_SEARCH + 'aim+lab+fundamentals', note: 'Core skills' });
  }
  return videos.slice(0, 5);
}

export async function POST(request: Request) {
  try {
    const body: VideoRequest = await request.json();
    const videos = await generateVideos(body);
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Videos failed:', error);
    return NextResponse.json({ videos: [] });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST { weaknesses: [] } to /api/videos' });
}