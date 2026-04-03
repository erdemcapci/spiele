import { GAME_CONFIG } from '../config/gameConfig';
import type {
  GridPoint,
  MazeDefinition,
  MoveDirection,
  ObserverState,
  PlayerGameState,
} from '../types/game';

const DIRECTION_DELTAS: Record<MoveDirection, GridPoint> = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

export function createInitialPlayerState(maze: MazeDefinition): PlayerGameState {
  return {
    position: { ...maze.start },
    visitedPath: [{ ...maze.start }],
    moves: 0,
    bumps: 0,
    lives: GAME_CONFIG.maxLives,
    statusMessage: 'Du stehst am Start. Warte auf die Hinweise des Beobachters.',
    finished: false,
  };
}

export function createInitialObserverState(maze: MazeDefinition): ObserverState {
  return {
    trackedPosition: { ...maze.start },
    statusMessage:
      'Der Beobachter sieht die ganze Karte. Die Marker-Position wird auf diesem Gerät manuell nachgeführt.',
  };
}

export function isInsideMaze(maze: MazeDefinition, point: GridPoint) {
  return (
    point.y >= 0 &&
    point.y < maze.grid.length &&
    point.x >= 0 &&
    point.x < maze.grid[0].length
  );
}

export function isWalkable(maze: MazeDefinition, point: GridPoint) {
  return isInsideMaze(maze, point) && maze.grid[point.y][point.x] === 0;
}

export function getStepTarget(point: GridPoint, direction: MoveDirection): GridPoint {
  const delta = DIRECTION_DELTAS[direction];
  return {
    x: point.x + delta.x,
    y: point.y + delta.y,
  };
}

export function isGoalReached(maze: MazeDefinition, point: GridPoint) {
  return point.x === maze.goal.x && point.y === maze.goal.y;
}
