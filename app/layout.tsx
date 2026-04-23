import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/Providers";
import ParticleBackground from "@/components/ParticleBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains", 
  subsets: ["latin"],
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#0B0B0F] text-white antialiased" suppressHydrationWarning>
        <ClientProviders>
          <ParticleBackground />
          <div className="relative z-10">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}