import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp, useStdout } from 'ink';
import {
  GameState,
  createInitialState,
  moveLeft,
  moveRight,
  moveDown,
  rotate,
  hardDrop,
  togglePause,
  getDropSpeed,
} from '../game/gameState.js';
import { BoardComponent } from './Board.js';
import { Sidebar } from './Sidebar.js';
import { GameOver } from './GameOver.js';
import {
  loadHighScores,
  saveHighScore,
  HighScore,
} from '../highscore/highscore.js';

export const Game: React.FC = () => {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  const terminalWidth = stdout?.columns || 80;
  const terminalHeight = stdout?.rows || 24;
  const minWidth = 50;
  const minHeight = 25;

  // Load high scores on mount
  useEffect(() => {
    loadHighScores().then(setHighScores);
  }, []);

  // Game loop for automatic downward movement
  useEffect(() => {
    if (gameState.gameOver || gameState.paused) return;

    const speed = getDropSpeed(gameState.level);
    const interval = setInterval(() => {
      setGameState(prev => moveDown(prev));
    }, speed);

    return () => clearInterval(interval);
  }, [gameState.level, gameState.gameOver, gameState.paused]);

  // Handle input
  useInput((input, key) => {
    if (gameState.gameOver) return;

    if (input === 'q') {
      exit();
      return;
    }

    if (input === 'r') {
      setGameState(createInitialState());
      return;
    }

    if (input === 'p') {
      setGameState(prev => togglePause(prev));
      return;
    }

    if (gameState.paused) return;

    if (key.leftArrow) {
      setGameState(prev => moveLeft(prev));
    } else if (key.rightArrow) {
      setGameState(prev => moveRight(prev));
    } else if (key.downArrow) {
      setGameState(prev => moveDown(prev));
    } else if (key.upArrow) {
      setGameState(prev => rotate(prev));
    } else if (input === ' ') {
      setGameState(prev => hardDrop(prev));
    }
  });

  const handleSaveHighScore = async (name: string) => {
    await saveHighScore(name, gameState.score);
    const updated = await loadHighScores();
    setHighScores(updated);
  };

  const handleRestart = () => {
    setGameState(createInitialState());
  };

  // Check terminal size
  if (terminalWidth < minWidth || terminalHeight < minHeight) {
    return (
      <Box flexDirection="column" padding={2}>
        <Text color="red" bold>
          Terminal too small!
        </Text>
        <Text>
          Minimum size: {minWidth}x{minHeight}
        </Text>
        <Text>
          Current size: {terminalWidth}x{terminalHeight}
        </Text>
        <Box marginTop={1}>
          <Text dimColor>Please resize your terminal window</Text>
        </Box>
      </Box>
    );
  }

  if (gameState.gameOver) {
    return (
      <GameOver
        score={gameState.score}
        highScores={highScores}
        onRestart={handleRestart}
        onSaveHighScore={handleSaveHighScore}
      />
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          TUITRIS
        </Text>
      </Box>

      <Box>
        <BoardComponent
          board={gameState.board}
          currentPiece={gameState.currentPiece}
          currentPosition={gameState.currentPosition}
          currentRotation={gameState.currentRotation}
        />
        <Sidebar
          nextPiece={gameState.nextPiece}
          score={gameState.score}
          lines={gameState.lines}
          level={gameState.level}
        />
      </Box>

      {gameState.paused && (
        <Box marginTop={1} justifyContent="center">
          <Text color="yellow" bold>
            PAUSED
          </Text>
        </Box>
      )}
    </Box>
  );
};
