'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, MousePointer, Zap, Gauge, Crosshair, Activity,
  Settings, History, Play, Sun, Moon, Download, RefreshCw,
  ChevronRight, TrendingUp, TrendingDown, Minus, Wifi, Zap as Lightning,
  Video, FileText, Share2, Copy, ExternalLink, Calendar,
  Trophy, Award, Medal, Crown, Star, Sparkles, BookOpen,
  MessageCircle, Send, Bell, Volume2, VolumeX, Smartphone, Monitor,
  ArrowRight, Maximize2, MoreHorizontal
} from 'lucide-react';

interface MetricCard {
  id: string;
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  description?: string;
}

interface PerformanceData {
  score: number;
  rank: string;
  rankColor: string;
  rankIcon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

interface SensitivityHistory {
  date: string;
  value: number;
  score: number;
}

interface TrainingVideo {
  id: number;
  title: string;
  creator: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
}

interface AICoachTip {
  id: number;
  text: string;
  priority: 'high' | 'medium' | 'low';
}

const TrueSensDashboard = () => {
  // ===================== STATE =====================
  const [isLoading, setIsLoading] = useState(true);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeNav, setActiveNav] = useState('dashboard');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Data state
  const [sensitivityData, setSensitivityData] = useState({
    current: 0.50,
    recommended: 0.48,
    change: -4,
    min: 0.46,
    max: 0.54
  });
  const [sensitivitySlider, setSensitivitySlider] = useState(0.50);
  const [sliderPosition, setSliderPosition] = useState(50);

  // ===================== STATIC DATA =====================
  const performanceData: PerformanceData = {
    score: 71,
    rank: 'Diamond',
    rankColor: '#B9F2FF',
    rankIcon: <Crown className="w-4 h-4" />,
    trend: 'stable',
    confidence: 65
  };

  const metrics: MetricCard[] = [
    { id: 'accuracy', label: 'Accuracy', value: 71, trend: 'up', icon: <Crosshair className="w-5 h-5" />, description: 'Overall aim precision' },
    { id: 'tracking', label: 'Tracking', value: 40, trend: 'down', icon: <MousePointer className="w-5 h-5" />, description: 'Moving target ability' },
    { id: 'flick', label: 'Flick Precision', value: 35, trend: 'down', icon: <Zap className="w-5 h-5" />, description: 'Snap shot accuracy' },
    { id: 'speed', label: 'Speed', value: 65, trend: 'up', icon: <Gauge className="w-5 h-5" />, description: 'Target acquisition' },
    { id: 'consistency', label: 'Consistency', value: 60, trend: 'stable', icon: <Activity className="w-5 h-5" />, description: 'Score stability' },
  ];

  const sensitivityHistory: SensitivityHistory[] = [
    { date: '2024-01', value: 0.52, score: 68 },
    { date: '2024-02', value: 0.50, score: 70 },
    { date: '2024-03', value: 0.55, score: 65 },
    { date: '2024-04', value: 0.48, score: 72 },
    { date: '2024-05', value: 0.50, score: 71 },
  ];

  const trainingVideos: TrainingVideo[] = [
    { id: 1, title: 'Advanced Tracking Drills for Ranked', creator: 'AimLab Pro', thumbnail: 'red', duration: '15:32', views: '125K', category: 'Tracking' },
    { id: 2, title: 'Flick Accuracy Fundamentals', creator: 'Valorant Coach', thumbnail: 'blue', duration: '22:15', views: '89K', category: 'Flicking' },
    { id: 3, title: 'Micro Adjustment Mastery', creator: 'Senzera', thumbnail: 'purple', duration: '18:45', views: '156K', category: 'Precision' },
  ];

  const coachTips: AICoachTip[] = [
    { id: 1, text: 'Focus on smooth horizontal tracking for 15 minutes daily', priority: 'high' },
    { id: 2, text: 'Reduce grip tension - aim for 50% pressure during flicks', priority: 'high' },
    { id: 3, text: 'Film your sessions weekly to identify patterns', priority: 'medium' },
    { id: 4, text: 'Practice one skill per session, not multiple', priority: 'low' },
  ];

