import { WizardContainer } from '@/components/wizard/WizardContainer';

export const metadata = {
  title: 'AimSense Finder - Find Your Perfect FPS Sensitivity',
  description:
    'Discover your optimal mouse sensitivity with the TenZ PSA Method, Ron Rambo Kim principles, and Voltaic benchmarks. Personalized results for Valorant, CS2, and more.',
  keywords: ['fps', 'aim', 'sensitivity', 'valorant', 'cs2', 'calibration', 'gaming'],
  openGraph: {
    title: 'AimSense Finder',
    description: 'Find your perfect FPS sensitivity with scientifically-backed methods',
  },
};

export default function Home() {
  return <WizardContainer />;
}