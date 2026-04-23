'use client';

import { useWizard } from '@/hooks/useWizard';
import { ProgressIndicator } from './ProgressIndicator';
import { WelcomeStep } from './WelcomeStep';
import { WarningStep } from './WarningStep';
import { SetupStep } from './SetupStep';
import { PresetStep } from './PresetStep';
import { PSAStep } from './PSAStep';
import { BenchmarkStep } from './BenchmarkStep';
import { ResultsStep } from './ResultsStep';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.98 },
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

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

  const { currentStep } = state;

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

  return (
    <div className="min-h-screen bg-[#030407] overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[60vh] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(6,182,217,0.08),transparent_60%)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100%] h-[40vh] bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(168,85,247,0.05),transparent_60%)]" />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-6 py-5"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">TrueSens</span>
          </div>
          <a 
            href="/dashboard" 
            className="text-sm text-[#b8c0cd] hover:text-white transition-colors"
          >
            Dashboard
          </a>
        </div>
      </motion.header>

      {/* Progress */}
      {currentStep > 0 && currentStep < 5 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 px-6 mb-4"
        >
          <div className="max-w-4xl mx-auto">
            <ProgressIndicator currentStep={currentStep} />
          </div>
        </motion.div>
      )}

      {/* Content */}
      <main className="relative z-10 px-4 sm:px-6 py-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ 
                duration: 0.35, 
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}