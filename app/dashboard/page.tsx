'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface PerformanceData {
  score: number;
  rank: string;
  confidence: number;
  trend: 'Improving' | 'Stable' | 'Declining';
  accuracy: number;
  tracking: number;
  flickPrecision: number;
  speed: number;
  consistency: number;
  currentSens: number;
  recommendedSens: number;
  sensRange: { min: number; max: number };
  adjustment: string;
  aimStyle: string;
  insights: string[];
  history: { date: string; score: number }[];
}

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recalibrating, setRecalibrating] = useState(false);

  useEffect(() => {
    loadPerformanceData();
  }, []);

  async function loadPerformanceData() {
    setLoading(true);
    try {
      const body = JSON.stringify({
        game: 'valorant',
        edpi: 400,
        cm360: 77,
        label: 'balanced',
        tracking: 72,
        flicking: 68,
        switching: 75,
        aimStyle: 'hybrid',
        mouseGrip: 'palm',
        rank: 'platinum'
      });

      const res = await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      const result = await res.json();

      const mockData: PerformanceData = {
        score: 71,
        rank: 'Gold',
        confidence: 78,
        trend: 'Improving',
        accuracy: 74,
        tracking: 72,
        flickPrecision: 68,
        speed: 65,
        consistency: 70,
        currentSens: 0.50,
        recommendedSens: result.recommendedSensitivity?.includes('-') 
          ? parseFloat(result.recommendedSensitivity.split('-')[0]) 
          : parseFloat(result.recommendedSensitivity) || 0.48,
        sensRange: { min: 0.45, max: 0.55 },
        adjustment: '-4%',
        aimStyle: 'Hybrid',
        insights: [
          result.hiddenInsight || 'Your tracking score suggests room for improvement in fluid movements.',
          'Consider micro-adjustments before peeking corners.',
          result.improvementPriority || 'Focus on tracking consistency.'
        ],
        history: [
          { date: 'Mon', score: 65 },
          { date: 'Tue', score: 68 },
          { date: 'Wed', score: 70 },
          { date: 'Thu', score: 69 },
          { date: 'Fri', score: 72 },
          { date: 'Sat', score: 74 },
          { date: 'Sun', score: 71 }
        ]
      };

      setData(mockData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRecalibrate() {
    setRecalibrating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await loadPerformanceData();
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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '◈' },
    { id: 'analyzer', label: 'Sensitivity Analyzer', icon: '◎' },
    { id: 'history', label: 'Performance History', icon: '◇' },
    { id: 'training', label: 'Training Modes', icon: '◆' },
    { id: 'settings', label: 'Settings', icon: '☾' }
  ];

  const metrics = [
    { key: 'accuracy', label: 'Accuracy', value: data?.accuracy || 0, icon: '◎' },
    { key: 'tracking', label: 'Tracking', value: data?.tracking || 0, icon: '◇' },
    { key: 'flickPrecision', label: 'Flick Precision', value: data?.flickPrecision || 0, icon: '◆' },
    { key: 'speed', label: 'Speed', value: data?.speed || 0, icon: '◉' },
    { key: 'consistency', label: 'Consistency', value: data?.consistency || 0, icon: '◇' }
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Analyzing your performance...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
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

        <button 
          className={styles.collapseBtn}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
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
                  style={{ background: getRankColor(data?.rank || 'Gold') }}
                >
                  {data?.rank}
                </span>
              </div>
            </div>

            <button 
              className={styles.recalibrateBtn}
              onClick={handleRecalibrate}
              disabled={recalibrating}
            >
              <span className={styles.btnIcon}>⟳</span>
              {recalibrating ? 'Analyzing...' : 'Recalibrate'}
            </button>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.topSection}>
            <div className={`${styles.scoreCard} glass-card`}>
              <div className={styles.scoreHeader}>
                <span className={styles.scoreLabel}>Performance Score</span>
                <span 
                  className={styles.trendBadge}
                  style={{ color: getTrendColor(data?.trend || 'Stable') }}
                >
                  {getTrendIcon(data?.trend)} {data?.trend}
                </span>
              </div>
              
              <div className={styles.scoreValue}>
                <span className="gradient-text">{data?.score}</span>
                <span className={styles.scoreMax}>/100</span>
              </div>

              <div 
                className={styles.rankBadgeLarge}
                style={{ borderColor: getRankColor(data?.rank || 'Gold') }}
              >
                {data?.rank}
              </div>

              <div className={styles.confidenceBar}>
                <span>Confidence</span>
                <div className={styles.confidenceTrack}>
                  <div 
                    className={styles.confidenceFill}
                    style={{ width: `${data?.confidence || 0}%` }}
                  ></div>
                </div>
                <span>{data?.confidence}%</span>
              </div>
            </div>

            <div className={styles.metricsGrid}>
              {metrics.map(metric => (
                <div key={metric.key} className={`${styles.metricCard} glass-card glass-card-hover`}>
                  <span className={styles.metricIcon}>{metric.icon}</span>
                  <div className={styles.metricInfo}>
                    <span className={styles.metricValue}>{metric.value}</span>
                    <span className={styles.metricLabel}>{metric.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.middleSection}>
            <div className={`${styles.sensOptimizer} glass-card`}>
              <h3 className={styles.sectionTitle}>Sensitivity Optimizer</h3>

              <div className={styles.sensValues}>
                <div className={styles.sensCurrent}>
                  <span className={styles.sensLabel}>Current</span>
                  <span className={styles.sensNumber}>{data?.currentSens}</span>
                </div>
                <div className={styles.sensArrow}>→</div>
                <div className={styles.sensRecommended}>
                  <span className={styles.sensLabel}>Recommended</span>
                  <span className={`${styles.sensNumber} ${styles.sensHighlight}`}>
                    {data?.recommendedSens}
                  </span>
                </div>
              </div>

              <div className={styles.sensRange}>
                <span className={styles.rangeLabel}>Optimal Range</span>
                <div className={styles.rangeTrack}>
                  <div 
                    className={styles.rangeFill}
                    style={{
                      left: '30%',
                      width: '40%'
                    }}
                  ></div>
                  <div 
                    className={styles.rangeThumb}
                    style={{ left: '50%' }}
                  ></div>
                </div>
                <div className={styles.rangeValues}>
                  <span>{data?.sensRange.min}</span>
                  <span>{data?.recommendedSens}</span>
                  <span>{data?.sensRange.max}</span>
                </div>
              </div>

              <div className={styles.adjustment}>
                <span className={styles.adjustmentLabel}>Adjustment</span>
                <span 
                  className={styles.adjustmentValue}
                  style={{ color: parseFloat(data?.adjustment || '0') < 0 ? '#10B981' : '#F59E0B' }}
                >
                  {data?.adjustment}
                </span>
              </div>

              <button className={styles.testAgainBtn}>
                Test Again
              </button>
            </div>

            <div className={`${styles.performanceGraph} glass-card`}>
              <div className={styles.graphHeader}>
                <h3 className={styles.sectionTitle}>Performance History</h3>
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
                      d={data?.history ? `M 0 ${100 - data.history[0].score} ${data.history.map((p, i) => `L ${(i / (data.history.length - 1)) * 100} ${100 - p.score}`).join(' ')}` : ''}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d={data?.history ? `M 0 100 L 0 ${100 - data.history[0].score} ${data.history.map((p, i) => `L ${(i / (data.history.length - 1)) * 100} ${100 - p.score}`).join(' ')} L 100 100 Z` : ''}
                      fill="url(#lineGradient)"
                    />
                  </svg>
                </div>
                <div className={styles.graphXAxis}>
                  {data?.history.map(p => (
                    <span key={p.date}>{p.date}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.bottomSection}>
            <div className={`${styles.aimStyleCard} glass-card`}>
              <h3 className={styles.sectionTitle}>Aim Style Analysis</h3>
              <div className={styles.aimStyleDisplay}>
                <div className={styles.styleLabel}>
                  <span className="gradient-text">{data?.aimStyle}</span>
                </div>
                <div className={styles.styleBars}>
                  <div className={styles.styleBar}>
                    <span>Flick</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div className={styles.styleBar}>
                    <span>Track</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className={styles.styleBar}>
                    <span>Switch</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.insightsCard} glass-card`}>
              <h3 className={styles.sectionTitle}>AI Insights</h3>
              <ul className={styles.insightsList}>
                {data?.insights.map((insight, i) => (
                  <li key={i} className={styles.insightItem}>
                    <span className={styles.insightIcon}>›</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.aiBadge}>
                <span>AI POWERED</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}