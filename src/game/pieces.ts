export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type Position = { x: number; y: number };
export type PieceShape = Position[];

export interface Piece {
  type: PieceType;
  rotations: PieceShape[];
  color: string;
}

// Each piece defined as relative coordinates from center
const PIECES: Record<PieceType, Piece> = {
  I: {
    type: 'I',
    color: 'cyan',
    rotations: [
      [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
      [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
      [{ x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
      [{ x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
    ],
  },
  O: {
    type: 'O',
    color: 'yellow',
    rotations: [
      [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
    ],
  },
  T: {
    type: 'T',
    color: 'magenta',
    rotations: [
      [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }],
      [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }],
      [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }],
      [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }],
    ],
  },
  S: {
    type: 'S',
    color: 'green',
    rotations: [
      [{ x: -1, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }],
      [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }],
      [{ x: -1, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }],
      [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }],
    ],
  },
  Z: {
    type: 'Z',
    color: 'red',
    rotations: [
      [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
      [{ x: 1, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }],
      [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
      [{ x: 1, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }],
    ],
  },
  J: {
    type: 'J',
    color: 'blue',
    rotations: [
      [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }],
      [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }],
      [{ x: -1, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }],
      [{ x: 1, y: -1 }, { x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }],
    ],
  },
  L: {
    type: 'L',
    color: 'white',
    rotations: [
      [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 1 }],
      [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: -1, y: -1 }],
      [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }],
      [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
    ],
  },
};

export function getRandomPiece(): Piece {
  const types: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  return PIECES[randomType];
}

export function getPiece(type: PieceType): Piece {
  return PIECES[type];
}

export function rotatePiece(piece: Piece, currentRotation: number): number {
  return (currentRotation + 1) % piece.rotations.length;
}
