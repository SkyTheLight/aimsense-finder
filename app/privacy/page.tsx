'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
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

        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-sm text-[#94a3b8]">
          <section>
            <h2 className="text-white font-semibold mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Account information (Google login)</li>
              <li>Profile information (username, bio, country)</li>
              <li>Hardware settings (DPI, sensitivity, mouse, mousepad)</li>
              <li>Performance data from benchmarks</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Provide and improve our sensitivity recommendations</li>
              <li>Generate personalized aim coaching insights</li>
              <li>Save your settings for future access</li>
              <li>Communicate with you about your account</li>
              <li>Analyze usage patterns to improve our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">3. Data Storage and Security</h2>
            <p>Your data is stored securely using industry-standard encryption. We use Vercel Postgres for data storage and implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">4. Cookies and Tracking</h2>
            <p>We use cookies and similar tracking technologies to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Keep you signed in</li>
              <li>Understand how you use our service</li>
              <li>Remember your preferences</li>
              <li>Improve our service based on usage patterns</li>
            </ul>
            <p className="mt-2">You can control cookies through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">5. Third-Party Services</h2>
            <p>We use third-party services for:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Authentication (Google)</li>
              <li>Database (Vercel Postgres)</li>
              <li>AI features (OpenAI)</li>
              <li>Video recommendations (YouTube)</li>
            </ul>
            <p className="mt-2">These services have their own privacy policies.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">6. Data Sharing</h2>
            <p>We do not sell your personal information. We may share information with:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Service providers who assist our operations</li>
              <li>YouTube for video recommendations</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">8. Children's Privacy</h2>
            <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete it.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">9. Changes to Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. Your continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us through our website.</p>
          </section>

          <p className="text-xs text-[#64748b] mt-8">Last updated: April 2026</p>
        </div>
      </motion.div>
    </div>
  );
}