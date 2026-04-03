import type { PuzzleLayout } from './types';

interface PuzzleBoardProps {
  layout: PuzzleLayout;
}

export function PuzzleBoard({ layout }: PuzzleBoardProps) {
  return (
    <div
      className="puzzle-board-outline"
      style={{
        width: `${layout.imageWidth}px`,
        height: `${layout.imageHeight}px`,
      }}
    />
  );
}
