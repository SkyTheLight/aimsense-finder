'use client';

import { useState, useEffect, useCallback } from 'react';
import { WizardState, UserSetup, PSAIteration, AimStyleData, BenchmarkScores, SimplifiedRatings, FinalResults, ProPreset } from '@/types';
import { saveWizardState, loadWizardState } from '@/lib/storage';

const initialState: WizardState = {
  currentStep: 0,
  setup: { dpi: 0, sensitivity: 0, game: 'valorant', mouseGrip: null, aimingMechanic: null,
    mouseWeight: null, mouseSizeFeel: null, aimIssues: [], mousepadSize: null, mousepadSurface: null,
    runningOutOfSpace: null, armPosition: null, armAnchoring: null, sittingPosture: null,
    warmup: null, warmupDuration: null, warmupMethod: null, consistencyFeeling: null,
    mainWeapon: null, playerRole: null, biggestAimingIssue: null },
  selectedPreset: null,
  psaIterations: [],
  psaFinal: null,
  aimStyle: null,
  benchmarkMode: 'simplified',
  benchmarks: null,
  simplified: null,
  results: null,
};

export function useWizard() {
  const [state, setState] = useState<WizardState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  console.log('[useWizard] Initializing, state:', initialState);

  useEffect(() => {
    console.log('[useWizard] Mounted, loading state...');
    try {
      const saved = loadWizardState();
      // Reset if: step > 6 (invalid), or step 5+ without valid setup data
      const needsReset = !saved || 
        saved.currentStep > 6 || 
        (saved.currentStep >= 5 && (!saved.setup || saved.setup.dpi <= 0 || saved.setup.sensitivity <= 0));
      
      if (needsReset) {
        console.log('[useWizard] Invalid saved state, resetting to step 0', { saved });
        setState(initialState);
      } else {
        console.log('[useWizard] Loaded saved state:', saved);
        setState(saved);
      }
    } catch (e) {
      console.error('[useWizard] Load error:', e);
    }
    setIsHydrated(true);
  }, []);

  console.log('[useWizard] Render, isHydrated:', isHydrated, 'currentStep:', state.currentStep);

  const setStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 5) }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 0) }));
  }, []);

  const setSetup = useCallback((setup: UserSetup) => {
    setState(prev => ({ ...prev, setup }));
  }, []);

  const setSelectedPreset = useCallback((preset: ProPreset | null) => {
    setState(prev => ({ ...prev, selectedPreset: preset }));
  }, []);

  const setPSAIterations = useCallback((iterations: PSAIteration[]) => {
    setState(prev => ({ ...prev, psaIterations: iterations }));
  }, []);

  const setPSAFinal = useCallback((value: number | null) => {
    setState(prev => ({ ...prev, psaFinal: value }));
  }, []);

  const setAimStyle = useCallback((aimStyle: AimStyleData) => {
    setState(prev => ({ ...prev, aimStyle }));
  }, []);

  const setBenchmarkMode = useCallback((mode: 'manual' | 'simplified') => {
    setState(prev => ({ ...prev, benchmarkMode: mode }));
  }, []);

  const setBenchmarks = useCallback((benchmarks: BenchmarkScores | null) => {
    setState(prev => ({ ...prev, benchmarks }));
  }, []);

  const setSimplified = useCallback((simplified: SimplifiedRatings | null) => {
    setState(prev => ({ ...prev, simplified }));
  }, []);

  const setResults = useCallback((results: FinalResults | null) => {
    setState(prev => ({ ...prev, results }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aimsense_data');
    }
  }, []);

  return {
    state,
    isHydrated,
    setStep,
    nextStep,
    prevStep,
    setSetup,
    setSelectedPreset,
    setPSAIterations,
    setPSAFinal,
    setAimStyle,
    setBenchmarkMode,
    setBenchmarks,
    setSimplified,
    setResults,
    reset,
  };
}