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
  title: "TrueSens | AI-Powered Aim Optimization",
  icons: {
    icon: "/truesensicon.png",
    apple: "/truesensicon.png",
  },
  description:
    "World-class AI-powered aim optimization platform. Real-time esports performance analytics, sensitivity tuning, and personalized coaching.",
  keywords: [
    "aim",
    "sensitivity",
    "AI",
    "esports",
    "valorant",
    "cs2",
    "optimization",
    "analytics",
    "gaming",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      data-theme="dark"
    >
      <body className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text-primary)] antialiased font-sans selection:bg-[var(--app-accent-soft)] selection:text-[var(--app-text-primary)]">
        <ClientProviders>
          <ParticleBackground />
          <div className="relative z-10 min-h-screen">{children}</div>
        </ClientProviders>
      </body>
    </html>
  );
}

