import React from 'react';
import { Box, Text } from 'ink';
import { Piece } from '../game/pieces.js';

interface SidebarProps {
  nextPiece: Piece;
  score: number;
  lines: number;
  level: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ nextPiece, score, lines, level }) => {
  const shape = nextPiece.rotations[0];

  // Calculate bounds for centering the piece
  const minX = Math.min(...shape.map(b => b.x));
  const maxX = Math.max(...shape.map(b => b.x));
  const minY = Math.min(...shape.map(b => b.y));
  const maxY = Math.max(...shape.map(b => b.y));

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  // Create a 4x4 grid for next piece preview
  const previewGrid: boolean[][] = Array.from({ length: 4 }, () => Array(4).fill(false));

  for (const block of shape) {
    const x = block.x - minX;
    const y = block.y - minY;
    if (y < 4 && x < 4) {
      previewGrid[y][x] = true;
    }
  }

  return (
    <Box flexDirection="column" marginLeft={2}>
      <Box flexDirection="column" borderStyle="round" paddingX={1} marginBottom={1}>
        <Text bold>Next</Text>
        {previewGrid.map((row, y) => (
          <Box key={y}>
            {row.map((filled, x) => (
              <Text key={`${x}-${y}`} color={filled ? nextPiece.color : undefined}>
                {filled ? '██' : '  '}
              </Text>
            ))}
          </Box>
        ))}
      </Box>

      <Box flexDirection="column" borderStyle="round" paddingX={1}>
        <Text bold>Stats</Text>
        <Text>Score: {score}</Text>
        <Text>Lines: {lines}</Text>
        <Text>Level: {level}</Text>
      </Box>

      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text dimColor>Controls:</Text>
        <Text dimColor>←→ Move</Text>
        <Text dimColor>↑ Rotate</Text>
        <Text dimColor>↓ Soft drop</Text>
        <Text dimColor>Space Hard drop</Text>
        <Text dimColor>P Pause</Text>
        <Text dimColor>R Restart</Text>
        <Text dimColor>Q Quit</Text>
      </Box>
    </Box>
  );
};
