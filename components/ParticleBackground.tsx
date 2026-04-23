'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number;
  animationDelay: number;
  animationDuration: number;
  width: number;
  height: number;
  opacity: number;
}

export default function ParticleBackground() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 8,
      animationDuration: 8 + Math.random() * 4,
      width: 1 + Math.random() * 3,
      height: 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.4,
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted) return null;

  return (
    <div className="particle-container" id="particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
}