# Tuitris Project Guide

Terminal Tetris (React/Ink, TypeScript, Bun). 850 LOC. Pure functions, <50ms latency.

---

## Tech Stack

- **Runtime**: Node.js v25, Bun 1.3.1
- **Language**: TypeScript 5.7 (strict mode)
- **Framework**: React 18 + Ink 5 (TUI renderer)
- **Build**: tsc → ES2022 modules
- **Deps**: Minimal (Ink + React only)

---

## Project Structure

```
src/
├── index.tsx              # Entry: render(<Game />)
├── components/            # UI (294 LOC)
│   ├── Game.tsx          # Controller + input (160)
│   ├── Board.tsx         # Grid renderer + ghost (77)
│   ├── Sidebar.tsx       # Stats + preview (69)
│   └── GameOver.tsx      # Score input + leaderboard (88)
├── game/                  # Engine (401 LOC)
│   ├── gameState.ts      # Pure functions (216)
│   ├── pieces.ts         # 7 tetrominoes (94)
│   └── board.ts          # Collision + lines (91)
└── highscore/             # Persistence (55 LOC)
    └── highscore.ts      # JSON storage

ai/diagrams/               # START HERE
├── README.md             # Index + legend
├── architecture/         # System design
├── journeys/             # User flows
└── features/             # Feature specs
```

---

## CRITICAL: Diagram-First Workflow

### Golden Rule
**Read `ai/diagrams/` BEFORE code. Update diagrams AFTER changes.**

### Why Diagrams First

- **10x faster context**: 500 tokens (diagram) vs 5000 tokens (code)
- **Shows "why"**: User impact (📊) + tech approach (🔧)
- **Navigation map**: "Related Files" → jump to exact code
- **Prevents drift**: Diagrams = design truth

### Standard Workflows

#### 🔍 Understanding Code
1. Open `ai/diagrams/README.md`
2. Find relevant diagram
3. Read 📊 impact + 🔧 tech
4. Navigate via "Related Files" paths
5. Verify diagram matches code
6. Update if outdated

#### ✨ Adding Feature
1. Review existing diagrams for context
2. Create `features/feature-[name].md`:
   - Purpose (1-2 sentences user value)
   - Mermaid with 📊/🔧 annotations
   - Related Files (even if not exist yet)
   - Key Insights + Performance
3. Get user approval
4. Implement following diagram
5. Update with actual paths/lines
6. Add to README.md index
7. Timestamp

#### 🔄 Modifying Feature
1. Find affected diagrams
2. Update to show NEW behavior
3. Add Change History entry
4. Implement code
5. Verify diagram matches
6. Update timestamp

#### 🐛 Debugging
1. Find diagram showing expected behavior
2. Trace flow
3. Identify divergence
4. Fix code
5. Update diagram only if diagram was wrong
6. Document missing error paths

### When to Create Diagrams

✅ **ALWAYS**:
- New user-facing features
- New user journeys
- Architecture changes
- Complex refactorings

❌ **NEVER**:
- Trivial changes (typos, formatting)
- Dependency updates
- Build config
- Zero user impact refactors

---

## Development Commands

```bash
# Dev (fast recompile)
npm run dev              # tsc && node dist/index.js

# Build + run
npm start                # bun run build && node dist/index.js

# Build only
npm run build            # tsc (src/ → dist/)

# Install as CLI
npm install -g .
tuitris
```

---

## Core Architecture

### State Management (Pure Functions)

**File**: `src/game/gameState.ts`

All functions immutable (return new state):
- `moveLeft/Right/Down(state)` - Validate + move
- `rotate(state)` - Rotation + wall-kick (4 fallbacks)
- `hardDrop(state)` - Instant drop + 2pts/row
- `togglePause(state)` - Toggle pause
- `calculateGhostPosition(state)` - Landing preview

**GameState**:
```typescript
{
  board: 10x20 grid
  currentPiece, currentPosition, currentRotation
  nextPiece
  score, lines, level
  gameOver, paused
}
```

### Collision Detection

**File**: `src/game/board.ts`

- `isValidPosition()` - Boundary + collision checks
- `lockPieceToBoard()` - Permanent placement
- `clearLines()` - Detect full rows, cascade down
- `isGameOver()` - Top row filled check

### Scoring

```
Lines: [0, 100, 300, 500, 800] × level
Hard drop: dropDistance × 2
Level: floor(totalLines / 10) + 1
Speed: max(100ms, 1000ms - (level-1) × 100ms)
```

### UI Rendering

**File**: `src/components/Game.tsx`

