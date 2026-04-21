'use client';

import { useState, useEffect, useCallback } from 'react';
import { WizardState, UserSetup, PSAIteration, AimStyleData, BenchmarkScores, SimplifiedRatings, FinalResults, ProPreset } from '@/types';
import { saveWizardState, loadWizardState } from '@/lib/storage';

const initialState: WizardState = {
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

export function useWizard() {
  const [state, setState] = useState<WizardState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = loadWizardState();
    if (saved) {
      setState(saved);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveWizardState(state);
    }
  }, [state, isHydrated]);

  const setStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 6) }));
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