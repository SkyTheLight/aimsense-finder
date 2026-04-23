'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#030407]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-6 py-12"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#64748b] hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>

        <div className="space-y-6 text-sm text-[#94a3b8]">
          <section>
            <h2 className="text-white font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>By accessing and using TrueSens, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">2. Description of Service</h2>
            <p>TrueSens provides AI-powered mouse sensitivity recommendations, aim coaching insights, and performance benchmarking for competitive gamers. We strive to provide accurate and helpful guidance, but we cannot guarantee specific in-game results.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">3. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Provide accurate information when using our service</li>
              <li>Maintain the security of your account credentials</li>
              <li>Not use our service for any unlawful purpose</li>
              <li>Not attempt to gain unauthorized access to any part of our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">4. Intellectual Property</h2>
            <p>All content, features, and functionality of TrueSens are owned by us and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our content without prior written consent.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">5. Disclaimer of Warranties</h2>
            <p>TRUE SENS IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND. WE DO NOT GUARANTEE THAT OUR RECOMMENDATIONS WILL IMPROVE YOUR GAMING PERFORMANCE. RESULTS MAY VARY BASED ON INDIVIDUAL SKILL, HARDWARE, AND OTHER FACTORS.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">6. Limitation of Liability</h2>
            <p>IN NO EVENT SHALL TRUESENS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF OR INABILITY TO USE OUR SERVICE.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">7. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Post or transmit any unlawful, harmful, or abusive content</li>
              <li>Interfere with or disrupt our service</li>
              <li>Attempt to hack, reverse engineer, or otherwise compromise our systems</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">8. Termination</h2>
            <p>We reserve the right to terminate or suspend your access to our service at any time, without notice, for any violation of these terms or for any other reason at our sole discretion.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">9. Changes to Terms</h2>
            <p>We may modify these Terms of Service at any time. Your continued use of TrueSens after modifications constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">10. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us through our website.</p>
          </section>

          <p className="text-xs text-[#64748b] mt-8">Last updated: April 2026</p>
        </div>
      </motion.div>
    </div>
  );
}