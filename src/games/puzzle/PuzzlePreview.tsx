import type { PuzzleLayout, PuzzlePiece, PuzzlePreviewMode } from './types';

interface PuzzlePreviewProps {
  layout: PuzzleLayout | null;
  previewMode: PuzzlePreviewMode;
}

function renderPolygon(piece: PuzzlePiece, stroke = '#355070', fill = 'transparent') {
  const points = piece.absolutePoints.map((point) => `${point.x},${point.y}`).join(' ');
  return (
    <polygon
      key={piece.id}
      points={points}
      fill={fill}
      stroke={stroke}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  );
}

export function PuzzlePreview({ layout, previewMode }: PuzzlePreviewProps) {
  if (!layout) {
    return <div className="puzzle-empty">Noch kein Puzzle vorbereitet.</div>;
  }

  return (
    <div className="puzzle-preview-shell">
      <svg
        className="puzzle-preview-svg"
        viewBox={`0 0 ${layout.imageWidth} ${layout.imageHeight}`}
        role="img"
        aria-label="Puzzle-Vorschau"
      >
        {previewMode !== 'shapes' ? (
          <image
            href={layout.imageDataUrl}
            x="0"
            y="0"
            width={layout.imageWidth}
            height={layout.imageHeight}
            preserveAspectRatio="none"
          />
        ) : null}

        {previewMode === 'outlines'
          ? layout.pieces.map((piece) => renderPolygon(piece))
          : null}

        {previewMode === 'shapes'
          ? layout.pieces.map((piece) => renderPolygon(piece, '#2d3a4f', piece.color))
          : null}
      </svg>
    </div>
  );
}
