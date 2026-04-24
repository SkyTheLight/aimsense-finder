import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/Providers";
import ParticleBackground from "@/components/ParticleBackground";

export const viewport: Viewport = {
  width: 1280,
  initialScale: 1,
  maximumScale: 1,
};

const inter = Inter({
  variable: "--font-inter", 
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains", 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: 'TrueSens | AI-Powered Aim Optimization',
  icons: { 
    icon: '/truesensicon.png',
    apple: '/truesensicon.png',
  },
  description: 'World-class AI-powered aim optimization platform. Real-time esports performance analytics, sensitivity tuning, and personalized coaching.',
  keywords: ['aim', 'sensitivity', 'AI', 'esports', 'valorant', 'cs2', 'optimization', 'analytics', 'gaming'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} data-theme="dark">
      <body className="min-h-screen bg-[#060912] text-slate-100 antialiased font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
        <ClientProviders>
          <ParticleBackground />
          <div className="relative z-10 min-h-screen flex flex-col items-center px-6 py-8">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}