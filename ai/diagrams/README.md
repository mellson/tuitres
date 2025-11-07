# Unified Impact Diagrams Index

This directory contains all diagrams for Tuitris, following Diagram Driven Development (DDD) methodology. All diagrams show both user impact (📊) and technical implementation (🔧).

## Project Overview

**Tuitris** is a terminal-based Tetris game built with React/Ink, delivering classic Tetris gameplay with:
- Instant responsive controls (<50ms input latency)
- Progressive difficulty (speed increases every 10 lines)
- Persistent high score leaderboard (top 10)
- Intelligent wall-kick rotation system
- Pure function state management for bug-free gameplay

## Architecture Overview

- [System Architecture](architecture/arch-system-overview.md) - Complete system showing how terminal UI, game engine, and persistence layer deliver responsive gameplay

## User Journeys

- [Gameplay Journey](journeys/sequence-gameplay-journey.md) - Complete player interaction flow from game start through piece control, scoring, pause/resume, to game over and restart

## Features

- [Game State Management](features/feature-game-state-management.md) - Immutable state architecture showing move validation, line clearing, scoring system, level progression, and game over detection

## Diagram Legend

### Impact Annotations

- **📊 IMPACT**: User-facing benefit or experience improvement
- **🔧**: Technical implementation detail enabling the impact

### User Value Categories

- **Responsiveness**: <50ms input latency, instant visual feedback
- **Achievement**: Score tracking, high score persistence, competitive leaderboard
- **Progressive Challenge**: Speed increases from 1000ms to 100ms drop time
- **Fairness**: Deterministic collision detection, wall-kick rotation assistance
- **Control**: Pause/resume, instant restart, smooth piece movement

## Contributing to Diagrams

When updating or adding diagrams:

1. **Follow DDD principles**: Every diagram must show both Front-Stage (user experience) and Back-Stage (implementation)
2. **Add impact annotations**: Use 📊 for user-facing impacts, 🔧 for technical enablers
3. **Link to code**: Reference specific file paths in the "Related Files" section
4. **Update history**: Add entry to "Change History" section
5. **Update this index**: Add new diagrams to appropriate category

## Diagram Organization

```
ai/diagrams/
├── README.md (this file)
├── architecture/     # System-level architecture diagrams
├── journeys/         # User journey and sequence diagrams
└── features/         # Feature-specific implementation diagrams
```

## Last Updated

**2025-11-07** - Initial diagram repository created with:
- System architecture showing terminal UI, game engine, and persistence
- Complete gameplay journey from start to game over
- Game state management feature showing pure function architecture
