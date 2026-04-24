import { WizardState } from '@/types';

const STORAGE_KEY = 'aimsense_data';
const VERSION = '1.0';

function getDefaultState(): WizardState {
  return {
    currentStep: 0,
    setup: { dpi: 0, sensitivity: 0, game: 'valorant', mouseGrip: null, aimingMechanic: null, mouseWeight: null, mouseSizeFeel: null, aimIssues: [], mousepadSize: null, mousepadSurface: null, runningOutOfSpace: null, armPosition: null, armAnchoring: null, sittingPosture: null, warmup: null, warmupDuration: null, warmupMethod: null, consistencyFeeling: null, mainWeapon: null, playerRole: null, biggestAimingIssue: null },
    selectedPreset: null,
    psaIterations: [],
    psaFinal: null,
    aimStyle: null,
    benchmarkMode: 'simplified',
    benchmarks: null,
    simplified: null,
    results: null,
  };
}

export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = { version: VERSION, data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function loadFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    
    const parsed = JSON.parse(raw);
    if (parsed.version !== VERSION) {
      console.log('Data version mismatch, using defaults');
      return null;
    }
    return parsed.data as T;
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
    return null;
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to remove from localStorage:', e);
  }
}

export function saveWizardState(state: WizardState): void {
  saveToStorage(STORAGE_KEY, state);
}

export function loadWizardState(): WizardState | null {
  const defaultState = getDefaultState();
  const saved = loadFromStorage<WizardState>(STORAGE_KEY);
  if (!saved) return defaultState;

  return { ...defaultState, ...saved };
}

export function clearWizardState(): void {
  removeFromStorage(STORAGE_KEY);
}

export function exportProfile(wizardState: WizardState): string {
  const profile = {
    exportedAt: new Date().toISOString(),
    version: VERSION,
    setup: wizardState.setup,
    game: wizardState.setup?.game,
    psaResult: wizardState.psaFinal,
    aimStyle: wizardState.aimStyle,
    finalResults: wizardState.results,
    comparedToPro: wizardState.results?.comparedToPro,
  };
  return JSON.stringify(profile, null, 2);
}