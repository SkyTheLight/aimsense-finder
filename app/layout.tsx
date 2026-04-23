import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains", 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'TrueSens',
  icons: { 
    icon: '/truesensicon.png',
    apple: '/truesensicon.png',
  },
  description:
    'Discover your optimal mouse sensitivity with the TenZ PSA Method, Ron Rambo Kim principles, and Voltaic benchmarks. Personalized results for Valorant, CS2, and more.',
  keywords: ['fps', 'aim', 'sensitivity', 'valorant', 'cs2', 'calibration', 'gaming'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}