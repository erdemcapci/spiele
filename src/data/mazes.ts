import type { MazeDefinition } from '../types/game';

const classicMaze: MazeDefinition = {
  id: 'kinder-klassik',
  name: 'Kinder-Klassik',
  description: 'Ein übersichtliches Standard-Labyrinth für die erste Spielrunde.',
  grid: [
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  ],
  start: { x: 0, y: 0 },
  goal: { x: 11, y: 11 },
};

export const MAZES: MazeDefinition[] = [classicMaze];
export const DEFAULT_MAZE_ID = classicMaze.id;

export function getMazeById(id: string): MazeDefinition {
  return MAZES.find((maze) => maze.id === id) ?? classicMaze;
}
