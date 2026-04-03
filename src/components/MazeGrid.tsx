import type { GridPoint, MazeDefinition } from '../types/game';

interface MazeGridProps {
  maze: MazeDefinition;
  markerPosition?: GridPoint;
  markerTone?: 'player' | 'observer';
  visiblePath?: GridPoint[];
  ariaLabel: string;
}

export function MazeGrid({
  maze,
  markerPosition,
  markerTone = 'player',
  visiblePath,
  ariaLabel,
}: MazeGridProps) {
  const rows = maze.grid.length;
  const columns = maze.grid[0].length;
  const cells: JSX.Element[] = [];
  const visibleKeys = new Set(
    (visiblePath ?? []).map((point) => `${point.x}:${point.y}`),
  );

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
      const actualX = columnIndex;
      const actualY = rowIndex;
      const isMarker = markerPosition?.x === actualX && markerPosition?.y === actualY;
      const isGoal = maze.goal.x === actualX && maze.goal.y === actualY;
      const isStart = maze.start.x === actualX && maze.start.y === actualY;
      const isWall = maze.grid[actualY][actualX] === 1;
      const isVisible = !visiblePath || visibleKeys.has(`${actualX}:${actualY}`) || isMarker;

      const classNames = ['maze-cell'];
      let symbol = '';

      if (!isVisible) {
        classNames.push('maze-cell-hidden');
      } else if (isWall) {
        classNames.push('maze-cell-wall');
      } else {
        classNames.push('maze-cell-floor');
      }

      if (isStart && !isWall && isVisible) {
        classNames.push('maze-cell-start');
        symbol = 'S';
      }

      if (isGoal && !isWall && isVisible) {
        classNames.push('maze-cell-goal');
        symbol = 'Z';
      }

      if (isMarker && !isWall && isVisible) {
        classNames.push(markerTone === 'observer' ? 'maze-cell-observer' : 'maze-cell-player');
        symbol = '●';
      }

      cells.push(
        <div key={`${actualX}-${actualY}`} className={classNames.join(' ')}>
          {symbol}
        </div>,
      );
    }
  }

  return (
    <div
      className="maze-grid maze-grid-full"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      aria-label={ariaLabel}
      role="img"
    >
      {cells}
    </div>
  );
}
