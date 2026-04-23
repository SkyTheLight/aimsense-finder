'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, User, MapPin, Gamepad2, ExternalLink, Copy, Twitter, Trash2, Sparkles, TrendingUp, History, Settings } from 'lucide-react';

interface SavedSettings {
  id: number;
  game: string;
  dpi: number;
  sensitivity: number;
  edpi: number;
  cm360: number;
  mouseGrip: string;
  aimStyle: string;
  isCurrent: boolean;
  createdAt: string;
}

interface HistoryEntry {
  id?: number;
  game: string;
  dpi: number;
  sensitivity: number;
  edpi: number;
  cm360: number;
  createdAt?: string;
}

interface ProfileData {
  name?: string;
  email?: string;
  username?: string;
  image?: string;
  bio?: string;
  favoriteGame?: string;
  country?: string;
  isPro?: boolean;
  createdAt?: string;
  _count?: { settings: number; history: number };
}

const games = ['VALORANT', 'CS2', 'APEX', 'OW2', 'FORTNITE', 'COD', 'RAVENS'];
const countries = ['US', 'EU', 'KR', 'JP', 'BR', 'RU', 'IN', 'AU', 'CA', 'UK'];

export default function DashboardPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<SavedSettings[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({});
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ bio: '', favoriteGame: '', country: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
      fetchProfile();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [settingsRes, historyRes] = await Promise.all([
        fetch('/api/user/settings'),
        fetch('/api/user/history'),
      ]);
      const settingsData = await settingsRes.json();
      const historyData = await historyRes.json();
      setSettings(settingsData.settings || []);
      setHistory(historyData.history || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      if (data.user) {
        setProfile(data.user);
        setProfileForm({
          bio: data.user.bio || '',
          favoriteGame: data.user.favoriteGame || '',
          country: data.user.country || '',
        });
        setUsername(data.user.username || '');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const updateProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (data.success) {
        setEditingProfile(false);
        fetchProfile();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const updateUsername = async () => {
    if (!username || username === profile.username) return;
    setUsernameLoading(true);
    setUsernameError('');
    try {
      const res = await fetch('/api/user/username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUsernameError(data.error);
      } else {
        fetchProfile();
        updateSession();
      }
    } catch {
      setUsernameError('Failed to update');
    } finally {
      setUsernameLoading(false);
    }
  };

  const copyLink = () => {
    if (profile.username) {
      navigator.clipboard.writeText(`https://truesens.vercel.app/${profile.username}`);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00d4ff]"></div>
      </div>
    );
  }

  const user = session?.user as any;
  const latestSetting = settings[0];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.06)_0%,transparent_50%)] pointer-events-none -z-10" />
      
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0f]/80 border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">TrueSens</span>
          </a>
          <div className="flex items-center gap-4">
            {user?.image && (
              <img src={user.image} alt="" className="w-9 h-9 rounded-full ring-2 ring-[rgba(0,212,255,0.3)]" />
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm text-[#94a3b8] hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#161a27] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user?.image ? (
                <img src={user.image} alt="" className="w-24 h-24 rounded-2xl ring-4 ring-[rgba(0,212,255,0.2)]" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-[#1c2133] flex items-center justify-center">
                  <User className="w-10 h-10 text-[#64748b]" />
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {profile.username ? `@${profile.username}` : (user?.name || 'Gamer')}
                  </h1>
                  <p className="text-[#64748b] mb-2">{user?.email}</p>
                  {profile.bio && (
                    <p className="text-[#94a3b8] mb-3">{profile.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    {profile.favoriteGame && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-[rgba(0,212,255,0.1)] text-[#00d4ff] rounded-full text-sm">
                        <Gamepad2 className="w-4 h-4" />
                        {profile.favoriteGame}
                      </span>
                    )}
                    {profile.country && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-[rgba(255,255,255,0.06)] text-[#94a3b8] rounded-full text-sm">
                        <MapPin className="w-4 h-4" />
                        {profile.country}
                      </span>
                    )}
                    {profile.username && (
                      <a href={`/${profile.username}`} className="flex items-center gap-1.5 px-3 py-1 bg-[rgba(0,212,255,0.1)] text-[#00d4ff] rounded-full text-sm hover:bg-[rgba(0,212,255,0.2)] transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        View Profile
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="p-2 text-[#64748b] hover:text-white hover:bg-[rgba(255,255,255,0.06)] rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Edit Form */}
          {editingProfile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.06)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-[#94a3b8] mb-2">Username</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="yourname"
                      className="flex-1 px-4 py-2.5 bg-[#0a0a0f] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-[#64748b] focus:border-[#00d4ff] focus:outline-none transition-colors"
                      maxLength={20}
                    />
                    <button
                      onClick={updateUsername}
                      disabled={usernameLoading || username.length < 3}
                      className="px-4 py-2.5 bg-[#00d4ff] text-black font-medium rounded-lg hover:bg-[#00b8e0] transition-colors disabled:opacity-50"
                    >
                      {usernameLoading ? '...' : 'Save'}
                    </button>
                  </div>
                  {usernameError && <p className="text-[#ff3366] text-sm mt-1">{usernameError}</p>}
                </div>
                
                <div>
                  <label className="block text-sm text-[#94a3b8] mb-2">Favorite Game</label>
                  <select
                    value={profileForm.favoriteGame}
                    onChange={(e) => setProfileForm({ ...profileForm, favoriteGame: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0a0f] border border-[rgba(255,255,255,0.1)] rounded-lg text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
                  >
                    <option value="">Select game...</option>
                    {games.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-[#94a3b8] mb-2">Country</label>
                  <select
                    value={profileForm.country}
                    onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0a0f] border border-[rgba(255,255,255,0.1)] rounded-lg text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
                  >
                    <option value="">Select country...</option>
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm text-[#94a3b8] mb-2">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value.slice(0, 500) })}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2.5 bg-[#0a0a0f] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-[#64748b] focus:border-[#00d4ff] focus:outline-none transition-colors resize-none"
                  rows={3}
                />
                <p className="text-xs text-[#64748b] mt-1">{profileForm.bio.length}/500</p>
              </div>
              
              <button
                onClick={updateProfile}
                disabled={profileLoading}
                className="px-6 py-2.5 bg-[#00d4ff] text-black font-medium rounded-lg hover:bg-[#00b8e0] transition-colors disabled:opacity-50"
              >
                {profileLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#161a27] border border-[rgba(255,255,255,0.06)] rounded-xl p-5"
          >
            <TrendingUp className="w-5 h-5 text-[#00d4ff] mb-2" />
            <p className="text-2xl font-bold text-white">{profile._count?.settings || 0}</p>
            <p className="text-sm text-[#64748b]">Saved Settings</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#161a27] border border-[rgba(255,255,255,0.06)] rounded-xl p-5"
          >
            <Sparkles className="w-5 h-5 text-[#00d4ff] mb-2" />
            <p className="text-2xl font-bold text-white">{settings.filter(s => s.isCurrent).length}</p>
            <p className="text-sm text-[#64748b]">Active Profiles</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#161a27] border border-[rgba(255,255,255,0.06)] rounded-xl p-5"
          >
            <History className="w-5 h-5 text-[#00d4ff] mb-2" />
            <p className="text-2xl font-bold text-white">{profile._count?.history || 0}</p>
            <p className="text-sm text-[#64748b]">History Entries</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#161a27] border border-[rgba(255,255,255,0.06)] rounded-xl p-5"
          >
            <Settings className="w-5 h-5 text-[#f59e0b] mb-2" />
            <p className="text-2xl font-bold text-[#f59e0b]">FREE</p>
            <p className="text-sm text-[#64748b]">Plan</p>
          </motion.div>
        </div>

        {/* Current Settings & Share */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-[#161a27] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Current Settings</h2>
            {latestSetting ? (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#00d4ff]/20 text-[#00d4ff] rounded-lg font-medium uppercase">
                      {latestSetting.game}
                    </span>
                    {latestSetting.isCurrent && (
                      <span className="px-2 py-1 bg-[#00ff88]/20 text-[#00ff88] rounded text-xs">Active</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0a0a0f] rounded-lg p-4">
                      <p className="text-[#64748b] text-sm mb-1">DPI</p>
                      <p className="text-xl font-bold text-white">{latestSetting.dpi}</p>
                    </div>
                    <div className="bg-[#0a0a0f] rounded-lg p-4">
                      <p className="text-[#64748b] text-sm mb-1">Sensitivity</p>
                      <p className="text-xl font-bold text-white">{latestSetting.sensitivity}</p>
                    </div>
                    <div className="bg-[#0a0a0f] rounded-lg p-4">
                      <p className="text-[#64748b] text-sm mb-1">eDPI</p>
                      <p className="text-xl font-bold text-[#00d4ff]">{latestSetting.edpi}</p>
                    </div>
                    <div className="bg-[#0a0a0f] rounded-lg p-4">
                      <p className="text-[#64748b] text-sm mb-1">cm/360</p>
                      <p className="text-xl font-bold text-white">{latestSetting.cm360.toFixed(1)}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <div className="flex-1 bg-[#0a0a0f] rounded-lg p-3">
                      <p className="text-[#64748b] text-xs mb-1">Mouse Grip</p>
                      <p className="text-white capitalize">{latestSetting.mouseGrip || '-'}</p>
                    </div>
                    <div className="flex-1 bg-[#0a0a0f] rounded-lg p-3">
                      <p className="text-[#64748b] text-xs mb-1">Aim Style</p>
                      <p className="text-white capitalize">{latestSetting.aimStyle || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#64748b] mb-4">No settings saved yet</p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#00d4ff] text-black font-medium rounded-lg hover:bg-[#00b8e0] transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  Find Your Sens
                </a>
              </div>
            )}
          </motion.div>

          {/* Share */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#161a27] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Share Your Setup</h2>
            <p className="text-[#64748b] text-sm mb-4">
              Share your sensitivity with the world
            </p>
            <div className="space-y-3">
              <button
                onClick={copyLink}
                disabled={!profile.username}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00d4ff] text-black font-medium rounded-lg hover:bg-[#00b8e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Copy className="w-5 h-5" />
                Copy Link
              </button>
              {profile.username && (
                <a
                  href={`https://twitter.com/intent/tweet?text=Check+out+my+aim+settings&url=https://truesens.vercel.app/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1da1f2] text-white font-medium rounded-lg hover:bg-[#1a91da] transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  Share on Twitter
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#161a27] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">History</h2>
          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[#64748b] text-sm border-b border-[rgba(255,255,255,0.06)]">
                    <th className="pb-3">Game</th>
                    <th className="pb-3">DPI</th>
                    <th className="pb-3">Sens</th>
                    <th className="pb-3">eDPI</th>
                    <th className="pb-3">cm/360</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 10).map((entry, i) => (
                    <tr key={i} className="border-b border-[rgba(255,255,255,0.04)]">
                      <td className="py-3 text-white font-medium uppercase">{entry.game}</td>
                      <td className="py-3 text-[#94a3b8]">{entry.dpi}</td>
                      <td className="py-3 text-[#94a3b8]">{entry.sensitivity}</td>
                      <td className="py-3 text-[#00d4ff] font-mono">{entry.edpi}</td>
                      <td className="py-3 text-[#94a3b8]">{entry.cm360.toFixed(1)}</td>
                      <td className="py-3 text-[#64748b] text-sm">
                        {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-[#64748b] py-8">No history yet</p>
          )}
        </motion.div>
      </main>
    </div>
  );
}