- Game loop: `useEffect` + `setInterval` at drop speed
- Input: `useInput()` hook (arrows, space, P, R, Q)
- Terminal size: Min 50×25

**File**: `src/components/Board.tsx`

- Ghost piece: Dimmed `▓▓` blocks
- Current piece: Solid `██` blocks
- Empty cells: `··`
- Color mapping to Ink colors

### High Scores

**File**: `src/highscore/highscore.ts`

- Storage: `highscore.json` (project root)
- Format: `[{name, score, date}]`
- Keeps top 10, sorted descending
- Graceful fallback if file missing

---

## Key Files Quick Reference

| What | Where | Lines |
|------|-------|-------|
| Entry point | `src/index.tsx` | 6 |
| Main controller | `src/components/Game.tsx` | 160 |
| State logic | `src/game/gameState.ts` | 216 |
| Collision | `src/game/board.ts` | 91 |
| Pieces | `src/game/pieces.ts` | 94 |
| Rendering | `src/components/Board.tsx` | 77 |
| High scores | `src/highscore/highscore.ts` | 55 |

---

## Code Patterns

### Immutable State Updates

```typescript
// ✅ Correct
return { ...state, score: state.score + 100 };

// ❌ Never mutate
state.score += 100;
return state;
```

### Validation Before Update

```typescript
// Always validate before applying
if (isValidPosition(board, shape, newPosition)) {
  return { ...state, currentPosition: newPosition };
}
return state; // Unchanged if invalid
```

### Pure Functions

```typescript
// No side effects - return new state
export function moveLeft(state: GameState): GameState {
  // ...validation...
  return { ...state, /* changes */ };
}
```

---

## Testing

**Status**: No tests yet

**Would benefit from**:
- Unit tests for collision detection
- State transition tests
- Scoring calculation tests
- Line clearing algorithm tests

**Suggested**: Jest or Vitest + `@types/jest`

---

## Recent Changes

```
f688c61 Ghost piece preview (Nov 8)
02e8447 Migrate to Bun (Nov 8)
942777c Add DDD diagrams (Nov 7)
a22fb82 Initial commit (Nov 4)
```

Check `/sync-diagrams` to ensure diagrams current.

---

## Working with AI Assistant

### Session Start
1. `git log -5` (recent commits)
2. Identify changed areas
3. Read `ai/diagrams/` for context
4. Then read specific code

### During Task
1. Reference diagrams
2. Update as changes made
3. Use diagrams to explain decisions

### Session End
1. Verify diagrams updated
2. `/sync-diagrams` if major changes
3. Ensure README.md current

---

## Critical Rules

1. **📖 Diagrams First**: Read before code when exploring
2. **🔄 Always Update**: Changed code = update diagrams immediately
3. **👤 User Impact**: Every diagram shows player value (📊)
4. **💚 Living Docs**: Specifications, not history
5. **✅ Single Source**: Diagrams = design truth
6. **🚫 No Drift**: Outdated diagrams worse than none

---

## Performance Characteristics

- **Memory**: ~5-10MB (React + Ink)
- **CPU**: Minimal (loop every 100-1000ms)
- **Input latency**: <50ms
- **Move validation**: O(4) per piece
- **Line clearing**: O(20) row scan
- **Ghost position**: O(20) max iterations
- **Board rendering**: O(200) cells

---

## TypeScript Config

- **Target**: ES2022
- **Modules**: ES2022 (native ESM)
- **Strict**: true (all type checks)
- **JSX**: react (→ React.createElement)
- **Output**: dist/ (mirrors src/)

---

## Quick Diagram Templates

### Feature Diagram
```markdown
# [Name]

**Type**: Feature Diagram
**Last Updated**: YYYY-MM-DD
**Related Files**: `path/to/file.ts:lines`

## Purpose
[1-2 sentences user value]

## Diagram
```mermaid
[With 📊 impact + 🔧 tech]
```

## Key Insights
- [User impact]
- [Technical enabler]

## Change History
- **YYYY-MM-DD**: [Description]
```

---

## Dependencies

**Production** (2):
- `ink@^5.0.1` - Terminal UI renderer
- `react@^18.3.1` - Component library

**Dev** (3):
- `typescript@^5.7.3` - Type checker + compiler
- `@types/react@^18.3.18` - React types
- `@types/node@^22.10.2` - Node types

**Total**: 5 deps (minimal philosophy)

---

## Deployment

**As CLI**:
```bash
npm install -g tuitris
tuitris
```

**Docker** (potential):
```dockerfile
FROM node:20-alpine
COPY . .
RUN npm install && npm run build
ENTRYPOINT ["node", "dist/index.js"]
```

---

**Last Updated**: 2025-11-08
