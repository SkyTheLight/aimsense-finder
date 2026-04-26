# TrueSens System Technical Documentation

Generated: 2026-04-27
Version: 1.0.0

---

## 1. CURRENT APP FLOW

The wizard has **5 steps** (step IDs 0–4):

| Step | Name | File | Collects |
|------|------|------|----------|
| 0 | Welcome | `WelcomeStep.tsx` | User starts here, clicks "Start Now" |
| 1 | Setup | `SetupStep.tsx` | Game (Valorant/CS2), DPI, Sensitivity |
| 2 | Equipment | `EquipmentStep.tsx` | Mouse grip, aiming mechanic, mouse weight, size feel, mousepad size/surface, running out of space |
| 3 | PSA | `PSAStep.tsx` | Binary search calibration → final psaValue |
| 4 | Results | `ResultsStep.tsx` | Display with 4 mode tabs |

### Wizard Data Flow
```
WizardContainer.tsx
  ├── state.setup (UserSetup)
  ├── state.selectedPreset (ProPreset)
  ├── state.psaIterations (PSAIteration[])
  ├── state.psaFinal (number | null)
  ├── state.aimStyle (AimStyleData | null)
  └── state.benchmarks (BenchmarkScores | null)
```

---

## 2. DATA STRUCTURES

### UserSetup (types/index.ts)
```typescript
type Game = 'valorant' | 'cs2';

type MouseGrip = 'palm' | 'claw' | 'fingertip';
type AimingMechanic = 'wrist' | 'arm' | 'hybrid';
type MouseWeight = 'ultralight' | 'light' | 'medium' | 'heavy' | 'unknown';
type MouseSizeFeel = 'too_big' | 'too_small' | 'just_right';
type MousepadSize = 'small' | 'medium' | 'large' | 'xl';
type MousepadSurface = 'control' | 'balanced' | 'speed';
type ArmPosition = 'flat' | 'angled' | 'raised';
type ArmAnchoring = 'anchored' | 'floating';
type SittingPosture = 'upright' | 'leaning' | 'slouched';
type AimIssue = 'overflicking' | 'underflicking' | 'shaky_aim' | 'poor_micro';
type PlayerRole = 'aggressive' | 'passive' | 'hybrid';
type MainWeapon = 'rifle' | 'awp';
type WarmupMethod = 'aim_trainer' | 'deathmatch' | 'range';
type ConsistencyFeeling = 'consistent' | 'inconsistent';

interface UserSetup {
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
```

### WizardState (types/index.ts)
```typescript
interface WizardState {
  currentStep: number;
  setup: UserSetup;
  selectedPreset: ProPreset | null;
  psaIterations: PSAIteration[];
  psaFinal: number | null;
  aimStyle: AimStyleData | null;
  benchmarkMode: 'simplified' | 'detailed';
  benchmarks: BenchmarkScores | null;
  simplified: SimplifiedRatings | null;
  results: FinalResults | null;
}
```

### Analysis Result (lib/analysis.ts)
```typescript
interface AnalysisResult {
  sensitivity: SensitivityRecommendation;
  aimType: AimTypeResult;
  consistency: ConsistencyScore;
  equipment: EquipmentSuggestion;
  posture: PostureCorrection;
  warmup: WarmupPlan;
  issues: AimIssue[];
}

interface SensitivityRecommendation {
  recommendedSens: number;
  edpi: number;
  change: number;
  reason: string;
}

interface AimTypeResult {
  type: 'flick_heavy' | 'tracking_heavy' | 'hybrid' | 'panic_aimer';
  confidence: number;
}

interface ConsistencyScore {
  score: number;
  breakdown: string;
}
```

### Coach Input (lib/coach.ts)
```typescript
interface CoachInput {
  user: UserSetup;
  analysis: {
    aimType: string;
    consistencyScore: number;
    sensAdjustmentPercent: number;
    signals: {
      overflicking: number;
      underflicking: number;
      instability: number;
    };
    issues: string[];
  };
}
```

### Coach Output (lib/coach.ts)
```typescript
interface CoachOutput {
  mainLimitingFactor: string;
  holdingBack: string[];
  sensChange: string;
  mustDoNext: string[];
  fixOrder: { first: string; second: string; optional: string };
  status: 'improving' | 'stable' | 'declining';
  nextStepRule: string;
  feedbackQuestion: string;
}
```

