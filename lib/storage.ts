import { WizardState } from '@/types';

const STORAGE_KEY = 'aimsense_data';

export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function loadFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
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
  const defaultState: WizardState = {
    currentStep: 0,
    setup: null,
    selectedPreset: null,
    psaIterations: [],
    psaFinal: null,
    aimStyle: null,
    benchmarkMode: 'simplified',
    benchmarks: null,
    simplified: null,
    results: null,
  };

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
    setup: wizardState.setup,
    psaResult: wizardState.psaFinal,
    aimStyle: wizardState.aimStyle,
    finalResults: wizardState.results,
  };
  return JSON.stringify(profile, null, 2);
}