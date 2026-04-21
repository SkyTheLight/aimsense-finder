export type Game = 'valorant' | 'cs2' | 'apex' | 'overwatch2' | 'cod' | 'r6';

export interface GameConfig {
  id: Game;
  name: string;
  icon: string;
  multiplier: number;
  color?: string;
}

export function getGameIcon(gameId: string): string {
  return GAME_ICONS[gameId] || gameId;
}

export type AimingMechanic = 'wrist' | 'arm' | 'hybrid';
export type MouseGrip = 'palm' | 'claw' | 'fingertip';
export type Playstyle = 'flick' | 'tracking' | 'balanced';

export interface UserSetup {
  dpi: number;
  sensitivity: number;
  game: Game;
  mouseGrip: MouseGrip | null;
  aimingMechanic: AimingMechanic | null;
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

export interface ProPlayer {
  name: string;
  dpi: number;
  sens: number;
  edpi: number;
  role: string;
  aimStyle: string;
  grip: string;
  country: string;
  matchScore?: number;
}

export interface FinalResults {
  sensitivity: number;
  edpi: number;
  cm360: number;
  label: 'control' | 'balanced' | 'speed';
  explanation: string;
  profile: string;
  tips: {
    pros: string;
    cons: string;
    struggles: string;
    advice: string;
  };
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

export const GAME_ICONS: Record<string, string> = {
  valorant: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTE2IDJjLTEuMSAwLTIgLjktMiAyYzAgMS4xLjkgMiAyIDJjMS4xIDAgMi0uOSAyLTJjMC0xLjEtLjktMi0yLTJ6bTAgMTJjMCAxLjEuOSAyIDIgMnY4YzAgMS4xLjkgMiAyIDJ2OWMwLTEuMS45LTIgMi0yem0tNC0yMGMtMS4xIDAtMiAuOS0yIDJ2MTFjMCAxLjEuOSAyIDIgMnYxMWMwIDEuMS45IDIgMiAyYzAgMS4xLjkgMiAyIDJjMS4xIDAgMi0uOSAyLTJ6IiBmaWxsPSIjRkZEMzAwIi8+PHBhdGggZD0iTTEyIDJjLTEuMSAwLTIgLjktMiAyYzAgMS4xLjkgMiAyIDJjMS4xIDAgMi0uOSAyLTJjMC0xLjEtLjktMi0yLTJ6bTAgMTFjMCAxLjEuOSAyIDIgMnYxMWMwIDEuMS45IDIgMiAyYzAgMS4xLjkgMiAyIDJjMS4xIDAgMi0uOSAyLTJ6IiBmaWxsPSIjRkZEMzAwIiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=`,
  cs2: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTYuODMgNi44M2MtMS4xNiAwLTIuMTMuOTctMi4xMyAyLjEyNnYxMy41MzhDNC41NzMgMjMuNTk1IDUuNjIgMjQuNSA2LjgzIDI0LjVjMS4xNiAwIDIuMTMtLjk3IDIuMTMtMi4xMjZWMHYtMTMuNTM4em0xMy41NCAwYzAgMy4zNTctMi43NDIgNi4wNzQtNi4wNzQgNi4wNzR2Ni4wMzhjMCAxLjE2IDEuOTcgMi4xMiAyLjEyIDIuMTJjMS4xNiAwIDIuMTItLjk2IDIuMTItMi4xMnYtNi4wMzhjMC0zLjM1Ny0yLjc0Mi02LjA3NC02LjA3NC02LjA3NHptNS41Ny0xMS4xMzhjLTEuMSAwLTItLjk3LTItMi4xMjdWNC41NzFDMTUuNzkgNC41OCAxNi41IDMuNjkgMTcuMzMgMy42OWMxLjE2IDAgMi0uOTcgMi0yLjEyNnYtMnptMTIgMGMtMS4xIDAtMiAuOTctMiAyLjEyNnYxMy41MzhjMCAxLjYtMS45NyAyLjEyNSAyLjEyNSAyLjEyNWw4LjUzOC04LjUzOGMxLjUtMS41IDEuNS0zLjkzIDAtNS40MzFsLTYuMzc1LTYuMzc1Yy0xLjUtMS41LTMuOTMxLTEuNS01LjQ3MSAwLTEuNTA2IDEuNS0zLjA3MiAzLjUtNS40MzFsNi4zNzUtNi4zNzVjMS41LTEuNSAzLjM3Ni0xLjUgNC44NzYgMHoiIGZpbGw9IiMwMDk5RkYiLz48L3N2Zz4=`,
  apex: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTE2IDJjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDIgMnYxMmMwIDEuMS45IDIgM2Y1Yy0uMS0xLjM3LS42NS0yLjY4LTEuMjUtMy42N2w3Ljc1LTcuNzVjLjU5LS41OSA5LjEyLTMuMTggMi41NS0yLjM0Yy0uMDcuMDYtNi41NS0uMDYtNi42MSAwbC05LjEyIDMuMThsNy43NSA3Ljc1Yy0uNi45OC0xLjQ1IDEuOC0xLjI1IDMuNjd2LjljMCAxLjEuOSAyIDJjMS4xIDAgMi0uOSAyLTJ2LTEyYzAtMS4xLS45LTItMi0yeiIgZmlsbD0iI0ZGRDAwMCIvPjxwYXRoIGQ9Ik0xNiAyNmMuOTQgMCAxLjcuMTkgMS41LjI1IDQuMjVsLTEuMjUgMi41NWgyLjVjLS42NS0zLjAxLS41NS00LjI1LS4MjUtNC4yNWgtMS41bC0uNzUuNzVjLS41NS0xLjEtLjM1LTIuNDYgMC0zLjdoIiBmaWxsPSIjRkZEMzAwIi8+PHBhdGggZD0iTTE0IDJjMS4xIDAgMiAuOSAyIDJ2OGMwIDEuMS0uOSAyLTIgMnYtMTJjMC0xLjEtLjktMi0yLTJ6IiBmaWxsPSIjRkZEMzAwIiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=`,
  overwatch2: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTYuMzggNi4zOHYxNS4yNEM1LjI4IDIzLjU1IDQuMjIgMjQgMy4xNiAyNGMtMS4xNiAwLTIuMTMuOTctMi4xMyAyLjEzdjE1LjI0YzAgMS4xNiAxLjk3IDIuMTMgMi4xMyAyLjEzYzEuMTYgMCAyLjEzLTEuOTcgMi4xMy0yLjEzVjI0YzAgLTEuMTYtMS45Ny0yLjEzLTIuMTMtMi4xM3YtMTUuMjR6bT5tMTUuMjRjMCAxLjYuOTcgMi45MiAyLjEzIDQuMjVjLjY1IDMuMDEgMS4wMSA0LjI1IDEuNDEgNS4yNWgyLjkzYy0uNC0xLjk4LS43NS00LjI1LTEuNDEtNS4yNWMtLjY1LTIuMzQtLjc1LTMuMDYtMS4MTMtNC4yNXYtNDIuNjdjLTEuMTYgMC0yIDEuODQtMiA0YzAgMi4MTYgMS4zOCAzLjM3IDQgMy4zN3YxNi40NEMxOC45OSAyMi41MyAyMCAyMy41OCAyMCAyNC41M2MwIDEuMTYtMS44IDIgLTQgMnYtNDIuNjdjMCAyLjI2IDEuMzggMy45MiA1IDMuOTJjMCAuNDItLjAxLjQtLjEuNDUtLjE2eiIgZmlsbD0iI0ZGRDAwMCIvPjxwYXRoIGQ9Ik0xNiAxNS44M2MuNDYgMCAuODMuMDYgMS4yNS4xN2wyLjUgMi41Yy0uMTYuMTYtLjMyLjI1LS41LjI1cy0uNjUtLjE2LS45LS41TDE2IDE1LjQ1Yy0uMzUtLjItLjY3LS4zNS0uOTUtLjM1cy0uNDYuMDYtLjYuMzFDMTQuNTkgMTUuNDEgMTQuNTIgMTUuOCAxNCAxNS44M3oiIGZpbGw9IiNGRkQwMDAiIG9wYWNpdHk9IjAuNCIvPjwvc3ZnPg==`,
  cod: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTE1LjgzIDJjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJjMS4xIDAgMi0uOSAyLTJ2LTEyYzAtMS4xLS45LTItMi0yeiBtOC41NyAwaC0uNDRsLTEuMTIgMi41N2gtMS41bC0uMjQtLjMybC0uMjQuMzJoLTEuNTFsLTEuMTItMi41N2gtLjQ0Yy0xLjEgMC0yIC45LTIgMnYxMmMwIDEuMS45IDIgMiAydjEwLjIzN2MuODkgMi43NCAyLjM0IDMuNjkgMy4wOCAzLjY5YzEuMTYgMCAyLjA4LTEuOTggMi4wOC0zLjY5bC0uNDUtLjM3Yy0uNDEgMS4wOS0xLjI1IDEuODItMi4xMyAxLjgyYy0uMzkgMC0uNzUtLjA5LS45LS4yN2wtLjI1LS4zM2MtLjUzLjY4LS43NSAxLjEyLS43NSAxLjdWMXZjMC0xLjEuOS0yIDItMnYtMnptMCAxMy4yN3YxMi4zM2MuNDYgMS4wNSAxLjUzIDEuNTggMi4wMyAxLjU4YzEuMDggMCAyLjU3LS41NyAzLjMzLTEuMzFsLS4yNS0uMzdjLS41NCAxLTEuMDggMS42NS0yLjA4IDEuNjVjLTEuMzIgMC0yLjMzLS41NS0yLjY4LTEuMjF6IiBmaWxsPSIjRkZEMzAwIi8+PHBhdGggZD0iTTYuODMgNi44M3YxNS4yMzhDNC41NzIgMjMuNTUgMy42MiAyNCAyLjEzIDI0Yy0xLjE2IDAtMi4xMy45Ny0yLjEzIDIuMTN2MTUuMjM4YzAgMS4xNiAxLjk3IDIuMTMgMi4xMyAyLjEzYzEuMTYgMCAyLjEzLTEuOTcgMi4xMy0yLjEzVjI0YzAtMS4xNi0xLjk3LTIuMTMtMi4xMy0yLjEzeiIgZmlsbD0iI0ZGRDAwMCIgb3BhY2l0eT0iMC40Ii8+PC9zdmc+`,
  r6: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTYuMzggNi4zOHYxNS4yMzhDNS4yOCAyMy41NiA0LjIyIDI0IDMuMTYgMjRjLTEuMTYgMC0yLjEzLjk3LTIuMTMgMi4xM3YxNS4yMzhjMCAxLjE2IDEuOTcgMi4xMyAyLjEzIDIuMTNjMS4xNiAwIDIuMTMtMS45NyAyLjEzLTIuMTNWMjRjMC0xLjE2LTEuOTctMi4xMy0yLjEzLTIuMTN6TTI1LjYyIDYuMzh2MTUuMjM4YzAgMS4xNi0xLjk3IDIuMTMtMi4xMyAyLjEzYzEuMTYgMCAyLjEzLTEuOTcgMi4xMy0yLjEzVjI0YzAtMS4xNi0xLjk3LTIuMTMtMi4xMy0yLjEzem0tOC41OCA5LjMzN2wtMi41MS0uOTljLS40NS0uMTYtLjY4LjItLjY4LjY1djkuOTFjMCAxLjY4IDIuMzEgMi41MyA0Ljk3IDIuNTNjMi42NiAwIDQuOTctLjg1IDQuOTctMi41M3YtNi4zNmMtLjY1LS4yMi0uNjUtLjIyLS44My0uMjd6bTQuNDYgNi4zNmMtLjU1LjY0LTEuNTIgMS4zNS0yLjg3IDEuMzdjMS4zNSAwIDIuODctLjY5IDIuODctMS4NDRjMC0uNDItLjE3LS44LS40NS0uNTl6IiBmaWxsPSIjRkZEMzAwIi8+PHBhdGggZD0iTTE2IDEzLjcyYzEuMTYgMCAyIC45NyAyIDJzLS44My45Ny0yIDJzLTIuODQtLjkyLTMuNzItMi4MjdjLjEzLS41My41NS0xLjU5IDMuMTItMS41OWMuODkgMCAyLjI1LjY5IDIuMjYgMS40N3ptLTEwLjY3IDBjLTEuMTYgMC0yIC45Ny0yIDJzLjMzLS45NyAyLTJzMS44NS45MyAzLjkzIDMuNDdjLTEuMDYuODktLjIzIDEuODggMCwyLjY5YzIuMjkgMCA1LjM3LTEuOTIgNS4zNy00LjA5YzAtMS4wNS0uNTgtMS45NS0xLjQ0LTIuNjljLS44NS0uNzgtMS42NS0xLjEyLTIuNTMtMS4MjdjMS42NiAwIDIuNjYuNTkgMi42NiAxLjMxem0xMC40NSAwYzEuMTYgMCAyIC45NyAyIDJzLS44My45Ny0yIDJzLTIuODQtLjkyLTMuNzItMi4yN2MuNTctLjU1IDEuMDYtMS4MTIgMS4NDItMS4MTJjLTEuMzEgMC0yLjU4LjY3LTIuNjggMS4zMXoiIGZpbGw9IiNGRkQwMDAiIG9wYWNpdHk9IjAuNCIvPjwvc3ZnPg==`,
};

export const GAMES: GameConfig[] = [
  { id: 'valorant', name: 'Valorant', icon: 'valorant', multiplier: 0.07, color: '#FF4655' },
  { id: 'cs2', name: 'CS2', icon: 'cs2', multiplier: 0.022, color: '#DE9B35' },
  { id: 'apex', name: 'Apex Legends', icon: 'apex', multiplier: 1, color: '#DA292A' },
  { id: 'overwatch2', name: 'Overwatch 2', icon: 'overwatch2', multiplier: 3.3333, color: '#F99E1A' },
  { id: 'cod', name: 'Call of Duty', icon: 'cod', multiplier: 1, color: '#222222' },
  { id: 'r6', name: 'Rainbow Six', icon: 'r6', multiplier: 0.022, color: '#FABD19' },
];

export const GAME_COLORS: Record<string, string> = {
  valorant: '#FF4655',
  cs2: '#DE9B35',
  apex: '#DA292A',
  overwatch2: '#F99E1A',
  cod: '#FABD19',
  r6: '#FABD19',
};

export const MOUSE_GRIPS = [
  { id: 'palm', name: 'Palm Grip', icon: '✋', description: 'Full hand contact, relaxed' },
  { id: 'claw', name: 'Claw Grip', icon: '🦞', description: 'Archved palm, quick movement' },
  { id: 'fingertip', name: 'Fingertip', icon: '👆', description: 'Fingertips only, precision' },
];

export const AIMING_MECHANICS = [
  { id: 'wrist', name: 'Wrist Aiming', description: 'Small movements, fast flicks' },
  { id: 'arm', name: 'Arm Aiming', description: 'Arm movement, smooth tracking' },
  { id: 'hybrid', name: 'Hybrid', description: 'Combination of both' },
];

export const VOLTAIC_BENCHMARKS = {
  gridshot: { name: 'Gridshot', category: 'switching' as const },
  sixshot: { name: 'Sixshot', category: 'flicking' as const },
  strafeTrack: { name: 'Strafe Track', category: 'tracking' as const },
  sphereTrack: { name: 'Sphere Track', category: 'tracking' as const },
};