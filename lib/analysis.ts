'use strict';

import type {
  MouseWeight,
  MouseGrip,
  MouseSizeFeel,
  AimIssue,
  MousepadSize,
  MousepadSurface,
  ArmPosition,
  ArmAnchoring,
  SittingPosture,
  WarmupMethod,
  ConsistencyFeeling,
  PlayerRole,
  MainWeapon,
  AimingMechanic,
  Game,
} from '@/types';

export interface SensitivityRecommendation {
  recommendedSens: number;
  edpi: number;
  change: number;
  reason: string;
}

export interface AimTypeResult {
  type: 'flick_heavy' | 'tracking_heavy' | 'hybrid' | 'panic_aimer';
  confidence: number;
  description: string;
}

export interface ConsistencyScore {
  score: number;
  grade: string;
  factors: {
    warmupHabit: number;
    postureStability: number;
    sensAimStyleMatch: number;
    mouseControl: number;
  };
}

export interface EquipmentSuggestion {
  mouse?: string;
  mousepad?: string;
  advice: string;
}

export interface PostureCorrection {
  armPosition?: ArmPosition;
  recommendations: string[];
}

export interface WarmupPlan {
  daily: {
    tracking: number;
    flicking: number;
    deathmatch: number;
  };
  weekly: string[];
}

export interface AnalysisResult {
  sensitivity: SensitivityRecommendation;
  aimType: AimTypeResult;
  consistency: ConsistencyScore;
  equipment: EquipmentSuggestion;
  posture: PostureCorrection;
  warmup: WarmupPlan;
  issues: AimIssue[];
}

const EDPI_RANGES = {
  control: { min: 800, max: 1600 },
  balanced: { min: 1600, max: 2400 },
  speed: { min: 2400, max: 4000 },
};

export function analyzeAimIssues(
  issues: AimIssue[],
  edpi: number,
  game: Game
): SensitivityRecommendation {
  let recommendedSens = 0;
  let reason = '';
  let change = 0;

  const hasOverflick = issues.includes('overflicking');
  const hasUnderflick = issues.includes('underflicking');
  const hasShaky = issues.includes('shaky_aim');
  const hasMicro = issues.includes('poor_micro');

  if (hasOverflick && !hasUnderflick) {
    change = -10;
    reason = 'Overflicking detected: Lower sensitivity to reduce overcorrection';
  } else if (hasUnderflick && !hasOverflick) {
    change = 8;
    reason = 'Underflicking detected: Slightly higher sensitivity for faster reactions';
  } else if (hasShaky) {
    change = -5;
    reason = 'Shaky aim: Lower sensitivity for more stability';
  } else if (hasMicro) {
    change = 5;
    reason = 'Micro-adjustments difficulty: Slight increase for precision';
  } else {
    change = 0;
    reason = 'Sensitivity looks good, minor tweaks may help';
  }

  const currentMultiplier = game === 'valorant' ? 1 : 0.314;
  recommendedSens = edpi / (edpi * (change / 100) + 1);
  recommendedSens = Math.max(0.1, Math.min(10, recommendedSens));

  return {
    recommendedSens,
    edpi,
    change,
    reason,
  };
}

export function detectAimType(
  mechanic: AimingMechanic | null,
  playstyle: string | null,
  biggestIssue: AimIssue | null
): AimTypeResult {
  if (mechanic === 'wrist' && (playstyle === 'flick' || playstyle === null)) {
    return {
      type: 'flick_heavy',
      confidence: 85,
      description: 'Fast flicks with wrist-based movement',
    };
  }
  if (mechanic === 'arm' || playstyle === 'tracking') {
    return {
      type: 'tracking_heavy',
      confidence: 80,
      description: 'Smooth tracking with arm movement',
    };
  }
  if (mechanic === 'hybrid') {
    return {
      type: 'hybrid',
      confidence: 75,
      description: 'Balanced flicking and tracking',
    };
  }
  if (biggestIssue === 'overflicking' || biggestIssue === 'underflicking') {
    return {
      type: 'panic_aimer',
      confidence: 70,
      description: 'Reactive aiming with over/under corrections',
    };
  }
  return {
    type: 'hybrid',
    confidence: 60,
    description: 'General balanced playstyle',
  };
}

export function calculateConsistencyScore(
  warmup: boolean | null,
  warmupDuration: number | null,
  warmupMethod: WarmupMethod | null,
  posture: SittingPosture | null,
  anchor: ArmAnchoring | null,
  mechanic: AimingMechanic | null,
  edpi: number,
  grip: MouseGrip | null,
  issues: AimIssue[]
): ConsistencyScore {
  let warmupHabit = 0;
  let postureStability = 0;
  let sensAimStyleMatch = 0;
  let mouseControl = 0;

  if (warmup === true && warmupDuration && warmupDuration >= 10) {
    warmupHabit = 100;
  } else if (warmup === true && warmupDuration && warmupDuration >= 5) {
    warmupHabit = 70;
  } else if (warmup === true) {
    warmupHabit = 40;
  } else {
    warmupHabit = 20;
  }

  if (posture === 'upright') {
    postureStability = 100;
  } else if (posture === 'leaning') {
    postureStability = 70;
  } else {
    postureStability = 40;
  }

  if (anchor === 'anchored') {
    postureStability = Math.max(postureStability, 80);
  }

  if (mechanic === 'arm' && edpi < 1000) {
    sensAimStyleMatch = 90;
  } else if (mechanic === 'wrist' && edpi > 2000) {
    sensAimStyleMatch = 50;
  } else if (mechanic === 'hybrid' && edpi >= 1200 && edpi <= 2200) {
    sensAimStyleMatch = 95;
  } else {
    sensAimStyleMatch = 70;
  }

  if (grip === 'fingertip' && issues.includes('shaky_aim')) {
    mouseControl = 40;
  } else if (issues.length > 2) {
    mouseControl = 40;
  } else if (issues.length > 0) {
    mouseControl = 65;
  } else {
    mouseControl = 85;
  }

  const score = Math.round(
    (warmupHabit * 0.25 +
      postureStability * 0.25 +
      sensAimStyleMatch * 0.3 +
      mouseControl * 0.2)
  );

  let grade = 'F';
  if (score >= 90) grade = 'S';
  else if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 60) grade = 'C';
  else if (score >= 50) grade = 'D';

  return {
    score,
    grade,
    factors: {
      warmupHabit,
      postureStability,
      sensAimStyleMatch,
      mouseControl,
    },
  };
}

