'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Copy, Share2, Trophy, TrendingUp, Target, MousePointer } from 'lucide-react';

interface SharedSettings {
  game: string;
  dpi: number;
  sensitivity: number;
  edpi: number;
  cm360: number;
  mouseGrip?: string;
  aimStyle?: string;
  label?: string;
  rank?: string;
  score?: number;
  history?: { date: string; sens: number; score: number }[];
}

const rankColors: Record<string, string> = {
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

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<SharedSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!username) return;
    
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/share/${username}`);
        if (!res.ok) {
          setError('Profile not found');
          return;
        }
        const json = await res.json();
        setData({
          ...json,
          rank: json.rank || 'Gold',
          score: json.score || 72,
          history: json.history || [
            { date: '2024-01', sens: 0.48, score: 65 },
            { date: '2024-02', sens: 0.50, score: 68 },
            { date: '2024-03', sens: 0.49, score: 72 },
          ]
        });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [username]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareProfile = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `@${username} | TrueSens Profile`,
        text: `Check out my aim profile on TrueSens! Rank: ${data?.rank || 'Gold'}`,
        url: window.location.href
      });
    } else {
      copyLink();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center glass-card p-8 max-w-md"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-white mb-2">404 - Not Found</h1>
          <p className="text-white/40 mb-6">@{username} not found</p>
          <a href="/" className="btn btn-primary">
            Go to TrueSens →
          </a>
        </motion.div>
      </div>
    );
  }

  const rank = data.rank || 'Gold';
  const rankColor = rankColors[rank] || '#3B82F6';

  return (
    <div className="min-h-screen bg-[#0B0B0F] relative">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="glass-card p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl font-bold relative"
                style={{
                  background: `linear-gradient(135deg, ${rankColor}20, ${rankColor}40)`,
                  border: `3px solid ${rankColor}60`,
                  boxShadow: `0 0 40px ${rankColor}30, 0 0 80px ${rankColor}20`,
                }}
              >
                {username.charAt(0).toUpperCase()}
                
                {/* Animated ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: `${rankColor}40` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>

              <h1 className="text-3xl font-bold text-white mb-1">@{username}</h1>
              <p className="text-white/40 text-sm mb-4">FPS Sensitivity Profile</p>

              {/* Rank Badge - Animated */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-block px-6 py-3 rounded-2xl font-bold text-lg relative overflow-hidden"
                style={{
                  backgroundColor: `${rankColor}15`,
                  color: rankColor,
                  border: `2px solid ${rankColor}40`,
                  boxShadow: `0 0 30px ${rankColor}20`,
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{ 
                    background: [
                      `linear-gradient(0deg, ${rankColor}00, ${rankColor}40, ${rankColor}00)`,
                      `linear-gradient(360deg, ${rankColor}00, ${rankColor}40, ${rankColor}00)`,
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  {rank} Tier
                </span>
              </motion.div>

              {data.score && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-white/60">Performance Score:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {data.score}
                  </span>
                  <span className="text-white/40">/100</span>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Game', value: data.game.toUpperCase(), icon: <Target className="w-4 h-4" /> },
                { label: 'DPI', value: data.dpi.toString(), icon: <MousePointer className="w-4 h-4" /> },
                { label: 'Sensitivity', value: data.sensitivity.toFixed(2), icon: null },
                { label: 'eDPI', value: data.edpi.toString(), icon: null },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/5"
                >
                  <div className="flex items-center gap-2 mb-1 text-white/40 text-xs uppercase">
                    {stat.icon}
                    {stat.label}
                  </div>
                  <div className="font-mono font-bold text-lg text-white">{stat.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Detailed Stats */}
            <div className="space-y-1 mb-6">
              {[
                { label: 'cm/360', value: data.cm360?.toFixed(1) || '0', mono: true },
                { label: 'Mouse Grip', value: data.mouseGrip || 'Palm', mono: false },
                { label: 'Aim Style', value: data.aimStyle || 'Hybrid', mono: false },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex justify-between items-center py-3 border-b border-white/5 last:border-0"
                >
                  <span className="text-white/40 text-sm">{item.label}</span>
                  <span className={`font-semibold ${item.mono ? 'font-mono text-blue-400' : 'text-white'}`}>
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Sensitivity History Graph */}
            {data.history && data.history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-6 p-4 bg-white/5 rounded-xl"
              >
                <div className="text-sm text-white/40 mb-3 uppercase">Sensitivity History</div>
                <div className="h-24 flex items-end gap-2">
                  {data.history.map((point, i) => (
                    <div key={point.date} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t"
                        style={{
                          height: `${(point.score / 100) * 100}%`,
                          background: `linear-gradient(to top, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.5))`,
                        }}
                      />
                      <span className="text-xs text-white/30">{point.date.split('-')[1]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex gap-3"
            >
              <button
                onClick={copyLink}
                className="flex-1 btn btn-secondary"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={shareProfile}
                className="flex-1 btn btn-primary"
              >
                <Share2 className="w-4 h-4" />
                Share Profile
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center mt-6"
            >
              <a href="/" className="text-sm text-white/40 hover:text-white/60 transition-colors">
                Find your own sensitivity →
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
