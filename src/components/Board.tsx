import React from 'react';
import { Box, Text } from 'ink';
import { Board as BoardType, BOARD_WIDTH, BOARD_HEIGHT } from '../game/board.js';
import { Piece, Position, PieceShape } from '../game/pieces.js';

interface BoardProps {
  board: BoardType;
  currentPiece: Piece | null;
  currentPosition: Position;
  currentRotation: number;
  ghostPosition: Position;
}

const COLOR_MAP: Record<string, string> = {
  cyan: '#00FFFF',
  yellow: '#FFFF00',
  magenta: '#FF00FF',
  green: '#00FF00',
  red: '#FF0000',
  blue: '#0000FF',
  white: '#FFFFFF',
};

export const BoardComponent: React.FC<BoardProps> = ({
  board,
  currentPiece,
  currentPosition,
  currentRotation,
  ghostPosition,
}) => {
  // Create a display board with the ghost piece and current piece overlaid
  const displayBoard = board.map(row => row.map(cell => ({ ...cell, isGhost: false })));

  // Render ghost piece first (so current piece overlays it)
  if (currentPiece && ghostPosition.y !== currentPosition.y) {
    const shape = currentPiece.rotations[currentRotation];
    for (const block of shape) {
      const x = ghostPosition.x + block.x;
      const y = ghostPosition.y + block.y;

      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        displayBoard[y][x] = { filled: true, color: currentPiece.color, isGhost: true };
      }
    }
  }

  // Render current piece
  if (currentPiece) {
    const shape = currentPiece.rotations[currentRotation];
    for (const block of shape) {
      const x = currentPosition.x + block.x;
      const y = currentPosition.y + block.y;

      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        displayBoard[y][x] = { filled: true, color: currentPiece.color, isGhost: false };
      }
    }
  }

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="white" paddingX={1}>
      {displayBoard.map((row, y) => (
        <Box key={y}>
          {row.map((cell, x) => (
            <Text
              key={`${x}-${y}`}
              color={cell.filled && cell.color ? cell.color : undefined}
              dimColor={cell.isGhost}
            >
              {cell.filled ? (cell.isGhost ? '▓▓' : '██') : '··'}
            </Text>
          ))}
        </Box>
      ))}
    </Box>
  );
};
