import { Game, ProPreset } from '@/types';

export const STEPS = [
  { id: 0, title: 'Welcome', label: 'Start' },
  { id: 1, title: 'Setup', label: 'Configure' },
  { id: 2, title: 'Pro Presets', label: 'Presets' },
  { id: 3, title: 'PSA Method', label: 'Calibrate' },
  { id: 4, title: 'Aim Style', label: 'Profile' },
  { id: 5, title: 'Performance', label: 'Test' },
  { id: 6, title: 'Results', label: 'Final' },
];

export const DEFAULT_DPI = 0;
export const DEFAULT_SENSITIVITY = 0;
export const TARGET_eDPI = 280;

export const GAME_YAW_VALUES: Record<Game, number> = {
  valorant: 1,
  cs2: 3.18,
  apex: 1,
  overwatch2: 1,
  cod: 1,
  r6: 1,
};

export const SENSITIVITY_LIMITS = {
  min: 0.01,
  max: 10,
  minDPI: 100,
  maxDPI: 32000,
};

export const PRO_eDPI_RANGES = {
  valorant: { min: 141, max: 450, avg: 280 },
  cs2: { min: 380, max: 1400, avg: 800 },
  apex: { min: 200, max: 800, avg: 400 },
  overwatch2: { min: 300, max: 1200, avg: 600 },
  cod: { min: 200, max: 800, avg: 400 },
  r6: { min: 400, max: 1600, avg: 800 },
};

export const PRO_PRESETS: ProPreset[] = [
  {
    id: 'jett_duelist',
    name: 'Duelist',
    description: 'Fast entries, aggressive plays',
    edpiRange: { min: 200, max: 320 },
    dpi: 800,
    sensitivity: 0.28,
    playstyle: 'flick',
    games: ['valorant'],
    icon: '⚡',
    color: '#00ff88',
  },
  {
    id: 'controller',
    name: 'Controller',
    description: 'Smart positioning, support',
    edpiRange: { min: 180, max: 280 },
    dpi: 800,
    sensitivity: 0.22,
    playstyle: 'balanced',
    games: ['valorant'],
    icon: '🛡️',
    color: '#6366f1',
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    description: 'Anchors, site holding',
    edpiRange: { min: 140, max: 240 },
    dpi: 400,
    sensitivity: 0.4,
    playstyle: 'control',
    games: ['valorant', 'cs2'],
    icon: '🎯',
    color: '#00ff88',
  },
  {
    id: 'awper',
    name: 'AWPer',
    description: 'Anchor, holds angles',
    edpiRange: { min: 400, max: 700 },
    dpi: 400,
    sensitivity: 1.0,
    playstyle: 'control',
    games: ['cs2'],
    icon: '🔫',
    color: '#22c55e',
  },
  {
    id: 'entry',
    name: 'Entry Fragger',
    description: 'First into sites',
    edpiRange: { min: 300, max: 500 },
    dpi: 800,
    sensitivity: 0.5,
    playstyle: 'flick',
    games: ['cs2'],
    icon: '💥',
    color: '#ef4444',
  },
  {
    id: 'igl',
    name: 'IGL / Support',
    description: 'Call-heavy, utility',
    edpiRange: { min: 280, max: 450 },
    dpi: 800,
    sensitivity: 0.4,
    playstyle: 'balanced',
    games: ['cs2'],
    icon: '📡',
    color: '#8b5cf6',
  },
  {
    id: 'tracking_pro',
    name: 'Tracker',
    description: 'Movement fraggers',
    edpiRange: { min: 500, max: 900 },
    dpi: 1600,
    sensitivity: 0.5,
    playstyle: 'tracking',
    games: ['apex', 'overwatch2'],
    icon: '🎯',
    color: '#f59e0b',
  },
  {
    id: 'default_tactical',
    name: 'Tactical',
    description: 'Balanced playstyle',
    edpiRange: { min: 250, max: 400 },
    dpi: 800,
    sensitivity: 0.35,
    playstyle: 'balanced',
    games: ['valorant', 'cs2', 'r6'],
    icon: '⚖️',
    color: '#06b6d4',
  },
];

export const STEAM_AIM_LAB_APPID = '714010';

export const AIM_LAB_TASKS = {
  switching: [
    { id: 'gridshot', name: 'Gridshot', difficulty: 'Easy', avgScore: 45, steamLink: 'steam://run/714010//?action=play_task&task_id=1' },
  ],
  flicking: [
    { id: 'sixshot', name: 'Sixshot', difficulty: 'Medium', avgScore: 40, steamLink: 'steam://run/714010//?action=play_task&task_id=12' },
    { id: 'microshot', name: 'Microshot', difficulty: 'Hard', avgScore: 30, steamLink: 'steam://run/714010//?action=play_task&task_id=11' },
    { id: 'reflexshot', name: 'Reflexshot', difficulty: 'Expert', avgScore: 25, steamLink: 'steam://run/714010//?action=play_task&task_id=10' },
  ],
  tracking: [
    { id: 'strafe_track', name: 'Strafe Track', difficulty: 'Medium', avgScore: 35, steamLink: 'steam://run/714010//?action=play_task&task_id=13' },
    { id: 'smoothsphere', name: 'Smooth Sphere', difficulty: 'Hard', avgScore: 28, steamLink: 'steam://url/CommunityFilePage/2073171803' },
  ],
};

export const VOLTAIC_SCORE_THRESHOLDS = {
  novice: { tracking: 25, flicking: 25, switching: 25 },
  intermediate: { tracking: 40, flicking: 40, switching: 40 },
  advanced: { tracking: 55, flicking: 55, switching: 55 },
  elite: { tracking: 70, flicking: 70, switching: 70 },
  pro: { tracking: 85, flicking: 85, switching: 85 },
};

export const SENSITIVITY_TIPS = {
  control: {
    pros: 'Better precision at range, easier to hit headshots, more consistent',
    cons: 'Slower strafing, harder to 180, tiring for arm',
    struggles: 'Quick peeks, close quarters flick shots',
    advice: 'Work on arm movement drills and pre-aim corners',
  },
  balanced: {
    pros: 'Good all-around, versatile in any scenario',
    cons: 'Not the best at either extreme',
    struggles: 'May need adjustment for specific roles',
    advice: 'Perfect for flexible players, adapt as needed',
  },
  speed: {
    pros: 'Fast peeks, quick flicks, easier 180s',
    cons: 'Less precision, harder to control',
    struggles: 'Long range shots, spray control',
    advice: 'Focus on diagonal tracking and precision click timing',
  },
};

export const COLORS = {
  background: {
    primary: '#0a0a0f',
    secondary: '#12121a',
    tertiary: '#1a1a24',
  },
  accent: {
    primary: '#00ff88',
    secondary: '#ff3366',
    tertiary: '#6366f1',
  },
  text: {
    primary: '#ffffff',
    secondary: '#94a3b8',
    muted: '#64748b',
  },
  border: '#2a2a3a',
  success: '#22c55e',
  error: '#ef4444',
};