  const rankTiers = [
    { name: 'Iron', color: '#6B7280', icon: <Minus className="w-3 h-3" /> },
    { name: 'Bronze', color: '#CD7F32', icon: <Medal className="w-3 h-3" /> },
    { name: 'Silver', color: '#C0C0C0', icon: <Award className="w-3 h-3" /> },
    { name: 'Gold', color: '#FFD700', icon: <Trophy className="w-3 h-3" /> },
    { name: 'Platinum', color: '#00CED1', icon: <Star className="w-3 h-3" /> },
    { name: 'Diamond', color: '#B9F2FF', icon: <Crown className="w-3 h-3" /> },
    { name: 'Ascendant', color: '#00FF7F', icon: <Sparkles className="w-3 h-3" /> },
    { name: 'Radiant', color: '#FF6B6B', icon: <Star className="w-3 h-3" /> },
  ];

  // ===================== EFFECTS =====================
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // ===================== HANDLERS =====================
  const handleRecalibrate = useCallback(() => {
    setIsRecalibrating(true);
    setTimeout(() => {
      setIsRecalibrating(false);
      setSensitivityData(prev => ({ ...prev, current: prev.recommended }));
    }, 2500);
    if (soundEnabled) {
      // Play sound
    }
  }, [soundEnabled]);

  const handleSliderChange = useCallback((value: number) => {
    setSensitivitySlider(value);
    setSliderPosition(((value - 0.1) / 0.9) * 100);
  }, []);