### Dashboard Input/Output (lib/dashboard.ts)
```typescript
interface DashboardOutput {
  performanceTrend: string;
  scoreEvolution: { current: number; average: number; best: number };
  aimEvolution: { current: string; previous: string | null; trend: string };
  issuePattern: { recurring: string[]; frequency: Record<string, number> };
  improvementInsight: string;
}
```

### Learning Output (lib/learning.ts)
```typescript
interface LearningOutput {
  playerModel: string;
  behaviorPatterns: string[];
  ruleAdjustments: { type: string; change: string; reason: string }[];
  nextSessionStrategy: string;
}
```

---

## 3. CALCULATION LOGIC

### Core Metrics (lib/calculations.ts)

#### eDPI
```typescript
edpi = dpi × sensitivity
```

#### cm/360
```typescript
cm360 = (360 × 2.54) / (dpi × sensitivity × gameYaw)
// gameYaw: valorant = 1, cs2 = 3.18
```

### Pro Baselines (lib/calculations.ts)
```typescript
// PRO eDPI RANGES
const ranges = {
  valorant: { min: 200, max: 400, avg: 280 },
  cs2: { min: 600, max: 1200, avg: 800 }
};
```

### cm/360 Classification
```typescript
// STRICT RULES
< 30 cm  → TOO FAST (UNSTABLE) - NOT RECOMMENDED
30-40 cm → FAST
40-45 cm → BALANCED (Pro baseline)
45-60 cm → SLOW
> 60 cm  → TOO SLOW (LIMITED) - NOT RECOMMENDED
```

---

## 4. ANALYSIS ENGINE (lib/analysis.ts)

### analyzePlayer() Flow
```typescript
export function analyzePlayer(
  setup: {
    dpi: number; sensitivity: number; game: Game;
    mouseWeight: MouseWeight | null; mouseSizeFeel: MouseSizeFeel | null;
    aimIssues: AimIssue[]; mousepadSize: MousepadSize | null;
    mousepadSurface: MousepadSurface | null; runningOutOfSpace: boolean | null;
    armPosition: ArmPosition | null; armAnchoring: ArmAnchoring | null;
    sittingPosture: SittingPosture | null; warmup: boolean | null;
    warmupDuration: number | null; warmupMethod: WarmupMethod | null;
    consistencyFeeling: ConsistencyFeeling | null; mainWeapon: MainWeapon | null;
    playerRole: PlayerRole | null; biggestAimingIssue: AimIssue | null;
    mouseGrip: MouseGrip | null; aimingMechanic: AimingMechanic | null;
  },
  playstyle: string | null
): AnalysisResult
```

### Signal Computation

#### overflicking Signal
- Counts issues with 'overflicking'
- Also detected if sensitivity > 1.0 with wrist aim

#### underflicking Signal  
- Counts issues with 'underflicking'
- Also detected if sensitivity < 0.3 with arm aim

#### instability Signal
- Counts issues with 'shaky_aim', 'poor_micro'
- Also detected if:
  - low consistency + no warmup
  - slouched posture
  - floating arm + high sens

### Aim Type Classification (detectAimType)
```
flick_heavy   = flick playstyle + (wrist OR overflicking issue)
tracking_heavy = tracking playstyle + (arm OR shaking issue)
hybrid       = balanced playstyle
panic_aimer  = inconsistent + high sens + no routine
```

### Consistency Score Calculation (calculateConsistencyScore)
- Base: 50 points
- +20 if consistent warmup routine
- +15 if good posture (upright/leaning + anchored)
- +15 if comfortable mouse weight/size
- -10 to -30 for each issue present
- Score capped at 0-100

### Sensitivity Recommendation (analyzeAimIssues)
```
EDPI < 200   → increase
EDPI > 400   → decrease (Valorant)
EDPI > 1200   → decrease (CS2)

Issues:
- overflicking   → -8%
- underflicking → +8%
- instability   → stabilize (no change, fix root cause)
```

---

## 5. PSA SYSTEM (components/wizard/PSAStep.tsx)

### When PSA Runs
- Step 3 in wizard (after Identity + Setup + Equipment)
- Binary search between two bounds

### PSA Logic
```typescript
interface PSAIteration {
  iteration: number;
  low: number;
  high: number;
  mid: number;
  choice: 'low' | 'high' | null;
}

// Binary search
mid = (low + high) / 2
// User chooses low or high preference
// New range becomes [low, mid] or [mid, high]
// After 5 iterations, final = mid
```

