'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, Sparkles } from 'lucide-react';
import { useWizard } from '@/hooks/useWizard';
import { ProgressIndicator } from './ProgressIndicator';
import { WelcomeStep } from './WelcomeStep';
import { WarningStep } from './WarningStep';
import { SetupStep } from './SetupStep';
import { PresetStep } from './PresetStep';
import { PSAStep } from './PSAStep';
import { BenchmarkStep } from './BenchmarkStep';
import { ResultsStep } from './ResultsStep';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const pageVariants = {
  initial: { opacity: 0, y: 18, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -14, scale: 0.985 },
};

const themeStorageKey = 'truesens-theme';

export function WizardContainer() {
  const {
    state,
    nextStep,
    prevStep,
    setSetup,
    setSelectedPreset,
    setPSAIterations,
    setPSAFinal,
    setBenchmarks,
    setResults,
    reset,
  } = useWizard();

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { currentStep } = state;

  useEffect(() => {
    const savedTheme = typeof window !== 'undefined' ? window.localStorage.getItem(themeStorageKey) : null;
    const systemPrefersDark =
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : systemPrefersDark ? 'dark' : 'light';
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onStart={nextStep} />;
      case 1:
        return (
          <SetupStep
            setup={state.setup}
            onSetupChange={setSetup}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 2:
        return (
          <PresetStep
            setup={state.setup}
            selectedPreset={state.selectedPreset}
            selectedAimStyle={state.setup?.aimingMechanic || 'hybrid'}
            selectedGrip={state.setup?.mouseGrip || 'claw'}
            onPresetChange={setSelectedPreset}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <PSAStep
            setup={state.setup || null}
            selectedPreset={state.selectedPreset}
            iterations={state.psaIterations}
            onIterationsChange={setPSAIterations}
            onPSAFinalChange={setPSAFinal}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <BenchmarkStep
            benchmarks={state.benchmarks}
            simplified={state.simplified}
            onBenchmarksChange={setBenchmarks}
            onSimplifiedChange={() => {}}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <ResultsStep
            setup={state.setup || null}
            selectedPreset={state.selectedPreset}
            psaValue={state.psaFinal}
            aimStyle={state.aimStyle}
            simplified={
              state.benchmarks
                ? {
                    tracking: state.benchmarks.tracking || 5,
                    flicking: state.benchmarks.flicking || 5,
                    switching: state.benchmarks.switching || 5,
                  }
                : { tracking: 5, flicking: 5, switching: 5 }
            }
            onResults={(results) => {
              setResults(results);
              nextStep();
            }}
            onRestart={reset}
          />
        );
      case 6:
        return (
          <WarningStep
            results={state.results!}
            onConfirm={() => nextStep()}
            onBack={prevStep}
            onRestart={reset}
          />
        );
      default:
        return null;
    }
  };

  const showProgress = currentStep > 0 && currentStep < 6;

  return (
    <div className="min-h-screen w-full bg-[var(--app-bg)] text-[var(--app-text-primary)] transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.10),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(168,85,247,0.10),transparent_24%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-[radial-gradient(circle_at_bottom,rgba(14,165,233,0.08),transparent_44%)]" />
      </div>

      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 py-6"
      >
        <div className="flex w-full items-center justify-between rounded-[28px] border border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-3 shadow-[0_18px_50px_rgba(2,6,23,0.08)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-400 to-purple-500 text-white shadow-[0_18px_32px_rgba(14,165,233,0.25)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold tracking-[-0.03em] text-[var(--app-text-primary)]">TrueSens</div>
              <div className="text-xs uppercase tracking-[0.16em] text-[var(--app-text-muted)]">Precision Calibration</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))} />
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-2.5 text-sm font-medium text-[var(--app-text-primary)] transition-colors hover:bg-[var(--app-surface)]"
            >
              <LayoutDashboard className="h-4 w-4 text-[var(--app-accent)]" />
              Dashboard
            </a>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 py-16">
        <div className="flex w-full flex-col space-y-12">
          {showProgress && <ProgressIndicator currentStep={currentStep} />}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
