export type Role = 'observer' | 'player';
export type Screen = 'home' | 'observer' | 'player' | 'victory';
export type MazeCell = 0 | 1;
export type MoveDirection = 'up' | 'right' | 'down' | 'left';

export interface GridPoint {
  x: number;
  y: number;
}

export interface MazeDefinition {
  id: string;
  name: string;
  description: string;
  grid: MazeCell[][];
  start: GridPoint;
  goal: GridPoint;
}

export interface PlayerGameState {
  position: GridPoint;
  visitedPath: GridPoint[];
  moves: number;
  bumps: number;
  lives: number;
  statusMessage: string;
  finished: boolean;
}

export interface ObserverState {
  trackedPosition: GridPoint;
  statusMessage: string;
}

export interface AppAccessState {
  screen: Screen;
  activeRole: Role | null;
  passwordModalFor: Role | null;
  passwordError: string;
}

export interface GameConfig {
  appTitle: string;
  rolePasswords: Record<Role, string>;
  defaultMazeId: string;
  maxLives: number;
  storageKeys: {
    player: string;
    observer: string;
  };
}
