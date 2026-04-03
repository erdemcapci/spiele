import { DEFAULT_MAZE_ID } from '../data/mazes';
import type { GameConfig } from '../types/game';

export const GAME_CONFIG: GameConfig = {
  appTitle: 'Labyrinth-Funkspiel',
  rolePasswords: {
    observer: 'asli',
    player: 'can',
  },
  adminPassword: 'mocha',
  defaultMazeId: DEFAULT_MAZE_ID,
  maxLives: 3,
  storageKeys: {
    player: 'labyrinth-funkspiel-player-v3',
    observer: 'labyrinth-funkspiel-observer-v3',
  },
};
