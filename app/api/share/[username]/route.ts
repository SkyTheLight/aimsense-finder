import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const username = params.username?.toLowerCase();
  
  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { username },
    include: {
      settings: {
        where: { isCurrent: true },
        take: 1,
      },
    },
  });

  if (!user || user.settings.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const setting = user.settings[0];

  return NextResponse.json({
    username: user.username,
    game: setting.game,
    dpi: setting.dpi,
    sensitivity: Number(setting.sensitivity),
    edpi: setting.edpi,
    cm360: Number(setting.cm360),
    mouseGrip: setting.mouseGrip,
    aimStyle: setting.aimStyle,
    label: setting.sensitivity < 0.5 ? 'control' : setting.sensitivity > 1.5 ? 'speed' : 'balanced',
  });
}