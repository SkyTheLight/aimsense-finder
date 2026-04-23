'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/?wizard=true' });
  };

  return (
    <div className="min-h-screen bg-[#030407] flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[60vh] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(6,182,217,0.1),transparent_60%)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100%] h-[40vh] bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(168,85,247,0.08),transparent_60%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            <span className="text-gradient">TrueSens</span>
          </h1>
          <p className="text-[#b8c0cd]">Sign in to save your settings</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[rgba(26,29,38,0.8)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl p-6"
        >
          <div className="space-y-4">
            {/* Google */}
            <motion.button
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl bg-white text-black font-medium hover:bg-gray-100 transition-all shadow-lg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.38-1.36-.38-2.09s.16-1.43.38-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </motion.button>
          </div>

          <p className="text-xs text-[#525a6b] mt-6 text-center">
            By signing in, you agree to our <a href="/terms" className="text-cyan-400 hover:underline">Terms</a> and <a href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</a>
          </p>
        </motion.div>

        {/* Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#525a6b] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all mx-auto"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to finder
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}