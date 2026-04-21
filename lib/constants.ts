import { Game, ProPreset } from '@/types';

export const STEPS = [
  { id: 0, title: 'Welcome', label: 'Start' },
  { id: 1, title: 'Setup', label: 'Configure' },
  { id: 2, title: 'Pro Presets', label: 'Presets' },
  { id: 3, title: 'PSA Method', label: 'Calibrate' },
  { id: 4, title: 'Aim Style', label: 'Profile' },
  { id: 5, title: 'Benchmarks', label: 'Test' },
  { id: 6, title: 'Results', label: 'Final' },
];

export const DEFAULT_DPI = 800;
export const DEFAULT_SENSITIVITY = 0.5;
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
  min: 0.05,
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
    id: 'tenz_style',
    name: 'TenZ Pro',
    description: 'Medium sens, flick-focused',
    edpiRange: { min: 200, max: 320 },
    dpi: 800,
    sensitivity: 0.28,
    playstyle: 'flick',
    games: ['valorant'],
    icon: '🎯',
    color: '#00ff88',
  },
  {
    id: 'asuna_style',
    name: 'Asuna',
    description: 'High sens, tracking-focused',
    edpiRange: { min: 280, max: 400 },
    dpi: 1600,
    sensitivity: 0.22,
    playstyle: 'tracking',
    games: ['valorant'],
    icon: '⚡',
    color: '#6366f1',
  },
  {
    id: 'tenz_low',
    name: 'Low Sens Tactician',
    description: 'Lower sens, precise control',
    edpiRange: { min: 140, max: 240 },
    dpi: 400,
    sensitivity: 0.4,
    playstyle: 'control',
    games: ['valorant', 'cs2'],
    icon: '🎯',
    color: '#00ff88',
  },
  {
    id: 'derke_style',
    name: 'Derke',
    description: 'Balanced, all-rounder',
    edpiRange: { min: 240, max: 360 },
    dpi: 800,
    sensitivity: 0.35,
    playstyle: 'balanced',
    games: ['valorant'],
    icon: '🔥',
    color: '#ff3366',
  },
  {
    id: 's1mple_style',
    name: 's1mple Legacy',
    description: 'Very low sens, anchor AWP',
    edpiRange: { min: 400, max: 700 },
    dpi: 400,
    sensitivity: 1.0,
    playstyle: 'control',
    games: ['cs2'],
    icon: '🎯',
    color: '#00ff88',
  },
  {
    id: 'ZywOo_style',
    name: 'ZywOo',
    description: 'Low-mid, absolute rifler',
    edpiRange: { min: 350, max: 550 },
    dpi: 400,
    sensitivity: 0.9,
    playstyle: 'control',
    games: ['cs2'],
    icon: '👑',
    color: '#f59e0b',
  },
  {
    id: 'cleave_style',
    name: 'Cleave',
    description: 'Medium sens, entry fragger',
    edpiRange: { min: 400, max: 700 },
    dpi: 800,
    sensitivity: 0.7,
    playstyle: 'balanced',
    games: ['cs2'],
    icon: '💥',
    color: '#3b82f6',
  },
  {
    id: 'high_tracking',
    name: 'High Sens Tracking',
    description: 'Fast sens, movement players',
    edpiRange: { min: 500, max: 900 },
    dpi: 1600,
    sensitivity: 0.5,
    playstyle: 'tracking',
    games: ['apex', 'overwatch2'],
    icon: '⚡',
    color: '#6366f1',
  },
  {
    id: 'cod_pro',
    name: 'CoD Pro',
    description: 'Medium sens, fast reactions',
    edpiRange: { min: 300, max: 600 },
    dpi: 800,
    sensitivity: 0.5,
    playstyle: 'flick',
    games: ['cod'],
    icon: '🎮',
    color: '#22c55e',
  },
  {
    id: 'r6_tachanka',
    name: 'R6 Anchor',
    description: 'Low sens, site anchor',
    edpiRange: { min: 500, max: 900 },
    dpi: 800,
    sensitivity: 0.7,
    playstyle: 'control',
    games: ['r6'],
    icon: '🛡️',
    color: '#f97316',
  },
];

export const VOLTAIC_SCORE_THRESHOLDS = {
  novice: { tracking: 25, flicking: 25, switching: 25 },
  intermediate: { tracking: 40, flicking: 40, switching: 40 },
  advanced: { tracking: 55, flicking: 55, switching: 55 },
  elite: { tracking: 70, flicking: 70, switching: 70 },
  pro: { tracking: 85, flicking: 85, switching: 85 },
};

export const AIM_LAB_TASKS = {
  tracking: [
    { id: 'strafe_track', name: 'Strafe Track', difficulty: 'Medium', avgScore: 35 },
    { id: 'sphere_track', name: 'Sphere Tracking', difficulty: 'Hard', avgScore: 28 },
    { id: 'thin_track', name: 'Thin Track', difficulty: 'Expert', avgScore: 20 },
    { id: 'patience', name: 'Patience', difficulty: 'Hard', avgScore: 30 },
  ],
  flicking: [
    { id: 'sixshot', name: 'Sixshot', difficulty: 'Medium', avgScore: 40 },
    { id: 'reflex_flick', name: 'Reflex Flick', difficulty: 'Hard', avgScore: 32 },
    { id: 'micro_flick', name: 'Micro Flick', difficulty: 'Expert', avgScore: 25 },
    { id: 'tracking_flick', name: 'Tracking Flick', difficulty: 'Hard', avgScore: 28 },
  ],
  switching: [
    { id: 'gridshot', name: 'Gridshot', difficulty: 'Easy', avgScore: 45 },
    { id: 'gridshot_sg', name: 'Gridshot: SG', difficulty: 'Medium', avgScore: 38 },
    { id: 'popcorn', name: 'Popcorn', difficulty: 'Hard', avgScore: 30 },
    { id: 'close_long', name: 'Close Long', difficulty: 'Medium', avgScore: 35 },
  ],
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