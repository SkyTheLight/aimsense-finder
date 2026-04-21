import { Game, GameConfig, GAMES, ProPreset } from '@/types';
import { PRO_eDPI_RANGES, PRO_PRESETS, VOLTAIC_SCORE_THRESHOLDS } from './constants';

export function calculateEDPI(dpi: number, sensitivity: number): number {
  return Math.round(dpi * sensitivity);
}

export function calculateCm360(dpi: number, sensitivity: number, yaw: number = 1): number {
  if (sensitivity === 0) return 0;
  const inchesPer360 = (360 / sensitivity) * (1 / yaw);
  return Number((inchesPer360 * 2.54).toFixed(2));
}

export function getGameConfig(game: Game): GameConfig {
  return GAMES.find(g => g.id === game) || GAMES[0];
}

export function getProRange(game: Game): { min: number; max: number; avg: number } {
  return PRO_eDPI_RANGES[game] || PRO_eDPI_RANGES.valorant;
}

export function getValidEDPIRange(game: Game): { min: number; max: number } {
  const range = getProRange(game);
  return {
    min: Math.max(100, range.min),
    max: Math.min(2000, range.max),
  };
}

export function isInProRange(edpi: number, game: Game): boolean {
  const range = getProRange(game);
  return edpi >= range.min && edpi <= range.max;
}

export function calculatePercentile(edpi: number, game: Game): number {
  const range = getProRange(game);
  const percentile = ((edpi - range.min) / (range.max - range.min)) * 100;
  return Math.max(0, Math.min(100, Math.round(percentile)));
}

export function getProComparison(edpi: number, game: Game): {
  percentile: number;
  range: string;
  recommendation: string;
} {
  const range = getProRange(game);
  const percentile = calculatePercentile(edpi, game);

  let rangeLabel = 'Average';
  let recommendation = 'You\'re in the typical pro range. Adjust based on playstyle preference.';

  if (percentile < 15) {
    rangeLabel = 'Very Low';
    recommendation = 'Very low sens - good for anchors/AWPers but consider increasing for entry fragging.';
  } else if (percentile < 30) {
    rangeLabel = 'Low';
    recommendation = 'Lower than average - good for precise rifling and tactical play.';
  } else if (percentile < 45) {
    rangeLabel = 'Lower Mid';
    recommendation = 'Below average pro range. Good for controlled playstyle.';
  } else if (percentile < 55) {
    rangeLabel = 'Average';
    recommendation = 'You\'re in the typical pro range. Solid for any role.';
  } else if (percentile < 70) {
    rangeLabel = 'Upper Mid';
    recommendation = 'Above average - favors faster reactions and tracking.';
  } else if (percentile < 85) {
    rangeLabel = 'High';
    recommendation = 'Higher sens - excellent for tracking and aggressive plays.';
  } else {
    rangeLabel = 'Very High';
    recommendation = 'Very high sens - exceptional for movement players but may lack precision at range.';
  }

  return { percentile, range: rangeLabel, recommendation };
}

export function calculateBaseSensitivity(
  currentEDPI: number,
  targetEDPI: number,
  game: Game
): number {
  const config = getGameConfig(game);
  const baseEDPI = targetEDPI || 280;
  const sens = baseEDPI / currentEDPI;
  return Math.round(sens * 1000) / 1000;
}

export function getSensitivityFromEDPI(targetEDPI: number, dpi: number, game: Game): number {
  const config = getGameConfig(game);
  const sens = targetEDPI / dpi;
  return Math.max(0.05, Math.min(10, Number(sens.toFixed(3))));
}

export function getPSABaseFromPreset(preset: ProPreset | null, userEDPI: number, game: Game): number {
  if (!preset) return 0.4;
  const targetMid = (preset.edpiRange.min + preset.edpiRange.max) / 2;
  return getSensitivityFromEDPI(targetMid, preset.dpi, game);
}

export function getSensitivityRange(base: number): { low: number; high: number } {
  return {
    low: Number((base * 0.5).toFixed(3)),
    high: Number((base * 1.5).toFixed(3)),
  };
}

export function calculateAimStyleBias(
  mechanic: string | null,
  playstyle: string | null
): number {
  let bias = 0;
  if (mechanic === 'wrist') bias += 0.025;
  if (mechanic === 'arm') bias -= 0.025;
  if (mechanic === 'hybrid') bias += 0.005;
  if (playstyle === 'flick') bias += 0.02;
  if (playstyle === 'tracking') bias -= 0.025;
  if (playstyle === 'balanced') bias += 0.005;
  return Number(bias.toFixed(3));
}

