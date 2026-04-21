import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const PRO_PLAYERS_DATA = {
  valorant: [
    { name: 'TenZ', dpi: 800, sens: 0.28, edpi: 224, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'NA' },
    { name: 'Derke', dpi: 800, sens: 0.35, edpi: 280, role: 'duelist', aimStyle: 'balanced', grip: 'palm', country: 'EU' },
    { name: 'Asuna', dpi: 1600, sens: 0.22, edpi: 352, role: 'duelist', aimStyle: 'tracking', grip: 'fingertip', country: 'NA' },
    { name: 'Chronicle', dpi: 800, sens: 0.3, edpi: 240, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'EU' },
    { name: 'Aspas', dpi: 800, sens: 0.32, edpi: 256, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'BR' },
    { name: 'Yay', dpi: 800, sens: 0.38, edpi: 304, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'NA' },
    { name: 'Cned', dpi: 400, sens: 0.6, edpi: 240, role: 'duelist', aimStyle: 'balanced', grip: 'palm', country: 'EU' },
    { name: 'Cry', dpi: 800, sens: 0.4, edpi: 320, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'KR' },
    { name: 'ScreaM', dpi: 800, sens: 0.28, edpi: 224, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'EU' },
    { name: 'zekken', dpi: 800, sens: 0.31, edpi: 248, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'NA' },
    { name: 'Demon1', dpi: 1600, sens: 0.2, edpi: 320, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'NA' },
    { name: 'Jawgemo', dpi: 800, sens: 0.35, edpi: 280, role: 'duelist', aimStyle: 'balanced', grip: 'palm', country: 'NA' },
    { name: 'Crashies', dpi: 800, sens: 0.26, edpi: 208, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'NA' },
    { name: 'Nivera', dpi: 800, sens: 0.25, edpi: 200, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'EU' },
    { name: 'Hik0', dpi: 800, sens: 0.33, edpi: 264, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'KR' },
  ],
  cs2: [
    { name: 's1mple', dpi: 400, sens: 1.1, edpi: 440, role: 'awper', aimStyle: 'flick', grip: 'claw', country: 'UA' },
    { name: 'ZywOo', dpi: 400, sens: 0.9, edpi: 360, role: 'rifler', aimStyle: 'balanced', grip: 'palm', country: 'FR' },
    { name: 'm0NESY', dpi: 400, sens: 1.05, edpi: 420, role: 'awper', aimStyle: 'flick', grip: 'claw', country: 'RU' },
    { name: 'NiKo', dpi: 800, sens: 0.55, edpi: 440, role: 'rifler', aimStyle: 'flick', grip: 'claw', country: 'BA' },
    { name: 'donk', dpi: 800, sens: 0.6, edpi: 480, role: 'rifler', aimStyle: 'flick', grip: 'claw', country: 'RU' },
    { name: 'Jame', dpi: 400, sens: 1.4, edpi: 560, role: 'awper', aimStyle: 'control', grip: 'palm', country: 'KZ' },
    { name: 'Broky', dpi: 800, sens: 0.7, edpi: 560, role: 'awper', aimStyle: 'balanced', grip: 'claw', country: 'LV' },
    { name: 'Electronic', dpi: 800, sens: 0.6, edpi: 480, role: 'rifler', aimStyle: 'flick', grip: 'claw', country: 'BY' },
    { name: 'XANTARES', dpi: 400, sens: 1.6, edpi: 640, role: 'rifler', aimStyle: 'flick', grip: 'claw', country: 'TR' },
    { name: 'FURIA', dpi: 800, sens: 0.5, edpi: 400, role: 'rifler', aimStyle: 'balanced', grip: 'palm', country: 'BR' },
    { name: 'KSCERER', dpi: 400, sens: 1.8, edpi: 720, role: 'rifler', aimStyle: 'control', grip: 'arm', country: 'DE' },
  ],
  apex: [
    { name: 'ImperialHal', dpi: 1600, sens: 0.6, edpi: 960, role: 'entry', aimStyle: 'tracking', grip: 'claw', country: 'NA' },
    { name: 'ApexMatches', dpi: 800, sens: 1.0, edpi: 800, role: 'fragger', aimStyle: 'balanced', grip: 'palm', country: 'EU' },
    { name: 'Skadoodle', dpi: 800, sens: 1.4, edpi: 1120, role: 'support', aimStyle: 'tracking', grip: 'claw', country: 'NA' },
    { name: 'Noc', dpi: 800, sens: 0.9, edpi: 720, role: 'fragger', aimStyle: 'balanced', grip: 'palm', country: 'KR' },
    { name: 'Shawn', dpi: 1600, sens: 0.5, edpi: 800, role: 'entry', aimStyle: 'tracking', grip: 'fingertip', country: 'NA' },
    { name: 'Genburten', dpi: 800, sens: 1.2, edpi: 960, role: 'fragger', aimStyle: 'tracking', grip: 'claw', country: 'NA' },
  ],
  overwatch2: [
    { name: 'Fleta', dpi: 800, sens: 5.0, edpi: 4000, role: 'dps', aimStyle: 'tracking', grip: 'claw', country: 'KR' },
    { name: 'Profit', dpi: 800, sens: 6.0, edpi: 4800, role: 'dps', aimStyle: 'tracking', grip: 'claw', country: 'KR' },
    { name: 'Starladder', dpi: 1600, sens: 2.5, edpi: 4000, role: 'dps', aimStyle: 'balanced', grip: 'palm', country: 'EU' },
    { name: 'KSPN', dpi: 800, sens: 3.5, edpi: 2800, role: 'dps', aimStyle: 'flick', grip: 'claw', country: 'KR' },
  ],
  cod: [
    { name: 'Scump', dpi: 800, sens: 6.0, edpi: 4800, role: 'smg', aimStyle: 'tracking', grip: 'claw', country: 'NA' },
    { name: 'Formal', dpi: 800, sens: 5.0, edpi: 4000, role: 'ar', aimStyle: 'balanced', grip: 'palm', country: 'NA' },
    { name: 'Dashy', dpi: 800, sens: 7.0, edpi: 5600, role: 'ar', aimStyle: 'flick', grip: 'claw', country: 'NA' },
    { name: 'Shotzzy', dpi: 1600, sens: 3.5, edpi: 5600, role: 'smg', aimStyle: 'tracking', grip: 'fingertip', country: 'NA' },
  ],
  r6: [
    { name: 'Pengu', dpi: 800, sens: 0.7, edpi: 560, role: 'entry', aimStyle: 'flick', grip: 'claw', country: 'EU' },
    { name: 'Rios', dpi: 800, sens: 0.8, edpi: 640, role: 'entry', aimStyle: 'flick', grip: 'claw', country: 'BR' },
    { name: 'Going', dpi: 800, sens: 0.5, edpi: 400, role: 'anchor', aimStyle: 'control', grip: 'palm', country: 'KR' },
    { name: 'Shroud', dpi: 800, sens: 0.6, edpi: 480, role: 'flex', aimStyle: 'balanced', grip: 'claw', country: 'NA' },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get('game') || 'valorant';
  const userEDPI = parseInt(searchParams.get('edpi') || '280');
  const aimStyle = searchParams.get('aimStyle') || 'balanced';
  const mouseGrip = searchParams.get('grip') || 'claw';

  const players = PRO_PLAYERS_DATA[game as keyof typeof PRO_PLAYERS_DATA] || PRO_PLAYERS_DATA.valorant;

  const scoredPlayers = players.map(player => {
    let score = 0;

    const edpiDiff = Math.abs(player.edpi - userEDPI);
    score += Math.max(0, 100 - edpiDiff);

    if (player.aimStyle === aimStyle) score += 50;
    if (player.grip === mouseGrip) score += 30;

    return { ...player, matchScore: score };
  });

  scoredPlayers.sort((a, b) => b.matchScore - a.matchScore);

  const top5 = scoredPlayers.slice(0, 5);

  return NextResponse.json({
    game,
    userSettings: { edpi: userEDPI, aimStyle, mouseGrip },
    recommendations: top5,
    closest: top5[0],
  });
}