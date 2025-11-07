import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { HighScore } from '../highscore/highscore.js';

interface GameOverProps {
  score: number;
  highScores: HighScore[];
  onRestart: () => void;
  onSaveHighScore: (name: string) => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  score,
  highScores,
  onRestart,
  onSaveHighScore,
}) => {
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  const isHighScore = highScores.length < 10 || score > highScores[highScores.length - 1].score;

  useInput((input, key) => {
    if (saved) {
      if (input === 'r') {
        onRestart();
      }
      return;
    }

    if (isHighScore) {
      if (key.return && name.length > 0) {
        onSaveHighScore(name);
        setSaved(true);
      } else if (key.backspace || key.delete) {
        setName(prev => prev.slice(0, -1));
      } else if (input && input.length === 1 && name.length < 20) {
        setName(prev => prev + input);
      }
    } else {
      if (input === 'r') {
        onRestart();
      }
    }
  });

  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
      <Text bold color="red">
        GAME OVER
      </Text>
      <Text>Final Score: {score}</Text>

      {isHighScore && !saved && (
        <Box flexDirection="column" marginTop={1} alignItems="center">
          <Text color="yellow" bold>
            New High Score!
          </Text>
          <Text>Enter name: {name}</Text>
          <Text dimColor>(Press Enter to save)</Text>
        </Box>
      )}

      {saved && (
        <Box flexDirection="column" marginTop={1} alignItems="center">
          <Text color="green">High score saved!</Text>
        </Box>
      )}

      {(!isHighScore || saved) && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold>High Scores</Text>
          {highScores.slice(0, 10).map((hs, i) => (
            <Text key={i}>
              {i + 1}. {hs.name.padEnd(20)} {hs.score}
            </Text>
          ))}
        </Box>
      )}

      {(!isHighScore || saved) && (
        <Box marginTop={1}>
          <Text dimColor>Press R to restart</Text>
        </Box>
      )}
    </Box>
  );
};