export function calculateVoltaicModifier(
  tracking: number,
  flicking: number,
  switching: number
): number {
  const avgScore = (tracking + flicking + switching) / 3;

  let modifier = 0;

  if (avgScore >= VOLTAIC_SCORE_THRESHOLDS.elite.tracking) {
    modifier += 0.015;
  } else if (avgScore >= VOLTAIC_SCORE_THRESHOLDS.advanced.tracking) {
    modifier += 0.005;
  } else if (avgScore <= VOLTAIC_SCORE_THRESHOLDS.novice.tracking) {
    modifier -= 0.01;
  }

  const flickDiff = flicking - tracking;
  if (flickDiff > 15) {
    modifier += 0.02;
  } else if (flickDiff > 8) {
    modifier += 0.01;
  } else if (flickDiff < -15) {
    modifier -= 0.025;
  } else if (flickDiff < -8) {
    modifier -= 0.015;
  }

  const switchDiff = switching - avgScore;
  if (Math.abs(switchDiff) > 20) {
    modifier *= 0.6;
  } else if (Math.abs(switchDiff) > 10) {
    modifier *= 0.8;
  }

  return Number(modifier.toFixed(3));
}

export function calculatePresetBias(preset: ProPreset | null): number {
  if (!preset) return 0;
  switch (preset.playstyle) {
    case 'flick':
      return 0.03;
    case 'tracking':
      return -0.02;
    case 'control':
      return -0.03;
    default:
      return 0;
  }
}

export function calculateFinalSensitivity(
  psaValue: number,
  presetBias: number,
  aimStyleBias: number,
  voltaicModifier: number
): number {
  const total = psaValue + presetBias + aimStyleBias + voltaicModifier;
  const clamped = Math.max(0.1, Math.min(10, total));
  return Number(clamped.toFixed(3));
}

export function getSensitivityLabel(
  sensitivity: number,
  baseSensitivity: number
): 'control' | 'balanced' | 'speed' {
  const ratio = sensitivity / baseSensitivity;
  if (ratio < 0.75) return 'control';
  if (ratio > 1.25) return 'speed';
  return 'balanced';
}

export function generateExplanation(
  label: 'control' | 'balanced' | 'speed',
  psaValue: number,
  aimStyle: { mechanic: string | null; playstyle: string | null },
  proComparison: { percentile: number; range: string }
): string {
  const styleParts: string[] = [];

  if (aimStyle.mechanic === 'wrist') {
    styleParts.push('using wrist-dominant aiming');
  } else if (aimStyle.mechanic === 'arm') {
    styleParts.push('using arm-dominant aiming');
  }

  if (aimStyle.playstyle === 'flick') {
    styleParts.push('prioritizing fast flicks');
  } else if (aimStyle.playstyle === 'tracking') {
    styleParts.push('prioritizing smooth tracking');
  }

  const labelText = label === 'control' ? 'lower' : label === 'speed' ? 'higher' : 'balanced';
  const proText = `${proComparison.range} eDPI (${proComparison.percentile}% percentile)`;

  return `Your ${labelText} sensitivity (${proText}) matches ${styleParts.join(' & ') || 'your detected playstyle'}. This balance optimizes ${label === 'balanced' ? 'versatility across all scenarios' : label === 'control' ? 'precision at long range' : 'quick reactions in close quarters'}.`;
}

export function convertSensitivity(
  fromSens: number,
  fromGame: Game,
  toGame: Game
): number {
  const fromConfig = getGameConfig(fromGame);
  const toConfig = getGameConfig(toGame);
  const ratio = fromConfig.yaw / toConfig.yaw;
  return Number((fromSens * ratio).toFixed(3));
}

export function getFilteredPresets(game: Game): ProPreset[] {
  return PRO_PRESETS.filter(p => p.games.includes(game));
}

export function suggestPresets(userEDPI: number, game: Game): ProPreset[] {
  const filtered = getFilteredPresets(game);
  return filtered
    .map(preset => {
      const presetMid = (preset.edpiRange.min + preset.edpiRange.max) / 2;
      const diff = Math.abs(userEDPI - presetMid);
      return { preset, diff: diff / presetMid };
    })
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 3)
    .map(r => r.preset);
}