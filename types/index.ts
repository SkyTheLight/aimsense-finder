import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
    } & DefaultSession["user"];
  }
}

export type Game = 'valorant' | 'cs2';

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

export type MouseWeight = 'ultralight' | 'light' | 'medium' | 'heavy' | 'unknown';
export type MouseSizeFeel = 'too_big' | 'too_small' | 'just_right';
export type MousepadSize = 'small' | 'medium' | 'large' | 'xl';
export type MousepadSurface = 'control' | 'balanced' | 'speed';
export type ArmPosition = 'flat' | 'angled' | 'raised';
export type ArmAnchoring = 'anchored' | 'floating';
export type SittingPosture = 'upright' | 'leaning' | 'slouched';
export type AimIssue = 'overflicking' | 'underflicking' | 'shaky_aim' | 'poor_micro';
export type PlayerRole = 'aggressive' | 'passive' | 'hybrid';
export type MainWeapon = 'rifle' | 'awp';
export type WarmupMethod = 'aim_trainer' | 'deathmatch' | 'range';
export type ConsistencyFeeling = 'consistent' | 'inconsistent';

export interface UserSetup {
  dpi: number;
  sensitivity: number;
  game: Game;
  mouseGrip: MouseGrip | null;
  aimingMechanic: AimingMechanic | null;
  mouseWeight: MouseWeight | null;
  mouseSizeFeel: MouseSizeFeel | null;
  aimIssues: AimIssue[];
  mousepadSize: MousepadSize | null;
  mousepadSurface: MousepadSurface | null;
  runningOutOfSpace: boolean | null;
  armPosition: ArmPosition | null;
  armAnchoring: ArmAnchoring | null;
  sittingPosture: SittingPosture | null;
  warmup: boolean | null;
  warmupDuration: number | null;
  warmupMethod: WarmupMethod | null;
  consistencyFeeling: ConsistencyFeeling | null;
  mainWeapon: MainWeapon | null;
  playerRole: PlayerRole | null;
  biggestAimingIssue: AimIssue | null;
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
  valorant: 'simple-icons:valorant',
  cs2: 'simple-icons:counterstrike',
};

export const GAME_ICON_FALLBACKS: Record<string, string> = {
  valorant: '🎯',
  cs2: '🔫',
};

export const GAMES: GameConfig[] = [
  { id: 'valorant', name: 'Valorant', icon: 'valorant', multiplier: 0.07, color: '#FF4655' },
  { id: 'cs2', name: 'CS2', icon: 'cs2', multiplier: 0.022, color: '#DE9B35' },
];

export const GAME_COLORS: Record<string, string> = {
  valorant: '#FF4655',
  cs2: '#DE9B35',
};

export const MOUSE_GRIPS = [
  { id: 'palm', name: 'Palm Grip', icon: '✋', description: 'Full hand contact, relaxed' },
  { id: 'claw', name: 'Claw Grip', icon: '🦞', description: 'Archved palm, quick movement' },
  { id: 'fingertip', name: 'Fingertip Grip', icon: '👆', description: 'Fingertips only, precision' },
];

export const AIMING_MECHANICS = [
  { id: 'wrist', name: 'Wrist Aiming', description: 'Small movements, fast flicks' },
  { id: 'arm', name: 'Arm Aiming', description: 'Arm movement, smooth tracking' },
  { id: 'hybrid', name: 'Hybrid', description: 'Combination of both' },
];

export const MOUSE_WEIGHTS = [
  { id: 'ultralight', name: 'Ultralight (< 60g)', description: 'Super light, fast movement' },
  { id: 'light', name: 'Light (60-70g)', description: 'Lightweight, good control' },
  { id: 'medium', name: 'Medium (70-80g)', description: 'Standard gaming mouse' },
  { id: 'heavy', name: 'Heavy (> 80g)', description: 'Heavier mouse' },
  { id: 'unknown', name: "Don't know", description: 'Not sure of weight' },
];

export const MOUSE_SIZE_FEELS = [
  { id: 'too_big', name: 'Too Big', description: 'Mouse feels larger than ideal' },
  { id: 'too_small', name: 'Too Small', description: 'Mouse feels smaller than ideal' },
  { id: 'just_right', name: 'Just Right', description: 'Mouse size feels perfect' },
];

export const AIM_ISSUES = [
  { id: 'overflicking', name: 'Overflicking', description: 'Aim goes past target' },
  { id: 'underflicking', name: 'Underflicking', description: 'Aim falls short of target' },
  { id: 'shaky_aim', name: 'Shaky Aim', description: 'Aim feels unsteady' },
  { id: 'poor_micro', name: 'Poor Micro', description: 'Hard to make small adjustments' },
];

export const MOUSEPAD_SIZES = [
  { id: 'small', name: 'Small', description: 'Less than 250mm width' },
  { id: 'medium', name: 'Medium', description: '250-300mm width' },
  { id: 'large', name: 'Large', description: '300-400mm width' },
  { id: 'xl', name: 'XL', description: 'Over 400mm width' },
];

export const MOUSEPAD_SURFACES = [
  { id: 'control', name: 'Control', description: 'More friction, precise' },
  { id: 'balanced', name: 'Balanced', description: 'Mix of speed and control' },
  { id: 'speed', name: 'Speed', description: 'Less friction, faster' },
];

export const ARM_POSITIONS = [
  { id: 'flat', name: 'Flat', description: 'Arm flat on desk' },
  { id: 'angled', name: 'Angled', description: 'Arm at slight angle' },
  { id: 'raised', name: 'Raised', description: 'Arm raised/elevated' },
];

export const ARM_ANCHORINGS = [
  { id: 'anchored', name: 'Anchored', description: 'Arm resting on desk' },
  { id: 'floating', name: 'Floating', description: 'Arm not touching desk' },
];

export const SITTING_POSTURES = [
  { id: 'upright', name: 'Upright', description: 'Straight back posture' },
  { id: 'leaning', name: 'Leaning', description: 'Leaning forward slightly' },
  { id: 'slouched', name: 'Slouched', description: 'Leaning back in chair' },
];

export const WARMUP_METHODS = [
  { id: 'aim_trainer', name: 'Aim Trainer', description: 'Aim lab, KovaaK etc.' },
  { id: 'deathmatch', name: 'Deathmatch', description: 'In-game deathmatch' },
  { id: 'range', name: 'Range', description: 'In-game shooting range' },
];

export const PLAYER_ROLES = [
  { id: 'aggressive', name: 'Aggressive', description: 'Entry fragger, aggressive plays' },
  { id: 'passive', name: 'Passive', description: 'Support, defensive plays' },
  { id: 'hybrid', name: 'Hybrid', description: 'Mix of both styles' },
];

export const MAIN_WEAPONS = [
  { id: 'rifle', name: 'Rifle', description: 'Primary rifler/AK player' },
  { id: 'awp', name: 'AWP', description: 'Primary AWPer' },
];

export const VOLTAIC_BENCHMARKS = {
  gridshot: { name: 'Gridshot', category: 'switching' as const },
  sixshot: { name: 'Sixshot', category: 'flicking' as const },
  strafeTrack: { name: 'Strafe Track', category: 'tracking' as const },
  sphereTrack: { name: 'Sphere Track', category: 'tracking' as const },
};

export interface HistoryEntry {
  id?: number;
  game: string;
  dpi: number;
  sensitivity: number;
  edpi: number;
  cm360: number;
  createdAt?: string;
}