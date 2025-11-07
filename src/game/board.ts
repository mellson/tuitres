import { Piece, PieceShape, Position } from './pieces.js';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type Cell = {
  filled: boolean;
  color: string | null;
};

export type Board = Cell[][];

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => ({ filled: false, color: null }))
  );
}

export function isValidPosition(
  board: Board,
  shape: PieceShape,
  position: Position
): boolean {
  for (const block of shape) {
    const x = position.x + block.x;
    const y = position.y + block.y;

    // Check boundaries
    if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) {
      return false;
    }

    // Allow pieces above the board (y < 0)
    if (y >= 0 && board[y][x].filled) {
      return false;
    }
  }

  return true;
}

export function lockPieceToBoard(
  board: Board,
  shape: PieceShape,
  position: Position,
  color: string
): Board {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));

  for (const block of shape) {
    const x = position.x + block.x;
    const y = position.y + block.y;

    if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
      newBoard[y][x] = { filled: true, color };
    }
  }

  return newBoard;
}

export function clearLines(board: Board): { board: Board; linesCleared: number } {
  const fullLines: number[] = [];

  // Find full lines
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board[y].every(cell => cell.filled)) {
      fullLines.push(y);
    }
  }

  if (fullLines.length === 0) {
    return { board, linesCleared: 0 };
  }

  // Remove full lines and add empty lines at top
  const newBoard = board.filter((_, index) => !fullLines.includes(index));
  const emptyLines = Array.from({ length: fullLines.length }, () =>
    Array.from({ length: BOARD_WIDTH }, () => ({ filled: false, color: null }))
  );

  return {
    board: [...emptyLines, ...newBoard],
    linesCleared: fullLines.length,
  };
}

export function isGameOver(board: Board): boolean {
  // Check if any cells in the top row are filled
  return board[0].some(cell => cell.filled);
}
