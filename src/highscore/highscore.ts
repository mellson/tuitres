import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HIGHSCORE_FILE = join(__dirname, '../../highscore.json');

export interface HighScore {
  name: string;
  score: number;
  date: string;
}

export async function loadHighScores(): Promise<HighScore[]> {
  try {
    if (!existsSync(HIGHSCORE_FILE)) {
      return [];
    }

    const data = await readFile(HIGHSCORE_FILE, 'utf-8');
    const scores: HighScore[] = JSON.parse(data);
    return scores.sort((a, b) => b.score - a.score);
  } catch (error) {
    return [];
  }
}

export async function saveHighScore(name: string, score: number): Promise<void> {
  try {
    const scores = await loadHighScores();

    const newScore: HighScore = {
      name: name.trim() || 'Anonymous',
      score,
      date: new Date().toISOString(),
    };

    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);

    // Keep only top 10
    const top10 = scores.slice(0, 10);

    // Ensure directory exists
    const dir = dirname(HIGHSCORE_FILE);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    await writeFile(HIGHSCORE_FILE, JSON.stringify(top10, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save high score:', error);
  }
}
