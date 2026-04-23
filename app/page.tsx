'use client';

import { useState, useCallback } from 'react';
import styles from './wizard.module.css';

type Step = 0 | 1 | 2 | 3 | 4;

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
      const [tipsRes, senseRes] = await Promise.all([
        fetch('/api/tips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game: data.game,
            edpi: data.dpi * data.inGameSens,
            cm360: parseFloat(((360 * 2.54) / (data.dpi * data.inGameSens * (data.game === 'valorant' ? 0.07 : 0.022))).toFixed(1)),
            label: data.inGameSens < 0.4 ? 'control' : data.inGameSens > 0.8 ? 'speed' : 'balanced',
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
            dpi: data.dpi,
            inGameSens: data.inGameSens,
            grip: data.mouseGrip,
            mousePad: 'cloth',
            game: data.game
          })
        })
      ]);

      const [tips, sense] = await Promise.all([tipsRes.json(), senseRes.json()]);
      
      setResult({
        recommendedSens: tips.recommendedSensitivity || `${sense.optimalSensitivity}`,
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
    <div className={styles.wizardContainer}>
      {currentStep > 0 && (
        <div className={styles.progressBar}>
          {[1, 2, 3, 4].map(step => (
            <div 
              key={step}
              className={`${styles.progressStep} ${currentStep >= step ? styles.active : ''} ${currentStep === step ? styles.current : ''}`}
            >
              <div className={styles.stepDot}>{step}</div>
              <span className={styles.stepLabel}>{step === 1 ? 'Game' : step === 2 ? 'Hardware' : step === 3 ? 'Style' : 'Result'}</span>
            </div>
          ))}
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill}
              style={{ width: ((currentStep - 1) / 3 * 100) + '%' }}
            />
          </div>
        </div>
      )}

      <div className={styles.content}>
        {currentStep === 0 && (
          <div className={`${styles.stepContent} ${styles.fadeIn}`}>
            <h1 className={styles.stepTitle}>Welcome to TrueSens</h1>
            <p className={styles.stepSubtitle}>AI-Powered Sensitivity Calibration</p>
            <p className={styles.stepDesc}>Optimize your aim with personalized sensitivity recommendations powered by AI. Enter your setup, and we'll calculate your perfect sensitivity settings.</p>
            
            <button className={styles.nextBtn} onClick={handleNext}>
              Get Started →
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <div className={`${styles.stepContent} ${styles.fadeIn}`}>
            <h2 className={styles.stepTitle}>Hardware Setup</h2>
            <p className={styles.stepSubtitle}>Tell us about your gear</p>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>DPI</label>
              <input
                type="number"
                className={styles.input}
                value={data.dpi}
                onChange={(e) => setData({ ...data, dpi: parseInt(e.target.value) || 400 })}
                min={400}
                max={3200}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>In-Game Sensitivity</label>
              <input
                type="number"
                className={styles.input}
                value={data.inGameSens}
                onChange={(e) => setData({ ...data, inGameSens: parseFloat(parseFloat(e.target.value).toFixed(2)) || 0.5 })}
                min={0.1}
                max={10}
                step={0.01}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.backBtn} onClick={handleBack}>ΓåÉ Back</button>
              <button className={styles.nextBtn} onClick={handleNext}>Next ΓåÆ</button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className={`${styles.stepContent} ${styles.fadeIn}`}>
            <h2 className={styles.stepTitle}>Playstyle & Grip</h2>
            <p className={styles.stepSubtitle}>How do you play?</p>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Playstyle</label>
              <div className={styles.optionGrid}>
                {(['wrist', 'arm', 'hybrid'] as const).map(style => (
                  <button
                    key={style}
                    className={`${styles.optionBtn} ${data.playstyle === style ? styles.optionActive : ''}`}
                    onClick={() => setData({ ...data, playstyle: style })}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Mouse Grip</label>
              <div className={styles.optionGrid}>
                {(['fingertip', 'claw', 'palm'] as const).map(grip => (
                  <button
                    key={grip}
                    className={`${styles.optionBtn} ${data.mouseGrip === grip ? styles.optionActive : ''}`}
                    onClick={() => setData({ ...data, mouseGrip: grip })}
                  >
                    {grip.charAt(0).toUpperCase() + grip.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.backBtn} onClick={handleBack}>ΓåÉ Back</button>
              <button 
                className={`${styles.analyzeBtn} ${loading ? styles.loading : ''}`}
                onClick={handleStartAnalysis}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Analyzing...
                  </>
                ) : (
                  'Start Analysis ΓåÆ'
                )}
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className={`${styles.stepContent} ${styles.fadeIn}`}>
            <div className={styles.resultCard}>
              <h2 className={styles.stepTitle}>Analysis Complete</h2>
              <p className={styles.stepSubtitle}>Your personalized sensitivity</p>
              
              {error ? (
                <div className={styles.error}>{error}</div>
              ) : result ? (
                <>
                  <div className={styles.sensDisplay}>
                    <span className={styles.sensValue}>{result.recommendedSens}</span>
                    <span className={styles.sensLabel}>Recommended Sensitivity</span>
                  </div>

                  <div className={styles.scoreDisplay}>
                    <div className={styles.scoreItem}>
                      <span className={styles.scoreValue}>{result.score}</span>
                      <span className={styles.scoreLabel}>Score</span>
                    </div>
                    <div className={styles.scoreItem}>
                      <span className={`${styles.rankBadge} gradienText`}>{result.rank}</span>
                      <span className={styles.scoreLabel}>Rank</span>
                    </div>
                  </div>

                  <div className={styles.insightsList}>
                    {result.insights.map((insight, i) => (
                      <div key={i} className={styles.insightItem}>
                        <span className={styles.insightNum}>{i + 1}</span>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>

                  <a href="/dashboard" className={styles.dashboardBtn}>
                    Go to Dashboard ΓåÆ
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
