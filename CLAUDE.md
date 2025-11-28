# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install        # install deps
bun run build      # compile TypeScript
bun fun            # build + run
bun run dev        # build + run (same as fun)
```

## Architecture

Tetris TUI built with React + Ink (terminal UI framework). Uses functional/immutable state management.

### Core Layers

**Entry** (`src/index.tsx`): Ink render call, minimal bootstrap

**UI Components** (`src/components/`):
- `Game.tsx` - Main controller: game loop timer, input handling via `useInput`, state management via `useState`. Orchestrates all game flow
- `Board.tsx` - Renders 10x20 grid with ghost piece preview, current piece overlay
- `Sidebar.tsx` - Next piece preview, score/level display
- `GameOver.tsx` - Game over screen with high score entry

**Game Engine** (`src/game/`):
- `gameState.ts` - All game logic as pure functions: `moveLeft/Right/Down`, `rotate`, `hardDrop`, `lockAndSpawnNew`. Returns new state, never mutates. Contains wall-kick implementation for rotation
- `board.ts` - Board operations: `isValidPosition`, `lockPieceToBoard`, `clearLines`, `isGameOver`. 10x20 grid of `{filled, color}` cells
- `pieces.ts` - Tetromino definitions: 7 pieces (I/O/T/S/Z/J/L) with rotation arrays as relative coordinates

**Persistence** (`src/highscore/highscore.ts`): Async JSON file read/write for top 10 scores

### Key Patterns

- **Immutable state**: All gameState functions return new objects, never mutate
- **Pure functions**: Game logic is testable, no side effects
- **Rotation via wall kicks**: Tries base rotation, then horizontal nudges (-1, +1, -2, +2)
- **Ghost piece**: `calculateGhostPosition` drops current piece to bottom for preview

## Game Constants

- Board: 10 wide x 20 tall
- Speed: 1000ms at level 1, -100ms per level, min 100ms
- Scoring: 100/300/500/800 points for 1/2/3/4 lines, multiplied by level
- Level up: Every 10 lines cleared
