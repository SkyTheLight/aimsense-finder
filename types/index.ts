export type Game = 'valorant' | 'cs2' | 'apex' | 'overwatch2' | 'cod' | 'r6';

export interface GameConfig {
  id: Game;
  name: string;
  icon: string;
  multiplier: number;
}

export type AimingMechanic = 'wrist' | 'arm' | 'hybrid';
export type Playstyle = 'flick' | 'tracking' | 'balanced';

export interface UserSetup {
  dpi: number;
  sensitivity: number;
  game: Game;
}

export interface CalculatedMetrics {
  edpi: number;
  cm360: number;
}

export interface PSAIteration {
  iteration: number;
  low: number;
  high: number;
  mid: number;
  choice: 'low' | 'high' | null;
}

export interface AimStyleData {
  mechanic: AimingMechanic | null;
  playstyle: Playstyle | null;
}

export interface BenchmarkScores {
  gridshot: number;
  sixshot: number;
  strafeTrack: number;
  sphereTrack: number;
  tracking: number;
  flicking: number;
  switching: number;
}

export interface SimplifiedRatings {
  tracking: number;
  flicking: number;
  switching: number;
}

export interface ProPreset {
  id: string;
  name: string;
  description: string;
  edpiRange: { min: number; max: number };
  dpi: number;
  sensitivity: number;
  playstyle: 'flick' | 'tracking' | 'control' | 'balanced';
  games: Game[];
  icon: string;
  color: string;
}

export interface FinalResults {
  sensitivity: number;
  edpi: number;
  cm360: number;
  label: 'control' | 'balanced' | 'speed';
  explanation: string;
  profile: string;
  comparedToPro: {
    percentile: number;
    range: string;
    recommendation: string;
  };
}

export interface WizardState {
  currentStep: number;
  setup: UserSetup | null;
  selectedPreset: ProPreset | null;
  psaIterations: PSAIteration[];
  psaFinal: number | null;
  aimStyle: AimStyleData | null;
  benchmarkMode: 'manual' | 'simplified';
  benchmarks: BenchmarkScores | null;
  simplified: SimplifiedRatings | null;
  results: FinalResults | null;
}

export const GAMES: GameConfig[] = [
  { id: 'valorant', name: 'Valorant', icon: '🎯', multiplier: 0.07 },
  { id: 'cs2', name: 'CS2', icon: '🔫', multiplier: 0.022 },
  { id: 'apex', name: 'Apex Legends', icon: '⚡', multiplier: 1 },
  { id: 'overwatch2', name: 'Overwatch 2', icon: '🛡️', multiplier: 3.3333 },
  { id: 'cod', name: 'Call of Duty', icon: '🎮', multiplier: 1 },
  { id: 'r6', name: 'Rainbow Six', icon: '🔰', multiplier: 0.022 },
];

export const VOLTAIC_BENCHMARKS = {
  gridshot: { name: 'Gridshot', category: 'switching' as const },
  sixshot: { name: 'Sixshot', category: 'flicking' as const },
  strafeTrack: { name: 'Strafe Track', category: 'tracking' as const },
  sphereTrack: { name: 'Sphere Track', category: 'tracking' as const },
};