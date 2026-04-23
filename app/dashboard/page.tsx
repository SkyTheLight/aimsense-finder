'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';

interface OptimizeData {
  performanceSummary: {
    score: number;
    rank: string;
    confidenceLevel: number;
    trend: string;
  };
  aimAnalysis: {
    issues: string[];
    classification: string;
    coreStrength: string;
    coreWeakness: string;
  };
  sensitivityOptimization: {
    recommendedSens: number;
    optimalRange: { min: number; max: number };
    adjustment: string;
    percentageChange: number;
    reasoning: string[];
  };
  feedback: {
    conditionalUp: string;
    conditionalDown: string;
  };
  trainingPlan: {
    focus: string;
    drills: string[];
  };
}

interface TipsData {
  recommendedSensitivity: string;
  whyThisFits: string;
  aiTips: string[];
  improvementPriority: string;
  hiddenInsight: string;
  confidence: string;
}

interface DiagnosticData {
  skillTier: string;
  percentile: number;
  aimStyle: string;
  consistency: number;
  microScore: number;
  macroScore: number;
  tensionScore: number;
  strengths: string[];
  weaknesses: string[];
  coachingSummary: string;
  priorityFocus: string;
  insight: string;
  videos: { title: string; creator: string; query: string; url: string; why: string }[];
}

