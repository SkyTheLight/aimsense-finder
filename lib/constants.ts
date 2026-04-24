import { Game, ProPreset } from '@/types';

export const STEPS = [
  { id: 0, title: 'Player Identity', label: 'Who' },
  { id: 1, title: 'Input System', label: 'Setup' },
  { id: 2, title: 'Behavior', label: 'Stability' },
  { id: 3, title: 'PSA', label: 'Calibrate' },
  { id: 4, title: 'Results', label: 'Final' },
];

export const DEFAULT_DPI = 0;
export const DEFAULT_SENSITIVITY = 0;
export const TARGET_eDPI = 280;

export const GAME_YAW_VALUES: Record<Game, number> = {
  valorant: 1,
  cs2: 3.18,
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
    games: ['valorant'],
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
    games: ['valorant', 'cs2'],
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

export const PRACTICE_TIPS = [
  'Practice makes perfect - put in the reps daily',
  'Sometimes copying pro settings won\'t help - find what works for YOU',
  'Consistency is the key to perfect aim, not the sensitivity',
  'Sometimes your opponent is just having a really good day',
  'Focus on your fundamentals before tweaking settings',
  'Your aim will fluctuate - that\'s normal, even for pros',
  'Mchanics matter more than perfect settings',
  'Don\'t change settings after every bad game',
  'Sleep and nutrition affect aim more than you think',
  'Warm up properly before ranked - your future self will thank you',
  'Film your gameplay to see what you actually do, not what you think you do',
  'Low sens isn\'t automatically better - it\'s about what you can control',
  'The best sensitivity is the one you can be consistent with',
];

export const BORDERLINE_TIPS = [
  'Warning: Your sensitivity is at a borderline zone, which may affect consistency',
  'Consider testing slightly higher or lower to find your true preference',
  'Many pros settle in the middle after some adjustment period',
];

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
  borderline: {
    pros: 'You have room to explore both ends of the spectrum',
    cons: 'Borderline zone - may feel inconsistent until you commit to a side',
    struggles: 'Finding your true preference',
    advice: 'Test slightly higher and lower to find what clicks for you',
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