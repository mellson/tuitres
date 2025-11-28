import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

interface ConfettiParticle {
  x: number;
  y: number;
  char: string;
  color: string;
  vx: number;
  vy: number;
}

const CONFETTI_CHARS = ['*', '.', 'o', 'O', '+', 'x', '#'];
const CONFETTI_COLORS = ['red', 'yellow', 'green', 'cyan', 'magenta', 'blue'];

export const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    // Initialize particles
    const initialParticles: ConfettiParticle[] = [];
    for (let i = 0; i < 40; i++) {
      initialParticles.push({
        x: Math.random() * 40,
        y: Math.random() * -15,
        char: CONFETTI_CHARS[Math.floor(Math.random() * CONFETTI_CHARS.length)],
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 1.5 + 0.5,
      });
    }
    setParticles(initialParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.08, // Gravity
        })).filter(p => p.y < 25) // Remove particles that fall off screen
      );
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // Create a grid to position particles
  const grid: Map<string, ConfettiParticle> = new Map();
  particles.forEach(p => {
    const x = Math.floor(p.x);
    const y = Math.floor(p.y);
    if (x >= 0 && x < 40 && y >= 0 && y < 22) {
      grid.set(`${x},${y}`, p);
    }
  });

  return (
    <Box
      position="absolute"
      flexDirection="column"
    >
      {Array.from({ length: 22 }, (_, y) => (
        <Box key={y}>
          {Array.from({ length: 40 }, (_, x) => {
            const particle = grid.get(`${x},${y}`);
            return (
              <Text key={x} color={particle?.color}>
                {particle?.char || ' '}
              </Text>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};
