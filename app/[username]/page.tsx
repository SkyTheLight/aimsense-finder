'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Copy, Share2 } from 'lucide-react';

interface SharedSettings {
  game: string;
  dpi: number;
  sensitivity: number;
  edpi: number;
  cm360: number;
  mouseGrip?: string;
  aimStyle?: string;
  label?: string;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<SharedSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setData(json);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [username]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00a8ff] animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">404</h1>
          <p className="text-[#64748b]">@{username} not found</p>
          <a href="/" className="text-[#00a8ff] mt-4 inline-block">Go to TrueSens →</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="text-center mb-6">
            <img 
              src="/truesensicon.png" 
              alt="TrueSens" 
              className="w-16 h-16 mx-auto mb-4 rounded-xl"
            />
            <h1 className="text-2xl font-bold text-white">@{username}</h1>
            <p className="text-[#64748b] text-sm">FPS Sensitivity Profile</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-[#2a2a3a]">
              <span className="text-[#64748b]">Game</span>
              <span className="text-white font-medium uppercase">{data.game}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[#2a2a3a]">
              <span className="text-[#64748b]">DPI</span>
              <span className="text-white font-mono">{data.dpi}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[#2a2a3a]">
              <span className="text-[#64748b]">Sensitivity</span>
              <span className="text-white font-mono">{data.sensitivity}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[#2a2a3a]">
              <span className="text-[#64748b]">eDPI</span>
              <span className="text-[#00a8ff] font-mono font-bold text-xl">{data.edpi}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[#2a2a3a]">
              <span className="text-[#64748b]">cm/360</span>
              <span className="text-white font-mono">{data.cm360?.toFixed(2)}</span>
            </div>
            {data.mouseGrip && (
              <div className="flex justify-between items-center py-3 border-b border-[#2a2a3a]">
                <span className="text-[#64748b]">Mouse Grip</span>
                <span className="text-white capitalize">{data.mouseGrip}</span>
              </div>
            )}
            {data.aimStyle && (
              <div className="flex justify-between items-center py-3">
                <span className="text-[#64748b]">Aim Style</span>
                <span className="text-white capitalize">{data.aimStyle}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={copyLink}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#00a8ff] text-black font-medium hover:bg-[#0090e0]"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <a
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-[#2a2a3a] text-white font-medium hover:border-[#00a8ff]"
            >
              <Share2 className="w-4 h-4" />
              Find Yours
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}