'use client';

import { useState, useCallback } from 'react';

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
}

export default function HomeWizard() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [data, setData] = useState<WizardData>({
    dpi: 800,
    inGameSens: 0.5,
    playstyle: 'hybrid',
    mouseGrip: 'palm',
    game: 'valorant'
  });

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
      
      const tipsRes = await fetch('/api/tips', {
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
      });

      const senseRes = await fetch('/api/ai-sense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dpi,
          inGameSens,
          grip: data.mouseGrip,
          mousePad: 'cloth',
          game
        })
      });

      const tips = await tipsRes.json();
      const sense = await senseRes.json();
      
      setResult({
        recommendedSens: tips.recommendedSensitivity || `${sense.optimalSensitivity || 0.5}`,
        score: 72,
        rank: 'Gold',
        insights: tips.aiTips || ['Analysis complete.']
      });
      
      setCurrentStep(4);
    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, [data]);

  return (
    <div className="wizard-container">
      <div className="progress-bar">
        {[1, 2, 3, 4].map(step => (
          <div 
            key={step}
            className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
          >
            <div className="step-dot">{step}</div>
            <span className="step-label">Step {step}</span>
          </div>
        ))}
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{ width: `${((currentStep - 1) / 3 * 100}%` }}
          />
        </div>
      </div>

      <div className="content">
        {currentStep === 1 && (
          <div className="step-content fade-in">
            <h1 className="step-title">Welcome to TrueSens</h1>
            <p className="step-subtitle">AI-Powered Sensitivity Calibration</p>
            
            <div className="form-group">
              <label className="label">Game</label>
              <div className="game-select">
                <button
                  className={`game-btn ${data.game === 'valorant' ? 'game-active' : ''}`}
                  onClick={() => setData({ ...data, game: 'valorant' })}
                >
                  <span>◆</span> Valorant
                </button>
                <button
                  className={`game-btn ${data.game === 'cs2' ? 'game-active' : ''}`}
                  onClick={() => setData({ ...data, game: 'cs2' })}
                >
                  <span>◇</span> CS2
                </button>
              </div>
            </div>

            <button className="next-btn" onClick={handleNext}>
              Get Started →
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-content fade-in">
            <h2 className="step-title">Hardware Setup</h2>
            <p className="step-subtitle">Tell us about your gear</p>
            
            <div className="form-group">
              <label className="label">DPI</label>
              <input
                type="number"
                className="input"
                value={data.dpi}
                onChange={(e) => setData({ ...data, dpi: parseInt(e.target.value) || 400 })}
                min={400}
                max={3200}
              />
            </div>

            <div className="form-group">
              <label className="label">In-Game Sensitivity</label>
              <input
                type="number"
                className="input"
                value={data.inGameSens}
                onChange={(e) => setData({ ...data, inGameSens: parseFloat(parseFloat(e.target.value).toFixed(2)) || 0.5 })}
                min={0.1}
                max={10}
                step={0.01}
              />
            </div>

            <div className="button-group">
              <button className="back-btn" onClick={handleBack}>← Back</button>
              <button className="next-btn" onClick={handleNext}>Next →</button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-content fade-in">
            <h2 className="step-title">Playstyle & Grip</h2>
            <p className="step-subtitle">How do you play?</p>
            
            <div className="form-group">
              <label className="label">Playstyle</label>
              <div className="option-grid">
                {['wrist', 'arm', 'hybrid'] as const).map(style => (
                  <button
                    key={style}
                    className={`option-btn ${data.playstyle === style ? 'option-active' : ''}`}
                    onClick={() => setData({ ...data, playstyle: style as 'wrist' | 'arm' | 'hybrid' })}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="label">Mouse Grip</label>
              <div className="option-grid">
                {['fingertip', 'claw', 'palm'] as const).map(grip => (
                  <button
                    key={grip}
                    className={`option-btn ${data.mouseGrip === grip ? 'option-active' : ''}`}
                    onClick={() => setData({ ...data, mouseGrip: grip as 'fingertip' | 'claw' | 'palm' })}
                  >
                    {grip.charAt(0).toUpperCase() + grip.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="button-group">
              <button className="back-btn" onClick={handleBack}>← Back</button>
              <button 
                className={`analyze-btn ${loading ? 'loading' : ''}`}
                onClick={handleStartAnalysis}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  'Start Analysis →'
                )}
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="step-content fade-in">
            <div className="result-card">
              <h2 className="step-title">Analysis Complete</h2>
              <p className="step-subtitle">Your personalized sensitivity</p>
              
              {error ? (
                <div className="error">{error}</div>
              ) : result ? (
                <>
                  <div className="sens-display">
                    <span className="sens-value">{result.recommendedSens}</span>
                    <span className="sens-label">Recommended Sensitivity</span>
                  </div>

                  <div className="score-display">
                    <div className="score-item">
                      <span className="score-value">{result.score}</span>
                      <span className="score-label">Score</span>
                    </div>
                    <div className="score-item">
                      <span className="rank-badge gradien-text">{result.rank}</span>
                      <span className="score-label">Rank</span>
                    </div>
                  </div>

                  <div className="insights-list">
                    {result.insights.map((insight, i) => (
                      <div key={i} className="insight-item">
                        <span className="insight-num">{i + 1}</span>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>

                  <a href="/dashboard" className="dashboard-btn">
                    Go to Dashboard →
                  </a>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}