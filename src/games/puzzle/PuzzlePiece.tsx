import type { PuzzleLayout, PuzzlePiece as PuzzlePieceType } from './types';

interface PuzzlePieceProps {
  piece: PuzzlePieceType;
  layout: PuzzleLayout;
  canDrag: boolean;
  onPointerDown: (pieceId: string, event: React.PointerEvent<HTMLDivElement>) => void;
}

export function PuzzlePiece({ piece, layout, canDrag, onPointerDown }: PuzzlePieceProps) {
  return (
    <div
      className={canDrag ? 'puzzle-piece' : 'puzzle-piece puzzle-piece-static'}
      style={{
        width: `${piece.bbox.width}px`,
        height: `${piece.bbox.height}px`,
        left: `${piece.currentPosition.x}px`,
        top: `${piece.currentPosition.y}px`,
        zIndex: piece.zIndex,
        pointerEvents: canDrag ? 'auto' : 'none',
      }}
      onPointerDown={(event) => {
        if (!canDrag) {
          return;
        }

        onPointerDown(piece.id, event);
      }}
    >
      <svg
        width={piece.bbox.width}
        height={piece.bbox.height}
        viewBox={`0 0 ${piece.bbox.width} ${piece.bbox.height}`}
      >
        <defs>
          <clipPath id={`clip-${piece.id}`}>
            <path d={piece.path} />
          </clipPath>
        </defs>
        <image
          href={layout.imageDataUrl}
          x={-piece.bbox.x}
          y={-piece.bbox.y}
          width={layout.imageWidth}
          height={layout.imageHeight}
          preserveAspectRatio="none"
          clipPath={`url(#clip-${piece.id})`}
        />
        <path d={piece.path} fill="none" stroke="#243042" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
