'use client';

import { useWizard } from '@/hooks/useWizard';
import { ProgressIndicator } from './ProgressIndicator';
import { WelcomeStep } from './WelcomeStep';
import { SetupStep } from './SetupStep';
import { PresetStep } from './PresetStep';
import { PSAStep } from './PSAStep';
import { BenchmarkStep } from './BenchmarkStep';
import { ResultsStep } from './ResultsStep';
import { motion, AnimatePresence } from 'framer-motion';

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
            setup={state.setup}
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
            setup={state.setup}
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
            onResults={setResults}
            onRestart={reset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-12">
        {currentStep > 0 && currentStep < 5 && (
          <ProgressIndicator currentStep={currentStep} />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.98 }}
            transition={{ 
              duration: 0.25, 
              ease: [0.25, 0.46, 0.45, 0.94],
              opacity: { duration: 0.2 }
            }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}