'use client';

// Tiny dependency-free confetti burst. Renders 28 absolutely-positioned
// particles when `trigger` flips truthy, each with random color, angle,
// distance, and duration. No external dep.

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  color: string;
  x: number; // horizontal drift in vw
  y: number; // vertical drop in vh
  rotate: number;
  delay: number;
  duration: number;
  size: number;
}

const COLORS = ['#e0ddaa', '#ffd700', '#22c55e', '#60a5fa', '#f472b6', '#fb923c'];

function buildBurst(): Particle[] {
  const N = 28;
  return Array.from({ length: N }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    x: (Math.random() - 0.5) * 80,
    y: 60 + Math.random() * 40,
    rotate: Math.random() * 720 - 360,
    delay: Math.random() * 80,
    duration: 1100 + Math.random() * 700,
    size: 6 + Math.random() * 6,
  }));
}

export function Confetti({ trigger }: { trigger: number }) {
  // `trigger` is a number (timestamp). Each new value spawns a fresh burst.
  const [burst, setBurst] = useState<Particle[] | null>(null);

  useEffect(() => {
    if (!trigger) return;
    setBurst(buildBurst());
    const t = setTimeout(() => setBurst(null), 2200);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!burst) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 100,
      }}
    >
      <style>{`
        @keyframes zabalConfettiFall {
          0% { transform: translate(0, -10vh) rotate(0deg); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) rotate(var(--r)); opacity: 0; }
        }
      `}</style>
      {burst.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: 2,
            transform: 'translate(-50%, -50%)',
            animation: `zabalConfettiFall ${p.duration}ms cubic-bezier(0.2, 0.7, 0.3, 1) ${p.delay}ms forwards`,
            // CSS custom props drive the per-particle end transform
            ['--x' as string]: `${p.x}vw`,
            ['--y' as string]: `${p.y}vh`,
            ['--r' as string]: `${p.rotate}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
