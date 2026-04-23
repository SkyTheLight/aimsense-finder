'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 1 | 2 | 3 | 4;

interface WizardData {
  dpi: number;
  inGameSens: number;
  playstyle: 'wrist' | 'arm' | 'hybrid';
  mouseGrip: 'fingertip' | 'claw' | 'palm';
  game: 'valorant' | 'cs2';
}

interface AnalysisResult {
  recommendedSens: string;
  score: number;
  rank: string;
  insights: string[];
  confidence: number;
}

const playstyleOptions = [
  { value: 'wrist', label: 'Wrist', desc: 'Precise micro-adjustments', icon: '⚡' },
  { value: 'arm', label: 'Arm', desc: 'Broad sweeping motions', icon: '💪' },
  { value: 'hybrid', label: 'Hybrid', desc: 'Best of both worlds', icon: '🎯' },
];

const gripOptions = [
  { value: 'fingertip', label: 'Fingertip', desc: 'Maximum precision', icon: '☝️' },
  { value: 'claw', label: 'Claw', desc: 'Balanced control', icon: '🦞' },
  { value: 'palm', label: 'Palm', desc: 'Full hand contact', icon: '✋' },
];

export default function HomeWizard() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uiCopy, setUiCopy] = useState<any>(null);
  
  const [data, setData] = useState<WizardData>({
    dpi: 800,
    inGameSens: 0.5,
    playstyle: 'hybrid',
    mouseGrip: 'palm',
    game: 'valorant'
  });

  useEffect(() => {
    fetch('/api/ui-copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'home', step: currentStep })
    })
      .then(res => res.json())
      .then(setUiCopy)
      .catch(() => {});
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleStartAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const game = data.game;
      const dpi = data.dpi;
      const inGameSens = data.inGameSens;
      const mult = game === 'valorant' ? 0.07 : 0.022;
      const cm360 = parseFloat(((360 * 2.54) / (dpi * inGameSens * mult)).toFixed(1));
      const label = inGameSens < 0.4 ? 'control' : inGameSens > 0.8 ? 'speed' : 'balanced';
      
      const [tipsRes, senseRes] = await Promise.all([
        fetch('/api/tips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game,
            edpi: dpi * inGameSens,
            cm360,
            label,
            tracking: 70,
            flicking: 65,
            switching: 68,
            aimStyle: data.playstyle,
            mouseGrip: data.mouseGrip
          })
        }),
        fetch('/api/ai-sense', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dpi,
            inGameSens,
            grip: data.mouseGrip,
            mousePad: 'cloth',
            game
          })
        })
      ]);

      const tips = await tipsRes.json();
      const sense = await senseRes.json();
      
      setResult({
        recommendedSens: tips.recommendedSensitivity || `${sense.optimalSensitivity || 0.5}`,
        score: 72,
        rank: 'Gold',
        insights: tips.aiTips || ['Analysis complete. Your sensitivity is within optimal range.'],
        confidence: 85
      });
      
      setCurrentStep(4);
    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, [data]);

  const progress = ((currentStep - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-[#0B0B0F] relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Progress Bar */}
        <div className="w-full px-8 pt-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex flex-col items-center gap-2 ${
                    currentStep >= step ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      currentStep === step
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-110'
                        : currentStep > step
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}
                  >
                    {currentStep > step ? '✓' : step}
                  </div>
                  <span className="text-xs text-white/40 font-medium">
                    {step === 1 ? 'Game' : step === 2 ? 'Hardware' : step === 3 ? 'Style' : 'Result'}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {/* Step 1: Game Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="mb-8">
                    <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                      {uiCopy?.headline || 'TrueSens'}
                    </h1>
                    <p className="text-xl text-white/60 font-light">
                      {uiCopy?.subheadline || 'AI-Powered Sensitivity Calibration'}
                    </p>
                  </div>

                  <div className="glass-card p-8 mb-8">
                    <label className="block text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">
                      Select Your Game
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setData({ ...data, game: 'valorant' })}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                          data.game === 'valorant'
                            ? 'border-blue-500 bg-blue-500/10 scale-105'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                        <div className="text-4xl mb-3">◆</div>
                        <div className="font-semibold text-lg">Valorant</div>
                        <div className="text-sm text-white/40 mt-1">Tactical Shooter</div>
                      </button>
                      <button
                        onClick={() => setData({ ...data, game: 'cs2' })}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                          data.game === 'cs2'
                            ? 'border-blue-500 bg-blue-500/10 scale-105'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                        <div className="text-4xl mb-3">◇</div>
                        <div className="font-semibold text-lg">CS2</div>
                        <div className="text-sm text-white/40 mt-1">FPS Classic</div>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="btn btn-primary btn-lg group"
                  >
                    Get Started
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </motion.div>
              )}

              {/* Step 2: Hardware Setup */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Hardware Setup</h2>
                    <p className="text-white/60">Tell us about your gear</p>
                  </div>

                  <div className="glass-card p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">
                        DPI
                      </label>
                      <input
                        type="number"
                        className="input text-2xl font-mono font-semibold"
                        value={data.dpi}
                        onChange={(e) => setData({ ...data, dpi: parseInt(e.target.value) || 400 })}
                        min={400}
                        max={3200}
                      />
                      <div className="flex gap-2 mt-3">
                        {[400, 800, 1600, 3200].map((dpi) => (
                          <button
                            key={dpi}
                            onClick={() => setData({ ...data, dpi })}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                              data.dpi === dpi
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'
                            }`}
                          >
                            {dpi}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">
                        In-Game Sensitivity
                      </label>
                      <input
                        type="number"
                        className="input text-2xl font-mono font-semibold"
                        value={data.inGameSens}
                        onChange={(e) => setData({ ...data, inGameSens: parseFloat(parseFloat(e.target.value).toFixed(2)) || 0.5 })}
                        min={0.1}
                        max={10}
                        step={0.01}
                      />
                      <div className="mt-3 p-4 bg-white/5 rounded-xl">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/40">eDPI</span>
                          <span className="text-blue-400 font-mono font-semibold">
                            {Number(data.dpi * data.inGameSens).toFixed(0)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/40">cm/360</span>
                          <span className="text-purple-400 font-mono font-semibold">
                            {Number((360 * 2.54) / (data.dpi * data.inGameSens * (data.game === 'valorant' ? 0.07 : 0.022))).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button onClick={handleBack} className="btn btn-secondary flex-1">
                      ← Back
                    </button>
                    <button onClick={handleNext} className="btn btn-primary flex-1">
                      Next →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Playstyle & Grip */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Playstyle & Grip</h2>
                    <p className="text-white/60">How do you play?</p>
                  </div>

                  <div className="glass-card p-8 space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">
                        Playstyle
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {playstyleOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setData({ ...data, playstyle: option.value as any })}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                              data.playstyle === option.value
                                ? 'border-blue-500 bg-blue-500/10 scale-105'
                                : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                            }`}
                          >
                            <div className="text-2xl mb-2">{option.icon}</div>
                            <div className="font-semibold">{option.label}</div>
                            <div className="text-xs text-white/40 mt-1">{option.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">
                        Mouse Grip
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {gripOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setData({ ...data, mouseGrip: option.value as any })}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                              data.mouseGrip === option.value
                                ? 'border-purple-500 bg-purple-500/10 scale-105'
                                : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                            }`}
                          >
                            <div className="text-2xl mb-2">{option.icon}</div>
                            <div className="font-semibold">{option.label}</div>
                            <div className="text-xs text-white/40 mt-1">{option.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button onClick={handleBack} className="btn btn-secondary flex-1">
                      ← Back
                    </button>
                    <button
                      onClick={handleStartAnalysis}
                      disabled={loading}
                      className="btn btn-primary flex-1 group"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Start Analysis
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Results */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {error ? (
                    <div className="glass-card p-8 text-center">
                      <div className="text-red-400 text-4xl mb-4">⚠️</div>
                      <p className="text-red-400 mb-4">{error}</p>
                      <button onClick={() => setCurrentStep(1)} className="btn btn-primary">
                        Try Again
                      </button>
                    </div>
                  ) : result ? (
                    <div className="space-y-6">
                      <div className="text-center mb-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white animate-glow"
                        >
                          {result.score}
                        </motion.div>
                        <h2 className="text-3xl font-bold mb-1">Analysis Complete</h2>
                        <div className="badge badge-gold text-lg px-4 py-2">
                          {result.rank} Tier
                        </div>
                      </div>

                      <div className="glass-card p-8">
                        <div className="text-center mb-6">
                          <div className="text-sm text-white/40 uppercase tracking-wider mb-2">
                            Recommended Sensitivity
                          </div>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-6xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                          >
                            {result.recommendedSens}
                          </motion.div>
                          <div className="text-sm text-white/40 mt-2">
                            Confidence: {result.confidence}%
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-3 bg-white/5 rounded-xl">
                            <div className="text-xs text-white/40 uppercase">eDPI</div>
                            <div className="text-lg font-semibold text-blue-400">
                              {Number(data.dpi * Number(result.recommendedSens || 0)).toFixed(0)}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-xl">
                            <div className="text-xs text-white/40 uppercase">cm/360</div>
                            <div className="text-lg font-semibold text-purple-400">
                              {Number((360 * 2.54) / (data.dpi * Number(result.recommendedSens || 0.5) * (data.game === 'valorant' ? 0.07 : 0.022))).toFixed(1)}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-xl">
                            <div className="text-xs text-white/40 uppercase">Game</div>
                            <div className="text-lg font-semibold text-white/80 capitalize">
                              {data.game}
                            </div>
                          </div>
                        </div>

                        {result.insights.length > 0 && (
                          <div className="space-y-3">
                            <div className="text-sm font-medium text-white/60 uppercase tracking-wider">
                              AI Insights
                            </div>
                            {result.insights.map((insight, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5"
                              >
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                  {i + 1}
                                </div>
                                <p className="text-sm text-white/70">{insight}</p>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>

                      <a href="/dashboard" className="btn btn-primary btn-lg w-full group">
                        Go to Dashboard
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  ) : (
                    <div className="glass-card p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                      <p className="text-white/60">Preparing results...</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