### PSA Output
- `psaIterations` array stored in state
- Final `psaFinal` = midpoint after 5 iterations

---

## 6. SENSITIVITY DECISION LOGIC

### Priority Order (FINAL SENSITIVITY)

1. **PSA Value** (if user completed PSA step)
2. **cm/360 Classification**
   - < 30 → force increase
   - > 60 → force decrease
3. **User Issues**
   - overflicking → lower sens
   - underflicking → raise sens
4. **Pro Baseline**
   - Target average pro eDPI for game
5. **Grip/Mechanic**
   - Wrist + high sens = risk of overflick
   - Arm + low sens = risk of underflick

### Formula (calculateFinalSensitivity)
```typescript
baseSens = psaValue OR 0.4
override = analyzeAimIssues(aimIssues, edpi, game)
voltaicMod = calculateVoltaicModifier(tracking, flicking, switching)
finalSens = baseSens × presetBias × aimBias × voltaicMod + override
```

---

## 7. AI COACH SYSTEM (lib/coach.ts)

### Input to coach.ts
```typescript
{
  user: UserSetup,
  analysis: {
    aimType: "flick-heavy" | "tracking-heavy" | "hybrid" | "panic-aimer",
    consistencyScore: number,
    sensAdjustmentPercent: number,
    signals: { overflicking, underflicking, instability },
    issues: AimIssue[]
  }
}
```

### Deterministic Logic (coach.ts)

#### mainLimitingFactor
- Low consistency → foundation unstable message
- Overflick + instability → sensitivity + arm issue
- Overflick → sensitivity too high
- Shaky → fatigue/poor posture

#### sensChange
- `change === 0` → "Do NOT change sensitivity yet"
- `change < 0` → Decrease by X%
- `change > 0` → Increase by X%

#### fixOrder
1. If consistency < 50: "Establish warm-up" → "Lock sensitivity"
2. If shaky/poor_micro: "Fix posture" → "Apply sens change"
3. Otherwise: sens change → track → fine-tune

### AI-Generated (from coach data)

The coach uses user data to personalize messages but the logic is deterministic. Key decisions are rule-based.

---

## 8. RESULTS PAGE (components/wizard/ResultsStep.tsx)

### Always Shown
- Sensitivity recommendation (e.g., 0.412)
- eDPI
- cm/360
- Pro comparison (percentile)
- Practice tips (from API)

### Mode Tabs (4 modes)

| Mode | Source | Output |
|------|--------|---------|
| Fix (coach) | coach.ts | Main limiting factor, Sens change, Must do next, Fix order |
| Dash (dashboard) | dashboard.ts | Performance trend, Score evolution, Issue patterns |
| Learn (learning) | learning.ts | Player model, Behavior patterns, Rule adjustments |
| Sys (architecture) | architecture.ts | System flow, Bottlenecks, Improvements |

### Tab Switching
```typescript
const [activeMode, setActiveMode] = useState<'coach' | 'dashboard' | 'learning' | 'architecture'>('coach');
// Only one mode visible at a time
```

---

## 9. DATA FLOW DIAGRAM

```
USER INPUT
    ↓
WizardContainer.tsx (state management)
    ↓
┌─────────────────────────────────────────┐
│ STEP 0: WelcomeStep                   │
│   - User clicks "Start Now"             │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ STEP 1: SetupStep                       │
│   - Game (Valorant/CS2)                │
│   - DPI input                          │
│   - Sensitivity input                 │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ STEP 2: EquipmentStep                   │
│   - Mouse grip                        │
│   - Aim mechanic                      │
│   - Mouse weight/size                 │
│   - Mousepad                          │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ STEP 3: PSAStep                         │
│   - Binary search (5 iterations)       │
│   - psaFinal = mid after 5 iterations  │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ STEP 4: ResultsStep                     │
│                                        │
│   ┌──────────────────────────┐         │
│   │ analysis.ts              │         │
│   │ analyzePlayer(setup)    │─────────→ AnalysisResult
│   └──────────────────────────┘         │
│                ↓                      │
│   ┌────���─────────────────────┐         │
│   │ coach.ts                 │─────────→ Coach Output (Fix mode)
│   │ convertAnalysisToCoachInp │         │
│   │ analyzeUserWithData()    │         │
│   └──────────────────────────┘         │
│                ↓                      │
│   ┌──────────────────────────┐         │
│   │ dashboard.ts           │─────────→ Dashboard Output
│   │ generateDashboard()   │         │
│   └──────────────────────────┘         │
│                ↓                      │
│   ┌──────────────────────────┐         │
│   │ learning.ts              │─────────→ Learning Output
│   │ generateLearningSystem()│         │
│   └──────────────────────────┘         │
│                ↓                      │
│   ┌──────────────────────────┐         │
│   │ architecture.ts          │─────────→ Architecture Output
│   │ generateArchitecture()  │         │
│   └──────────────────────────┘         │
│                                        │
│ UI Mode Tabs:                           │
│ - Fix / Dash / Learn / Sys             │
│ (Only one active at a time)            │
└─────────────────────────────────────────┘
```

