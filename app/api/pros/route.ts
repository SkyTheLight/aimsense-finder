import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GAME_PLAYER_URLS = {
  valorant: 'https://prosettings.net/players-list/valorant/',
  cs2: 'https://prosettings.net/players-list/cs2/',
  apex: 'https://prosettings.net/players-list/apex-legends/',
  overwatch2: 'https://prosettings.net/players-list/overwatch-2/',
  cod: 'https://prosettings.net/players-list/call-of-duty-warzone/',
  r6: 'https://prosettings.net/players-list/rainbow-six-siege/',
};

const PLAYER_DETAIL_URLS: Record<string, string> = {
  tenz: 'https://prosettings.net/players/tenz/',
  derke: 'https://prosettings.net/players/derke/',
  asuna: 'https://prosettings.net/players/asuna/',
  chronicle: 'https://prosettings.net/players/chronicle/',
  aspas: 'https://prosettings.net/players/aspas/',
  yay: 'https://prosettings.net/players/yay/',
  cned: 'https://prosettings.net/players/cned/',
  scream: 'https://prosettings.net/players/scream/',
  zekken: 'https://prosettings.net/players/zekken/',
  demon1: 'https://prosettings.net/players/demon1/',
  jawgemo: 'https://prosettings.net/players/jawgemo/',
  s1mple: 'https://prosettings.net/players/s1mple/',
  zywoo: 'https://prosettings.net/players/zywoo/',
  monesy: 'https://prosettings.net/players/m0nesy/',
  niko: 'https://prosettings.net/players/niko/',
  donk: 'https://prosettings.net/players/donk/',
  jame: 'https://prosettings.net/players/jame/',
  broky: 'https://prosettings.net/players/broky/',
  electronic: 'https://prosettings.net/players/electronic/',
  xantares: 'https://prosettings.net/players/xantares/',
  imperialhal: 'https://prosettings.net/players/imperialhal/',
  genburten: 'https://prosettings.net/players/genburten/',
  fleta: 'https://prosettings.net/players/fleta/',
  profit: 'https://prosettings.net/players/profit/',
  scump: 'https://prosettings.net/players/scump/',
  pengu: 'https://prosettings.net/players/pengu/',
  shroud: 'https://prosettings.net/players/shroud/',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get('game') || 'valorant';
  const userEDPI = parseInt(searchParams.get('edpi') || '280');
  const aimStyle = searchParams.get('aimStyle') || 'balanced';
  const mouseGrip = searchParams.get('grip') || 'claw';

  const knownPlayers = getKnownPlayers(game);
  
  const scoredPlayers = knownPlayers.map(player => {
    let score = 0;

    const edpiDiff = Math.abs(player.edpi - userEDPI);
    score += Math.max(0, 150 - edpiDiff * 2);

    if (player.aimStyle === aimStyle) score += 40;
    if (player.grip === mouseGrip) score += 20;

    const sensRatio = player.sens / (userEDPI / player.dpi);
    if (sensRatio > 0.8 && sensRatio < 1.2) score += 30;

    return { ...player, matchScore: score };
  });

  scoredPlayers.sort((a, b) => b.matchScore - a.matchScore);

  const top5 = scoredPlayers.slice(0, 5);
  const closest = top5[0];

  return NextResponse.json({
    game,
    userSettings: { edpi: userEDPI, aimStyle, mouseGrip },
    recommendations: top5,
    closest,
    source: 'prosettings.net',
  });
}