interface VideoData {
  videos: { title: string; creator: string; query: string; url: string; note?: string }[];
}

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  const [optimizeData, setOptimizeData] = useState<OptimizeData | null>(null);
  const [tipsData, setTipsData] = useState<TipsData | null>(null);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  
  const [loadingStates, setLoadingStates] = useState({
    optimize: true,
    tips: true,
    diagnostic: true,
    video: true
  });
  const [recalibrating, setRecalibrating] = useState(false);
  const [insightPopup, setInsightPopup] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    setLoadingStates({ optimize: true, tips: true, diagnostic: true, video: true });
    
    const testData = {
      game: 'valorant',
      dpi: 800,
      inGameSens: 0.5,
      playstyle: 'hybrid',
      mouseGrip: 'palm',
      tracking: 72,
      flickPrecision: 68,
      accuracy: 74,
      speed: 65,
      consistency: 70
    };

    try {
      const [optRes, tipsRes, diagRes, vidRes] = await Promise.all([
        fetch('/api/optimize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData)
        }),
        fetch('/api/tips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game: 'valorant',
            edpi: 400,
            cm360: 77,
            label: 'balanced',
            tracking: 72,
            flicking: 68,
            switching: 75,
            aimStyle: 'hybrid',
            mouseGrip: 'palm'
          })
        }),
        fetch('/api/diagnostics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game: 'valorant',
            gridshot: 70,
            sixshot: 68,
            strafeTrack: 72,
            sphereTrack: 65,
            aimStyle: 'hybrid',
            mouseGrip: 'palm'
          })
        }),
        fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weaknesses: ['tracking', 'flicking'],
            game: 'valorant'
          })
        })
      ]);

      const [opt, tips, diag, vid] = await Promise.all([
        optRes.json(),
        tipsRes.json(),
        diagRes.json(),
        vidRes.json()
      ]);

      setOptimizeData(opt);
      setTipsData(tips);
      setDiagnosticData(diag);
      setVideoData(vid);

      if (tips.hiddenInsight) {
        setInsightPopup(tips.hiddenInsight);
        setTimeout(() => setInsightPopup(null), 5000);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoadingStates({ optimize: false, tips: false, diagnostic: false, video: false });
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  async function handleRecalibrate() {
    setRecalibrating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await loadAllData();
    setRecalibrating(false);
  }

  function getRankColor(rank: string): string {
    const colors: Record<string, string> = {
      Iron: '#6B7280',
      Bronze: '#CD7F32',
      Silver: '#C0C0C0',
      Gold: '#FFD700',
      Platinum: '#00CED1',
      Diamond: '#B9F2FF',
      Ascendant: '#00FF7F',
      Radiant: '#FF6B6B',
      Pro: '#FF00FF'
    };
    return colors[rank] || '#3B82F6';
  }

  function getTrendIcon(trend: string): string {
    if (trend === 'Improving') return '↑';
    if (trend === 'Declining') return '↓';
    return '→';
  }

  function getTrendColor(trend: string): string {
    if (trend === 'Improving') return '#10B981';
    if (trend === 'Declining') return '#EF4444';
    return '#6B7280';
  }

  function SkeletonLoader({ width = '100%', height = '20px' }: { width?: string; height?: string }) {
    return <div className={styles.skeleton} style={{ width, height }} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '◈' },
    { id: 'analyzer', label: 'Analyzer', icon: '◎' },
    { id: 'history', label: 'History', icon: '◇' },
    { id: 'training', label: 'Training', icon: '◆' },
    { id: 'settings', label: 'Settings', icon: '☾' }
  ];

  const metrics = [
    { key: 'accuracy', label: 'Accuracy', value: optimizeData?.performanceSummary?.score || 0, icon: '◎' },
    { key: 'tracking', label: 'Tracking', value: diagnosticData?.macroScore || 0, icon: '◇' },
    { key: 'flickPrecision', label: 'Flick', value: diagnosticData?.microScore || 0, icon: '◆' },
    { key: 'speed', label: 'Speed', value: 65, icon: '◉' },
    { key: 'consistency', label: 'Consistency', value: diagnosticData?.consistency || 0, icon: '◇' }
  ];

  return (
    <div className={styles.dashboardContainer}>
      {insightPopup && (
        <div className={styles.insightPopup}>
          <div className={styles.popupContent}>
            <span className={styles.popupIcon}>🧠</span>
            <p>{insightPopup}</p>
            <button onClick={() => setInsightPopup(null)}>×</button>
          </div>
        </div>
      )}

      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>T</span>
          {!sidebarCollapsed && <span className={styles.logoText}>TrueSens</span>}
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className={styles.collapseBtn} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </aside>

      <main className={styles.main}>
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <h1 className={styles.pageTitle}>
              {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className={styles.topBarRight}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>P</div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>Player</span>
                <span 
                  className={styles.rankBadge}
                  style={{ background: getRankColor(optimizeData?.performanceSummary?.rank || 'Gold') }}
                >
                  {optimizeData?.performanceSummary?.rank || 'Gold'}
                </span>
              </div>
            </div>

            <button 
              className={styles.recalibrateBtn}
              onClick={handleRecalibrate}
              disabled={recalibrating}
            >
              <span className={styles.btnIcon}>{recalibrating ? '⟳' : '⚡'}</span>
              {recalibrating ? 'Analyzing...' : 'Recalibrate'}
            </button>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.topSection}>
            <div className={`${styles.scoreCard} glass-card`}>
              <div className={styles.scoreHeader}>
                <span className={styles.scoreLabel}>Performance Score</span>
                {loadingStates.optimize ? (
                  <SkeletonLoader width="80px" height="20px" />
                ) : (
                  <span 
                    className={styles.trendBadge}
                    style={{ color: getTrendColor(optimizeData?.performanceSummary?.trend || 'Stable') }}
                  >
                    {getTrendIcon(optimizeData?.performanceSummary?.trend || 'Stable')} {optimizeData?.performanceSummary?.trend}
                  </span>
                )}
              </div>
              
              <div className={styles.scoreValue}>
                {loadingStates.optimize ? (
                  <SkeletonLoader width="150px" height="80px" />
                ) : (
                  <>
                    <span className="gradient-text">{optimizeData?.performanceSummary?.score || 0}</span>
                    <span className={styles.scoreMax}>/100</span>
                  </>
                )}
              </div>

              <div 
                className={styles.rankBadgeLarge}
                style={{ borderColor: getRankColor(optimizeData?.performanceSummary?.rank || 'Gold') }}
              >
                {loadingStates.optimize ? (
                  <SkeletonLoader width="100px" height="30px" />
                ) : (
                  optimizeData?.performanceSummary?.rank || 'Gold'
                )}
              </div>

              <div className={styles.confidenceBar}>
                <span>Confidence</span>
                <div className={styles.confidenceTrack}>
                  {loadingStates.optimize ? (
                    <SkeletonLoader width="100%" height="8px" />
                  ) : (
                    <div 
                      className={styles.confidenceFill}
                      style={{ width: `${optimizeData?.performanceSummary?.confidenceLevel || 0}%` }}
                    />
                  )}
                </div>
                <span>{optimizeData?.performanceSummary?.confidenceLevel || 0}%</span>
              </div>
            </div>

            <div className={styles.metricsGrid}>
              {metrics.map((metric, i) => (
                <div key={metric.key} className={`${styles.metricCard} glass-card glass-card-hover`}>
                  {loadingStates.optimize ? (
                    <>
                      <SkeletonLoader width="24px" height="24px" />
                      <div className={styles.metricInfo}>
                        <SkeletonLoader width="40px" height="30px" />
                        <SkeletonLoader width="60px" height="16px" />
                      </div>
                    </>
                  ) : (
                    <>
                      <span className={styles.metricIcon}>{metric.icon}</span>
                      <div className={styles.metricInfo}>
                        <span className={styles.metricValue}>{metric.value}</span>
                        <span className={styles.metricLabel}>{metric.label}</span>
                      </div>
                      <span className={styles.trendArrow}>{i % 2 === 0 ? '↑' : '↓'}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.middleSection}>
            <div className={`${styles.sensOptimizer} glass-card`}>
              <h3 className={styles.sectionTitle}>Sensitivity Engine</h3>

              <div className={styles.sensValues}>
                <div className={styles.sensCurrent}>
                  <span className={styles.sensLabel}>Current</span>
                  {loadingStates.optimize ? (
                    <SkeletonLoader width="60px" height="36px" />
                  ) : (
                    <span className={styles.sensNumber}>0.50</span>
                  )}
                </div>
                <div className={styles.sensArrow}>→</div>
                <div className={styles.sensRecommended}>
                  <span className={styles.sensLabel}>Recommended</span>
                  {loadingStates.optimize ? (
                    <SkeletonLoader width="80px" height="36px" />
                  ) : (
                    <span className={`${styles.sensNumber} ${styles.sensHighlight}`}>
                      {optimizeData?.sensitivityOptimization?.recommendedSens || '0.48'}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.sensRange}>
                <span className={styles.rangeLabel}>Optimal Range</span>
                <div className={styles.rangeTrack}>
                  <div 
                    className={styles.rangeFill}
                    style={{ left: '30%', width: '40%' }}
                  ></div>
                  <div 
                    className={styles.rangeThumb}
                    style={{ left: '50%' }}
                  ></div>
                </div>
                <div className={styles.rangeValues}>
                  <span>{optimizeData?.sensitivityOptimization?.optimalRange?.min || 0.45}</span>
                  <span>{optimizeData?.sensitivityOptimization?.recommendedSens || 0.48}</span>
                  <span>{optimizeData?.sensitivityOptimization?.optimalRange?.max || 0.55}</span>
                </div>
              </div>

              <div className={styles.adjustment}>
                <span className={styles.adjustmentLabel}>Adjustment</span>
                <span 
                  className={styles.adjustmentValue}
                  style={{ color: parseFloat(optimizeData?.sensitivityOptimization?.adjustment || '0') < 0 ? '#10B981' : '#F59E0B' }}
                >
                  {optimizeData?.sensitivityOptimization?.adjustment || '-4%'}
                </span>
              </div>

              <button className={styles.testAgainBtn}>
                Test Again
              </button>
            </div>

            <div className={`${styles.performanceGraph} glass-card`}>
              <div className={styles.graphHeader}>
                <h3 className={styles.sectionTitle}>Performance Timeline</h3>
                <div className={styles.timeToggle}>
                  {(['daily', 'weekly', 'monthly'] as const).map(range => (
                    <button
                      key={range}
                      className={`${styles.toggleBtn} ${timeRange === range ? styles.active : ''}`}
                      onClick={() => setTimeRange(range)}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.graphContainer}>
                <div className={styles.graphYAxis}>
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                <div className={styles.graphArea}>
                  <svg className={styles.graphSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 30 L 16 28 L 33 35 L 50 25 L 66 20 L 83 15 L 100 18"
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d="M 0 100 L 0 30 L 16 28 L 33 35 L 50 25 L 66 20 L 83 15 L 100 18 L 100 100 Z"
                      fill="url(#lineGradient)"
                    />
                  </svg>
                </div>
                <div className={styles.graphXAxis}>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.diagnosticsSection}>
            <div className={`${styles.diagnosticsCard} glass-card`}>
              <h3 className={styles.sectionTitle}>Aim Diagnostics</h3>
              {loadingStates.diagnostic ? (
                <div className={styles.diagnosticSkeletons}>
                  <SkeletonLoader height="40px" />
                  <SkeletonLoader height="40px" />
                  <SkeletonLoader height="40px" />
                </div>
              ) : (
                <div className={styles.issuesList}>
                  {(diagnosticData?.weaknesses || ['Tracking smoothness', 'Flick precision']).map((issue, i) => (
                    <div key={i} className={styles.issueItem}>
                      <div className={styles.issueIndicator} style={{ background: i === 0 ? '#EF4444' : '#F59E0B' }} />
                      <span>{issue}</span>
                      <div className={styles.issueBar}>
                        <div className={styles.issueBarFill} style={{ width: `${70 - i * 15}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`${styles.aimStyleCard} glass-card`}>
              <h3 className={styles.sectionTitle}>Aim Style Analysis</h3>
              {loadingStates.diagnostic ? (
                <SkeletonLoader height="100px" />
              ) : (
                <>
                  <div className={styles.aimStyleDisplay}>
                    <span className="gradient-text">{diagnosticData?.aimStyle || 'Hybrid'}</span>
                  </div>
                  <div className={styles.styleBars}>
                    <div className={styles.styleBar}>
                      <span>Flick</span>
                      <div className={styles.barTrack}>
                        <div className={styles.barFill} style={{ width: `${diagnosticData?.microScore || 70}%` }} />
                      </div>
                    </div>
                    <div className={styles.styleBar}>
                      <span>Track</span>
                      <div className={styles.barTrack}>
                        <div className={styles.barFill} style={{ width: `${diagnosticData?.macroScore || 75}%` }} />
                      </div>
                    </div>
                    <div className={styles.styleBar}>
                      <span>Switch</span>
                      <div className={styles.barTrack}>
                        <div className={styles.barFill} style={{ width: `${diagnosticData?.consistency || 65}%` }} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.coachSection}>
            <div className={`${styles.coachCard} glass-card`}>
              <div className={styles.coachHeader}>
                <h3 className={styles.sectionTitle}>AI Coach</h3>
                <span className={styles.aiPoweredBadge}>AI POWERED</span>
              </div>
              {loadingStates.tips ? (
                <div className={styles.tipsSkeletons}>
                  <SkeletonLoader height="24px" />
                  <SkeletonLoader height="24px" />
                  <SkeletonLoader height="24px" />
                  <SkeletonLoader height="24px" />
                </div>
              ) : (
                <>
                  <div className={styles.priorityCard}>
                    <span className={styles.priorityLabel}>Priority Focus</span>
                    <span className={styles.priorityValue}>{tipsData?.improvementPriority || diagnosticData?.priorityFocus}</span>
                  </div>
                  <ul className={styles.tipsList}>
                    {(tipsData?.aiTips || diagnosticData?.strengths || []).slice(0, 4).map((tip, i) => (
                      <li key={i} className={styles.tipItem}>
                        <span className={styles.tipNumber}>{i + 1}</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                  {tipsData?.hiddenInsight && (
                    <div className={styles.hiddenInsight}>
                      <span className={styles.insightLabel}>Hidden Insight</span>
                      <p>{tipsData.hiddenInsight}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className={`${styles.trainingCard} glass-card`}>
              <h3 className={styles.sectionTitle}>Training Recommendations</h3>
              {loadingStates.video ? (
                <div className={styles.videoSkeletons}>
                  <SkeletonLoader height="80px" />
                  <SkeletonLoader height="80px" />
                </div>
              ) : (
                <div className={styles.videoList}>
                  {(videoData?.videos || diagnosticData?.videos || []).slice(0, 3).map((video, i) => (
                    <div key={i} className={styles.videoItem}>
                      <div className={styles.videoThumb}>
                        <span>▶</span>
                      </div>
                      <div className={styles.videoInfo}>
                        <span className={styles.videoTitle}>{video.title}</span>
                        <span className={styles.videoCreator}>{video.creator}</span>
                        <span className={styles.videoWhy}>{video.why || video.note || 'Improve your aim'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className={styles.viewAllBtn}>View All Training</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}