---

## 10. KEY FILES REFERENCE

### Core Calculation Files
- `lib/calculations.ts` - eDPI, cm/360, pro ranges
- `lib/analysis.ts` - Analysis engine, signals, aim type, consistency

### Engine Files
- `lib/coach.ts` - Decision engine, one-button fix
- `lib/dashboard.ts` - Progress tracking
- `lib/learning.ts` - System adaptation
- `lib/architecture.ts` - System insights

### Wizard Components
- `components/wizard/WizardContainer.tsx` - State management
- `components/wizard/ResultsStep.tsx` - Display + mode tabs
- `components/wizard/PSAStep.tsx` - Calibration

### Types
- `types/index.ts` - All TypeScript interfaces

---

## 11. VALIDATED GAMES

Only these two games are supported:

| Game | Pro eDPI Range | Pro eDPI Average | cm/360 Ideal |
|------|---------------|------------------|--------------|
| Valorant | 200-400 | 280 | 40 |
| CS2 | 600-1200 | 800 | 40 |

Unsupported games (removed):
- Apex Legends
- Overwatch 2
- Fortnite

---

## 12. CM/360 CLASSIFICATION RULES (STRICT)

| cm/360 | Classification | Action |
|--------|----------------|--------|
| < 30 | TOO FAST (UNSTABLE) | Force increase sens, NOT RECOMMENDED |
| 30-40 | FAST | Acceptable for close-range |
| 40-45 | BALANCED | Pro baseline, RECOMMENDED |
| 45-60 | SLOW | Acceptable for precision |
| > 60 | TOO SLOW (LIMITED) | Force decrease sens, NOT RECOMMENDED |

---

## 13. LIMITATIONS & KNOWN ISSUES

1. **No persistent history** - Sessions not stored long-term
2. **No feedback loop** - User cannot report if A/B/C/D helped
3. **PSA is binary search** - Not guided by analysis (could be improved)
4. **Architecture mode is static** - Not computed from real data
5. **History mode needs backend** - Currently no session storage

---

## 14. CONFIGURATION CONSTANTS

### lib/constants.ts
```typescript
STEPS = [
  { id: 0, title: 'Welcome', label: 'Start' },
  { id: 1, title: 'Setup', label: 'Configure' },
  { id: 2, title: 'Equipment', label: 'Gear' },
  { id: 3, title: 'PSA Method', label: 'Calibrate' },
  { id: 4, title: 'Results', label: 'Final' },
];

PRO_eDPI_RANGES = {
  valorant: { min: 200, max: 400, avg: 280 },
  cs2: { min: 600, max: 1200, avg: 800 },
};

GAME_YAW_VALUES = {
  valorant: 1,
  cs2: 3.18,
};
```

---

## 14. NEW: DETERMINISTIC SENSITIVITY ENGINE (lib/calculations.ts)

Added: `calculateDeterministicSens()` function

```typescript
interface SensitivityResult {
  recommendedSens: number;
  cm360: number;
  eDPI: number;
  classification: {
    label: string;
    status: 'unstable' | 'fast' | 'balanced' | 'slow' | 'limited';
    action: string;
    forced: boolean;
  };
  adjustment: number;
  reason: string;
  forcedCorrection: boolean;
}

// HARD CM/360 RULES
// < 30 cm → TOO FAST → MUST SLOW DOWN
// 30-40 cm → FAST
// 40-45 cm → BALANCED
// 45-60 cm → SLOW  
// > 60 cm → TOO SLOW → MUST SPEED UP

// TARGET RANGES BY GAME
valorant: { min: 35, max: 55, ideal: 42 }
cs2: { min: 30, max: 50, ideal: 40 }
```

---

End of Documentation