function getKnownPlayers(game: string) {
  const players: Record<string, any[]> = {
    valorant: [
      { name: 'TenZ', dpi: 1600, sens: 0.125, edpi: 200, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'CA' },
      { name: 'Derke', dpi: 800, sens: 0.35, edpi: 280, role: 'duelist', aimStyle: 'balanced', grip: 'palm', country: 'FI' },
      { name: 'Asuna', dpi: 1600, sens: 0.22, edpi: 352, role: 'duelist', aimStyle: 'tracking', grip: 'fingertip', country: 'US' },
      { name: 'Chronicle', dpi: 800, sens: 0.3, edpi: 240, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'PH' },
      { name: 'Aspas', dpi: 800, sens: 0.32, edpi: 256, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'BR' },
      { name: 'Yay', dpi: 800, sens: 0.375, edpi: 300, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'US' },
      { name: 'Cned', dpi: 400, sens: 0.6, edpi: 240, role: 'duelist', aimStyle: 'balanced', grip: 'palm', country: 'FR' },
      { name: 'ScreaM', dpi: 800, sens: 0.27, edpi: 216, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'BE' },
      { name: 'zekken', dpi: 800, sens: 0.31, edpi: 248, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'US' },
      { name: 'Demon1', dpi: 1600, sens: 0.188, edpi: 300, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'US' },
      { name: 'Jawgemo', dpi: 800, sens: 0.35, edpi: 280, role: 'duelist', aimStyle: 'balanced', grip: 'palm', country: 'US' },
      { name: 'Marved', dpi: 800, sens: 0.25, edpi: 200, role: 'controller', aimStyle: 'balanced', grip: 'palm', country: 'US' },
      { name: 'Sacy', dpi: 800, sens: 0.35, edpi: 280, role: 'duelist', aimStyle: 'flick', grip: 'claw', country: 'BR' },
    ],
    cs2: [
      { name: 's1mple', dpi: 400, sens: 1.05, edpi: 420, role: 'awper', aimStyle: 'flick', grip: 'claw', country: 'UA' },
      { name: 'ZywOo', dpi: 400, sens: 0.85, edpi: 340, role: 'rifler', aimStyle: 'balanced', grip: 'palm', country: 'FR' },
      { name: 'm0NESY', dpi: 400, sens: 1.0, edpi: 400, role: 'awper', aimStyle: 'flick', grip: 'claw', country: 'RU' },
      { name: 'NiKo', dpi: 800, sens: 0.5, edpi: 400, role: 'rifler', aimStyle: 'flick', grip: 'claw', country: 'BA' },
      { name: 'donk', dpi: 800, sens: 0.55, edpi: 440, role: 'rifler', aimStyle: 'flick', grip: 'claw', country: 'RU' },
      { name: 'Jame', dpi: 400, sens: 1.3, edpi: 520, role: 'awper', aimStyle: 'control', grip: 'palm', country: 'KZ' },
      { name: 'Broky', dpi: 800, sens: 0.65, edpi: 520, role: 'awper', aimStyle: 'balanced', grip: 'claw', country: 'LV' },
      { name: 'Electronic', dpi: 800, sens: 0.55, edpi: 440, role: 'rifler', aimStyle: 'flick', grip: 'claw', country: 'BY' },
      { name: 'XANTARES', dpi: 400, sens: 1.5, edpi: 600, role: 'rifler', aimStyle: 'flick', grip: 'claw', country: 'TR' },
      { name: 'ropz', dpi: 800, sens: 0.4, edpi: 320, role: 'rifler', aimStyle: 'balanced', grip: 'palm', country: 'SK' },
      { name: 'huNter', dpi: 800, sens: 0.42, edpi: 336, role: 'rifler', aimStyle: 'balanced', grip: 'palm', country: 'BA' },
      { name: 'f0rest', dpi: 400, sens: 1.4, edpi: 560, role: 'rifler', aimStyle: 'balanced', grip: 'palm', country: 'SE' },
    ],
    apex: [
      { name: 'ImperialHal', dpi: 1600, sens: 0.55, edpi: 880, role: 'entry', aimStyle: 'tracking', grip: 'claw', country: 'US' },
      { name: 'Genburten', dpi: 800, sens: 1.1, edpi: 880, role: 'fragger', aimStyle: 'tracking', grip: 'claw', country: 'US' },
      { name: 'Skadoodle', dpi: 800, sens: 1.3, edpi: 1040, role: 'support', aimStyle: 'tracking', grip: 'claw', country: 'US' },
      { name: 'Noc', dpi: 800, sens: 0.85, edpi: 680, role: 'fragger', aimStyle: 'balanced', grip: 'palm', country: 'KR' },
      { name: 'Shawn', dpi: 1600, sens: 0.45, edpi: 720, role: 'entry', aimStyle: 'tracking', grip: 'fingertip', country: 'US' },
      { name: 'niceWigg', dpi: 800, sens: 1.4, edpi: 1120, role: 'support', aimStyle: 'tracking', grip: 'claw', country: 'US' },
      { name: 'Verh', dpi: 800, sens: 0.9, edpi: 720, role: 'fragger', aimStyle: 'balanced', grip: 'palm', country: 'KR' },
    ],
    overwatch2: [
      { name: 'Fleta', dpi: 800, sens: 4.5, edpi: 3600, role: 'dps', aimStyle: 'tracking', grip: 'claw', country: 'KR' },
      { name: 'Profit', dpi: 800, sens: 5.5, edpi: 4400, role: 'dps', aimStyle: 'tracking', grip: 'claw', country: 'KR' },
      { name: 'Starladder', dpi: 1600, sens: 2.2, edpi: 3520, role: 'dps', aimStyle: 'balanced', grip: 'palm', country: 'EU' },
      { name: 'KSPN', dpi: 800, sens: 3.2, edpi: 2560, role: 'dps', aimStyle: 'flick', grip: 'claw', country: 'KR' },
      { name: 'smurf', dpi: 800, sens: 4.0, edpi: 3200, role: 'dps', aimStyle: 'tracking', grip: 'claw', country: 'KR' },
      { name: 'Leave', dpi: 800, sens: 5.0, edpi: 4000, role: 'dps', aimStyle: 'tracking', grip: 'claw', country: 'CN' },
    ],
    cod: [
      { name: 'Scump', dpi: 800, sens: 5.5, edpi: 4400, role: 'smg', aimStyle: 'tracking', grip: 'claw', country: 'US' },
      { name: 'Formal', dpi: 800, sens: 4.5, edpi: 3600, role: 'ar', aimStyle: 'balanced', grip: 'palm', country: 'US' },
      { name: 'Dashy', dpi: 800, sens: 6.5, edpi: 5200, role: 'ar', aimStyle: 'flick', grip: 'claw', country: 'US' },
      { name: 'Shotzzy', dpi: 1600, sens: 3.2, edpi: 5120, role: 'smg', aimStyle: 'tracking', grip: 'fingertip', country: 'US' },
      { name: 'Pred', dpi: 800, sens: 5.0, edpi: 4000, role: 'smg', aimStyle: 'tracking', grip: 'claw', country: 'US' },
      { name: 'Accuracy', dpi: 800, sens: 4.0, edpi: 3200, role: 'ar', aimStyle: 'balanced', grip: 'palm', country: 'US' },
    ],
    r6: [
      { name: 'Pengu', dpi: 800, sens: 0.65, edpi: 520, role: 'entry', aimStyle: 'flick', grip: 'claw', country: 'GB' },
      { name: 'Rios', dpi: 800, sens: 0.75, edpi: 600, role: 'entry', aimStyle: 'flick', grip: 'claw', country: 'BR' },
      { name: 'Going', dpi: 800, sens: 0.45, edpi: 360, role: 'anchor', aimStyle: 'control', grip: 'palm', country: 'KR' },
      { name: 'Shroud', dpi: 800, sens: 0.55, edpi: 440, role: 'flex', aimStyle: 'balanced', grip: 'claw', country: 'US' },
      { name: 'BiBoo', dpi: 800, sens: 0.5, edpi: 400, role: 'support', aimStyle: 'control', grip: 'palm', country: 'BE' },
      { name: 'Finka', dpi: 800, sens: 0.7, edpi: 560, role: 'entry', aimStyle: 'flick', grip: 'claw', country: 'BR' },
    ],
  };
  
  return players[game] || players.valorant;
}