export function getEquipmentFeedback(
  mouseWeight: MouseWeight | null,
  grip: MouseGrip | null,
  mouseSize: MouseSizeFeel | null,
  mousepadSurface: MousepadSurface | null,
  issues: AimIssue[]
): EquipmentSuggestion {
  const advice: string[] = [];
  let mouse: string | undefined;
  let mousepad: string | undefined;

  if (grip === 'fingertip' && (mouseWeight === 'heavy' || mouseWeight === 'medium')) {
    mouse = 'Consider a lighter mouse (under 70g) for better fingertip control';
    advice.push('Lighter mouse improves fingertip precision');
  }

  if (issues.includes('overflicking') && mousepadSurface !== 'control') {
    mousepad = 'control';
    advice.push('Control mousepad helps reduce overflicking');
  }

  if (issues.includes('underflicking') && mousepadSurface !== 'speed') {
    mousepad = 'speed';
    advice.push('Speed surface helps faster flicks');
  }

  if (mouseSize === 'too_big') {
    advice.push('Consider a smaller mouse for better control');
  }

  return {
    mouse,
    mousepad,
    advice: advice.join('. '),
  };
}

export function getPostureCorrection(
  armPos: ArmPosition | null,
  anchor: ArmAnchoring | null,
  posture: SittingPosture | null
): PostureCorrection {
  const recommendations: string[] = [];

  if (anchor === 'floating') {
    recommendations.push('Anchor your arm on the desk for stability');
  }

  if (posture === 'slouched') {
    recommendations.push('Sit upright to improve aim consistency');
  }

  if (armPos === 'raised') {
    recommendations.push('Lower arm position to reduce fatigue');
  }

  let newArmPos: ArmPosition | undefined;
  if (armPos === 'raised') {
    newArmPos = 'flat';
  }

  return {
    armPosition: newArmPos,
    recommendations,
  };
}

export function generateWarmupPlan(
  consistency: ConsistencyFeeling | null,
  biggestIssue: AimIssue | null
): WarmupPlan {
  let tracking = 5;
  let flicking = 10;
  let deathmatch = 2;

  if (biggestIssue === 'overflicking' || biggestIssue === 'underflicking') {
    flicking = 15;
    tracking = 5;
  } else if (biggestIssue === 'shaky_aim') {
    tracking = 10;
    flicking = 5;
  }

  if (consistency === 'inconsistent') {
    tracking += 5;
    flicking += 5;
  }

  const weekly: string[] = [
    `Day 1-2: ${tracking}min tracking, ${flicking}min flicking`,
    `Day 3-4: ${tracking + 5}min tracking, ${flicking}min flicking`,
    'Day 5: 2 deathmatches',
    'Day 6-7: Active rest, watch pro gameplay',
  ];

  return {
    daily: {
      tracking,
      flicking,
      deathmatch,
    },
    weekly,
  };
}

export function analyzePlayer(
  setup: {
    dpi: number;
    sensitivity: number;
    game: Game;
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
    mouseGrip: MouseGrip | null;
    aimingMechanic: AimingMechanic | null;
  },
  playstyle: string | null
): AnalysisResult {
  const edpi = setup.dpi * setup.sensitivity;

  const sensitivity = analyzeAimIssues(setup.aimIssues, edpi, setup.game);
  const aimType = detectAimType(
    setup.aimingMechanic,
    playstyle,
    setup.biggestAimingIssue
  );
  const consistency = calculateConsistencyScore(
    setup.warmup,
    setup.warmupDuration,
    setup.warmupMethod,
    setup.sittingPosture,
    setup.armAnchoring,
    setup.aimingMechanic,
    edpi,
    setup.mouseGrip,
    setup.aimIssues
  );
  const equipment = getEquipmentFeedback(
    setup.mouseWeight,
    setup.mouseGrip,
    setup.mouseSizeFeel,
    setup.mousepadSurface,
    setup.aimIssues
  );
  const posture = getPostureCorrection(
    setup.armPosition,
    setup.armAnchoring,
    setup.sittingPosture
  );
  const warmup = generateWarmupPlan(
    setup.consistencyFeeling,
    setup.biggestAimingIssue
  );

  return {
    sensitivity,
    aimType,
    consistency,
    equipment,
    posture,
    warmup,
    issues: setup.aimIssues,
  };
}