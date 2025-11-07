import {
  Board,
  createEmptyBoard,
  isValidPosition,
  lockPieceToBoard,
  clearLines,
  isGameOver,
} from './board.js';
import { Piece, getRandomPiece, Position, rotatePiece } from './pieces.js';

export interface GameState {
  board: Board;
  currentPiece: Piece | null;
  currentPosition: Position;
  currentRotation: number;
  nextPiece: Piece;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  paused: boolean;
}

export function createInitialState(): GameState {
  const currentPiece = getRandomPiece();
  return {
    board: createEmptyBoard(),
    currentPiece,
    currentPosition: { x: 4, y: 0 },
    currentRotation: 0,
    nextPiece: getRandomPiece(),
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false,
    paused: false,
  };
}

export function moveLeft(state: GameState): GameState {
  if (!state.currentPiece || state.gameOver || state.paused) return state;

  const newPosition = { x: state.currentPosition.x - 1, y: state.currentPosition.y };
  const shape = state.currentPiece.rotations[state.currentRotation];

  if (isValidPosition(state.board, shape, newPosition)) {
    return { ...state, currentPosition: newPosition };
  }

  return state;
}

export function moveRight(state: GameState): GameState {
  if (!state.currentPiece || state.gameOver || state.paused) return state;

  const newPosition = { x: state.currentPosition.x + 1, y: state.currentPosition.y };
  const shape = state.currentPiece.rotations[state.currentRotation];

  if (isValidPosition(state.board, shape, newPosition)) {
    return { ...state, currentPosition: newPosition };
  }

  return state;
}

export function moveDown(state: GameState): GameState {
  if (!state.currentPiece || state.gameOver || state.paused) return state;

  const newPosition = { x: state.currentPosition.x, y: state.currentPosition.y + 1 };
  const shape = state.currentPiece.rotations[state.currentRotation];

  if (isValidPosition(state.board, shape, newPosition)) {
    return { ...state, currentPosition: newPosition };
  }

  // Lock piece and spawn new one
  return lockAndSpawnNew(state);
}

export function rotate(state: GameState): GameState {
  if (!state.currentPiece || state.gameOver || state.paused) return state;

  const newRotation = rotatePiece(state.currentPiece, state.currentRotation);
  const newShape = state.currentPiece.rotations[newRotation];

  // Try basic rotation
  if (isValidPosition(state.board, newShape, state.currentPosition)) {
    return { ...state, currentRotation: newRotation };
  }

  // Try wall kicks (simple version: nudge left or right)
  const wallKicks = [
    { x: state.currentPosition.x - 1, y: state.currentPosition.y },
    { x: state.currentPosition.x + 1, y: state.currentPosition.y },
    { x: state.currentPosition.x - 2, y: state.currentPosition.y },
    { x: state.currentPosition.x + 2, y: state.currentPosition.y },
  ];

  for (const kickPosition of wallKicks) {
    if (isValidPosition(state.board, newShape, kickPosition)) {
      return { ...state, currentRotation: newRotation, currentPosition: kickPosition };
    }
  }

  return state;
}

export function hardDrop(state: GameState): GameState {
  if (!state.currentPiece || state.gameOver || state.paused) return state;

  let newState = { ...state };
  let dropDistance = 0;

  // Move down until collision
  while (newState.currentPiece) {
    const nextPosition = {
      x: newState.currentPosition.x,
      y: newState.currentPosition.y + 1,
    };
    const shape = newState.currentPiece.rotations[newState.currentRotation];

    if (isValidPosition(newState.board, shape, nextPosition)) {
      newState.currentPosition = nextPosition;
      dropDistance++;
    } else {
      break;
    }
  }

  // Add bonus points for hard drop
  newState.score += dropDistance * 2;

  return lockAndSpawnNew(newState);
}

function lockAndSpawnNew(state: GameState): GameState {
  if (!state.currentPiece) return state;

  const shape = state.currentPiece.rotations[state.currentRotation];
  let newBoard = lockPieceToBoard(
    state.board,
    shape,
    state.currentPosition,
    state.currentPiece.color
  );

  // Clear lines
  const { board: clearedBoard, linesCleared } = clearLines(newBoard);
  const newLines = state.lines + linesCleared;
  const newLevel = Math.floor(newLines / 10) + 1;

  // Calculate score
  const linePoints = [0, 100, 300, 500, 800];
  const newScore = state.score + linePoints[linesCleared] * state.level;

  // Check game over
  if (isGameOver(clearedBoard)) {
    return {
      ...state,
      board: clearedBoard,
      gameOver: true,
      score: newScore,
      lines: newLines,
      level: newLevel,
    };
  }

  // Spawn new piece
  const newPiece = state.nextPiece;
  const startPosition = { x: 4, y: 0 };

  return {
    ...state,
    board: clearedBoard,
    currentPiece: newPiece,
    currentPosition: startPosition,
    currentRotation: 0,
    nextPiece: getRandomPiece(),
    score: newScore,
    lines: newLines,
    level: newLevel,
  };
}

export function togglePause(state: GameState): GameState {
  if (state.gameOver) return state;
  return { ...state, paused: !state.paused };
}

export function getDropSpeed(level: number): number {
  // Return delay in milliseconds
  return Math.max(100, 1000 - (level - 1) * 100);
}