  const handleExport = useCallback(() => {
    const data = `Performance Score: ${performanceData.score}/100
Rank: ${performanceData.rank}
Confidence: ${performanceData.confidence}%
Current Sensitivity: ${sensitivityData.current}
Recommended Sensitivity: ${sensitivityData.recommended}

Metrics:
${metrics.map(m => `${m.label}: ${m.value}`).join('\n')}`;

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `truesens-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [performanceData, sensitivityData, metrics]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My TrueSens Profile',
          text: `Check out my aim stats! Score: ${performanceData.score}/100 | Rank: ${performanceData.rank}`,
          url: window.location.href
        });
      } catch (err) {
        // Handle error
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, [performanceData]);

  // ===================== STYLES =====================
  const bg = darkMode ? 'bg-[#0B0E14]' : 'bg-slate-50';
  const sidebarBg = darkMode ? 'bg-[#0F1118]' : 'bg-white';
  const cardBg = darkMode ? 'bg-[#151820]' : 'bg-white';
  const borderColor = darkMode ? 'border-slate-800/50' : 'border-slate-200';
  const textPrimary = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = darkMode ? 'text-slate-400' : 'text-slate-500';
  const textMuted = darkMode ? 'text-slate-500' : 'text-slate-400';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Target },
    { id: 'analyzer', label: 'Analyzer', icon: Settings },
    { id: 'history', label: 'History', icon: History },
    { id: 'training', label: 'Training', icon: Play },
  ];

  const getRankPosition = (rank: string) => rankTiers.findIndex(r => r.name === rank);

  // ===================== RENDER =====================
  if (isLoading) {
    return (
      <div className={`${bg} min-h-screen flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-xl shadow-purple-500/30"
          >
            <span className="text-3xl font-black text-white">T</span>
          </motion.div>
          <div className="flex flex-col items-center gap-2">
            <p className={`text-lg font-medium ${textPrimary}`}>Initializing TrueSens</p>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-purple-500"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bg} min-h-screen flex`}>
      {/* ===================== SIDEBAR ===================== */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`${sidebarBg} w-72 h-screen fixed left-0 top-0 flex flex-col z-50 hidden md:flex`}
      >
        {/* Visual divider gradient */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-r from-transparent to-purple-500/10" />
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-xl font-black text-white">T</span>
            </div>
            <div>
              <h1 className={`text-lg font-bold ${textPrimary}`}>TrueSens</h1>
              <p className={`text-xs ${textSecondary}`}>Aim Optimization</p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                activeNav === item.id
                  ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-cyan-400 border border-purple-500/20 shadow-lg shadow-purple-500/10'
                  : `${textSecondary} hover:${textPrimary} hover:bg-white/5`
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {activeNav === item.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Rank Progress */}
        <div className="p-4 border-t border-slate-800">
          <div className={`${cardBg} rounded-xl p-4 border ${borderColor}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold ${textMuted}`}>Rank Progress</span>
              <span className="text-xs font-bold text-purple-400">85%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {rankTiers.slice(0, 4).map((rank) => {
                const position = getRankPosition(rank.name);
                const currentPos = getRankPosition(performanceData.rank);
                return (
                  <div
                    key={rank.name}
                    className={`w-2 h-2 rounded-full ${
                      position <= currentPos ? '' : 'bg-slate-700'
                    }`}
                    style={{ backgroundColor: position <= currentPos ? rank.color : undefined }}
                  >
                    {rank.icon}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="p-4 border-t border-slate-800">
          <div className={`${cardBg} rounded-xl p-4 border ${borderColor}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className={`text-xs font-medium ${textSecondary}`}>System Online</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={textMuted}>Latency</span>
                <span className="text-green-400 font-mono">12ms</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={textMuted}>Server</span>
                <span className="text-green-400 font-mono">US-East</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={textMuted}>API Status</span>
                <span className="text-green-400 font-mono">Healthy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl ${textSecondary} hover:${textPrimary} transition-colors`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl ${textSecondary} hover:${textPrimary} transition-colors`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="flex-1 min-h-screen md:ml-72 lg:ml-72 xl:ml-80">
        <div className="pr-8 py-6 max-w-[1600px] mx-auto">
          
          {/* Mobile Header */}
          <div className="flex md:hidden items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-lg font-bold text-white">T</span>
              </div>
              <span className="font-bold text-white">TrueSens</span>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl bg-slate-800">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* ===================== HEADER ===================== */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary}`}>Dashboard</h1>
              <p className={`text-sm ${textSecondary}`}>
                Welcome back • {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className={`flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl ${textSecondary} hover:${textPrimary} ${cardBg} border ${borderColor} transition-all`}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden md:inline font-medium">Share</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                className={`flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl ${textSecondary} hover:${textPrimary} ${cardBg} border ${borderColor} transition-all`}
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline font-medium">Export</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRecalibrate}
                disabled={isRecalibrating}
                className="flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-50"
              >
                {isRecalibrating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Lightning className="w-4 h-4" />
                )}
                <span>{isRecalibrating ? 'Analyzing...' : 'Recalibrate'}</span>
              </motion.button>
            </div>
          </motion.header>

          {/* ===================== SCORE SECTION ===================== */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Performance Score Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`${cardBg} ${borderColor} rounded-2xl p-6 md:p-8 relative overflow-hidden group lg:row-span-2`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-transparent" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-xs font-semibold uppercase tracking-widest ${textMuted}`}>
                    Performance Score
                  </span>
                  <div className="flex items-center gap-2">
                    {performanceData.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                    {performanceData.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                    {performanceData.trend === 'stable' && <Minus className="w-4 h-4 text-slate-500" />}
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400"
                  >
                    {performanceData.score}
                  </motion.span>
                  <span className={`text-lg ${textMuted}`}>/ 100</span>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold mb-6"
                  style={{
                    backgroundColor: `${performanceData.rankColor}15`,
                    color: performanceData.rankColor,
                    boxShadow: `0 0 20px ${performanceData.rankColor}30`,
                  }}
                >
                  {performanceData.rankIcon}
                  {performanceData.rank} Tier
                </motion.div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${textSecondary}`}>Trend</span>
                    <span className={`text-sm font-medium capitalize ${
                      performanceData.trend === 'up' ? 'text-green-400' :
                      performanceData.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {performanceData.trend}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${textSecondary}`}>Confidence</span>
                    <span className="text-sm font-medium text-cyan-400">{performanceData.confidence}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${textSecondary}`}>Last Updated</span>
                    <span className="text-sm font-medium text-slate-400">Just now</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {metrics.slice(0, 4).map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + index * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`${cardBg} ${borderColor} rounded-2xl p-4 md:p-5 relative overflow-hidden group cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="text-cyan-400">{metric.icon}</span>
                      <span className={`text-xs font-bold ${
                        metric.trend === 'up' ? 'text-green-400' :
                        metric.trend === 'down' ? 'text-red-400' : 'text-slate-500'
                      }`}>
                        {metric.trend === 'up' && '↑'}
                        {metric.trend === 'down' && '↓'}
                        {metric.trend === 'stable' && '→'}
                      </span>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white mt-auto mb-1">
                      {metric.value}
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      {metric.label}
                    </div>
                  </div>
                </motion.div>
              ))}
              {/* 5th Card (Consistency) - Centered */}
              <motion.div
                key={metrics[4].id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`${cardBg} ${borderColor} rounded-2xl p-4 md:p-5 relative overflow-hidden group cursor-pointer col-span-2 md:col-span-1 md:mx-auto md:w-full`}
                style={{ maxWidth: '280px' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <span className="text-cyan-400">{metrics[4].icon}</span>
                    <span className={`text-xs font-bold ${
                      metrics[4].trend === 'up' ? 'text-green-400' :
                      metrics[4].trend === 'down' ? 'text-red-400' : 'text-slate-500'
                    }`}>
                      {metrics[4].trend === 'up' && '↑'}
                      {metrics[4].trend === 'down' && '↓'}
                      {metrics[4].trend === 'stable' && '→'}
                    </span>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mt-auto mb-1">
                    {metrics[4].value}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    {metrics[4].label}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ===================== SENSITIVITY SECTION ===================== */}
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`${cardBg} ${borderColor} rounded-2xl p-6 md:p-8 backdrop-blur-xl bg-opacity-80 relative overflow-hidden`}
            style={{ 
              background: `linear-gradient(135deg, ${darkMode ? '#151820cc' : '#ffffffcc'}, ${darkMode ? '#0f1118cc' : '#f8fafccc'})`,
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 rounded-2xl" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500/50 via-transparent to-cyan-500/50" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h2 className={`text-xl font-bold ${textPrimary}`}>Sensitivity Engine</h2>
                <p className={`text-sm ${textSecondary}`}>AI-powered optimization</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-400">AI POWERED</span>
              </div>
            </div>

            {/* Values Row */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <motion.div whileHover={{ scale: 1.02 }} className={`${cardBg} border ${borderColor} rounded-2xl p-4 md:p-6 text-center`}>
                <div className={`text-xs font-semibold uppercase tracking-widest ${textMuted} mb-2 md:mb-3`}>Current</div>
                <div className="text-3xl md:text-4xl font-mono font-bold text-slate-300">
                  {sensitivityData.current.toFixed(2)}
                </div>
              </motion.div>

              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <ChevronRight className="w-6 md:w-8 h-6 md:h-8 text-green-400" />
                  <span className="text-sm font-bold text-green-400">
                    {sensitivityData.change > 0 ? '+' : ''}{sensitivityData.change}%
                  </span>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-2xl p-4 md:p-6 text-center relative overflow-hidden" style={{ boxShadow: '0 0 40px rgba(139, 92, 246, 0.15)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5" />
                <div className="relative z-10">
                  <div className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-2 md:mb-3">Recommended</div>
                  <div className="text-3xl md:text-4xl font-mono font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {sensitivityData.recommended.toFixed(2)}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Slider */}
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div className="flex items-center justify-between text-sm">
                <span className={textSecondary}>Optimal Range</span>
                <span className="font-mono text-sm text-slate-300">
                  {sensitivityData.min.toFixed(2)} - {sensitivityData.max.toFixed(2)}
                </span>
              </div>
              
              <div className="relative h-2 md:h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div className="absolute h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 rounded-full" style={{ width: '66%' }} />
                <input type="range" min="0.1" max="1" step="0.01" value={sensitivitySlider} onChange={(e) => handleSliderChange(parseFloat(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <motion.div className="absolute top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 bg-white rounded-full shadow-lg shadow-purple-500/30 border-2 border-purple-500 z-10" style={{ left: `calc(${sliderPosition}% - 8px)` }} />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>0.10</span>
                <span className="text-cyan-400 font-bold text-sm">{sensitivitySlider.toFixed(2)}</span>
                <span>1.00</span>
              </div>
            </div>

            {/* Action Button */}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleRecalibrate} disabled={isRecalibrating} className="w-full flex items-center justify-center gap-2 px-6 py-3 md:py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isRecalibrating ? (<><RefreshCw className="w-5 h-5 animate-spin" /><span>Analyzing Sensitivity...</span></>) : (<><Lightning className="w-5 h-5" /><span>Recalibrate with New Sensitivity</span></>)}
            </motion.button>
          </motion.section>

          {/* ===================== AI COACH & TRAINING ===================== */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* AI Coach */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className={`${cardBg} ${borderColor} rounded-2xl p-6`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-lg">🧠</span>
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${textPrimary}`}>AI Coach</h2>
                    <p className={`text-xs ${textSecondary}`}>Personalized guidance</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30">
                  <Zap className="w-3 h-3 text-purple-400" />
                  <span className="text-xs font-bold text-purple-400">AI POWERED</span>
                </div>
              </div>

              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Priority Focus</span>
                </div>
                <p className="text-purple-300 font-medium">Improve tracking smoothness</p>
              </motion.div>

              <div className="space-y-3">
                {coachTips.map((tip, index) => (
                  <motion.div key={tip.id} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.55 + index * 0.1 }} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {tip.id}
                    </div>
                    <p className="text-sm text-slate-300">{tip.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Training Videos */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className={`${cardBg} ${borderColor} rounded-2xl p-6`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${textPrimary}`}>Training Videos</h2>
                    <p className={`text-xs ${textSecondary}`}>Recommended for you</p>
                  </div>
                </div>
                <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {trainingVideos.map((video, index) => (
                  <motion.div key={video.id} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 + index * 0.1 }} className="flex gap-4 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group">
                    <div className={`w-24 md:w-32 h-14 md:h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      video.thumbnail === 'red' ? 'bg-gradient-to-br from-red-500/30 to-red-600/30' :
                      video.thumbnail === 'blue' ? 'bg-gradient-to-br from-blue-500/30 to-blue-600/30' :
                      'bg-gradient-to-br from-purple-500/30 to-purple-600/30'
                    }`}>
                      <Play className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">{video.title}</h3>
                      <p className="text-xs text-slate-500">{video.creator}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>{video.duration}</span>
                        <span>•</span>
                        <span>{video.views} views</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ===================== SENSITIVITY HISTORY ===================== */}
          <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className={`${cardBg} ${borderColor} rounded-2xl p-6`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className={`text-xl font-bold ${textPrimary}`}>Sensitivity History</h2>
                <p className={`text-sm ${textSecondary}`}>Your journey over time</p>
              </div>
              <div className="flex gap-2">
                {['D', 'W', 'M'].map((range, i) => (
                  <button key={range} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${i === 1 ? 'bg-purple-500/20 text-purple-400' : `${textSecondary} hover:text-white`}`}>
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="h-48 flex items-end gap-2 md:gap-3">
              {sensitivityHistory.map((item, i) => (
                <motion.div key={item.date} initial={{ height: 0 }} animate={{ height: `${item.score}%` }} transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }} className="flex-1 bg-gradient-to-t from-purple-500/50 to-cyan-500/50 rounded-t-lg relative group cursor-pointer">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded text-xs text-white whitespace-nowrap z-10">
                    <div className="font-bold">{item.value.toFixed(2)}</div>
                    <div className="text-slate-400">Score: {item.score}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-between mt-3 text-xs text-slate-500">
              {sensitivityHistory.map((item) => (
                <span key={item.date}>{item.date.split('-')[1]}</span>
              ))}
            </div>
          </motion.section>

          {/* ===================== FOOTER ===================== */}
          <footer className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 md:pt-8 border-t border-slate-800">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>TrueSens v2.0</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Powered by Groq AI</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Built with Next.js</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Live Data</span>
            </div>
          </footer>
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <motion.div initial={{ x: -100 }} animate={{ x: 0 }} exit={{ x: -100 }} className="w-64 h-full bg-[#0F1118] p-4" onClick={(e) => e.stopPropagation()}>
              {/* Same nav content */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrueSensDashboard;
