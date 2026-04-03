import type {
  PuzzleBounds,
  PuzzleLayout,
  PuzzlePiece,
  PuzzlePoint,
  PuzzlePreviewMode,
} from '../games/puzzle/types';

const PIECE_COLORS = [
  '#ffd6a5',
  '#ffcad4',
  '#cdeac0',
  '#c8e7ff',
  '#d9c5ff',
  '#fff1a8',
  '#ffc7a8',
  '#b8f2e6',
];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function distance(a: PuzzlePoint, b: PuzzlePoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function polygonArea(points: PuzzlePoint[]) {
  let sum = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    sum += current.x * next.y - next.x * current.y;
  }
  return Math.abs(sum / 2);
}

function polygonBounds(points: PuzzlePoint[]): PuzzleBounds {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function buildRelativePoints(points: PuzzlePoint[], bounds: PuzzleBounds) {
  return points.map((point) => ({
    x: point.x - bounds.x,
    y: point.y - bounds.y,
  }));
}

function buildSvgPath(points: PuzzlePoint[]) {
  if (points.length === 0) {
    return '';
  }

  const [first, ...rest] = points;
  const commands = [`M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`];

  rest.forEach((point) => {
    commands.push(`L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`);
  });

  commands.push('Z');
  return commands.join(' ');
}

function clipPolygonWithHalfPlane(
  polygon: PuzzlePoint[],
  midpoint: PuzzlePoint,
  normal: PuzzlePoint,
) {
  const inside = (point: PuzzlePoint) =>
    (point.x - midpoint.x) * normal.x + (point.y - midpoint.y) * normal.y <= 0;

  const intersect = (start: PuzzlePoint, end: PuzzlePoint): PuzzlePoint => {
    const startDot = (start.x - midpoint.x) * normal.x + (start.y - midpoint.y) * normal.y;
    const endDot = (end.x - midpoint.x) * normal.x + (end.y - midpoint.y) * normal.y;
    const ratio = startDot / (startDot - endDot);
    return {
      x: start.x + (end.x - start.x) * ratio,
      y: start.y + (end.y - start.y) * ratio,
    };
  };

  const clipped: PuzzlePoint[] = [];

  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];
    const currentInside = inside(current);
    const nextInside = inside(next);

    if (currentInside && nextInside) {
      clipped.push(next);
    } else if (currentInside && !nextInside) {
      clipped.push(intersect(current, next));
    } else if (!currentInside && nextInside) {
      clipped.push(intersect(current, next));
      clipped.push(next);
    }
  }

  return clipped;
}

function createVoronoiCell(
  site: PuzzlePoint,
  sites: PuzzlePoint[],
  width: number,
  height: number,
) {
  let polygon: PuzzlePoint[] = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];

  sites.forEach((otherSite) => {
    if (otherSite === site) {
      return;
    }

    const midpoint = {
      x: (site.x + otherSite.x) / 2,
      y: (site.y + otherSite.y) / 2,
    };

    const normal = {
      x: otherSite.x - site.x,
      y: otherSite.y - site.y,
    };

    polygon = clipPolygonWithHalfPlane(polygon, midpoint, normal);
  });

  return polygon;
}

function createSites(width: number, height: number, pieceCount: number) {
  const sites: PuzzlePoint[] = [];
  const minDistance = Math.sqrt((width * height) / pieceCount) * 0.52;
  const marginX = Math.max(28, width * 0.06);
  const marginY = Math.max(28, height * 0.06);
  let attempts = 0;

  while (sites.length < pieceCount && attempts < 4000) {
    attempts += 1;
    const candidate = {
      x: randomBetween(marginX, width - marginX),
      y: randomBetween(marginY, height - marginY),
    };

    if (sites.every((site) => distance(site, candidate) >= minDistance)) {
      sites.push(candidate);
    }
  }

  while (sites.length < pieceCount) {
    sites.push({
      x: randomBetween(0, width),
      y: randomBetween(0, height),
    });
  }

  return sites;
}

function assignTrayPositions(pieces: PuzzlePiece[], boardWidth: number, boardHeight: number) {
  const padding = 14;
  const shuffledIds = [...pieces.map((piece) => piece.id)].sort(() => Math.random() - 0.5);
  const byId = new Map(pieces.map((piece) => [piece.id, piece]));

  let cursorX = padding;
  let cursorY = boardHeight + padding;
  let rowHeight = 0;
  let trayBottom = cursorY;

  const positioned = shuffledIds.map((id, index) => {
    const piece = byId.get(id)!;

    if (cursorX + piece.bbox.width > boardWidth - padding) {
      cursorX = padding;
      cursorY += rowHeight + padding;
      rowHeight = 0;
    }

    const startPosition = {
      x: cursorX,
      y: cursorY,
    };

    cursorX += piece.bbox.width + padding;
    rowHeight = Math.max(rowHeight, piece.bbox.height);
    trayBottom = Math.max(trayBottom, cursorY + piece.bbox.height);

    return {
      ...piece,
      startPosition,
      currentPosition: startPosition,
      zIndex: index + 1,
    };
  });

  return {
    trayHeight: Math.max(220, trayBottom - boardHeight + padding),
    pieces: positioned,
  };
}

export function shufflePuzzlePieces(layout: PuzzleLayout) {
  const piecesWithoutPositions = layout.pieces.map((piece) => ({
    ...piece,
    currentPosition: piece.correctPosition,
    startPosition: piece.correctPosition,
  }));

  const shuffled = assignTrayPositions(
    piecesWithoutPositions,
    layout.imageWidth,
    layout.imageHeight,
  );

  return {
    ...layout,
    trayHeight: shuffled.trayHeight,
    pieces: shuffled.pieces,
  };
}

export function resetPuzzlePieces(layout: PuzzleLayout) {
  return {
    ...layout,
    pieces: layout.pieces.map((piece) => ({
      ...piece,
      currentPosition: piece.startPosition,
    })),
  };
}

export function generatePuzzleLayout(
  sourceImagePath: string,
  imageDataUrl: string,
  width: number,
  height: number,
  hiddenMessage: string,
  previewMode: PuzzlePreviewMode,
  pieceCount = 15,
  uploadNotice = '',
): PuzzleLayout {
  const totalArea = width * height;
  const minimumArea = totalArea / (pieceCount * 3.4);
  let pieces: PuzzlePiece[] = [];

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const sites = createSites(width, height, pieceCount);
    const cells = sites
      .map((site, index) => {
        const polygon = createVoronoiCell(site, sites, width, height);
        const area = polygonArea(polygon);

        if (polygon.length < 3 || area < minimumArea) {
          return null;
        }

        const bbox = polygonBounds(polygon);
        const relativePoints = buildRelativePoints(polygon, bbox);

        return {
          id: `piece-${index + 1}`,
          color: PIECE_COLORS[index % PIECE_COLORS.length],
          absolutePoints: polygon,
          relativePoints,
          path: buildSvgPath(relativePoints),
          bbox,
          correctPosition: { x: bbox.x, y: bbox.y },
          currentPosition: { x: bbox.x, y: bbox.y },
          startPosition: { x: bbox.x, y: bbox.y },
          zIndex: index + 1,
        } satisfies PuzzlePiece;
      })
      .filter(Boolean) as PuzzlePiece[];

    if (cells.length === pieceCount) {
      pieces = cells;
      break;
    }
  }

  if (pieces.length === 0) {
    throw new Error('Puzzle-Teile konnten nicht erzeugt werden.');
  }

  const positioned = assignTrayPositions(pieces, width, height);

  return {
    sourceImagePath,
    imageDataUrl,
    imageWidth: width,
    imageHeight: height,
    pieceCount,
    hiddenMessage,
    previewMode,
    uploadNotice,
    pieces: positioned.pieces,
    trayHeight: positioned.trayHeight,
  };
}

export function isPuzzleSolved(layout: PuzzleLayout) {
  return layout.pieces.every((piece) => isPieceSnapped(piece));
}

export function isPieceSnapped(piece: PuzzlePiece) {
  return (
    Math.abs(piece.currentPosition.x - piece.correctPosition.x) < 0.1 &&
    Math.abs(piece.currentPosition.y - piece.correctPosition.y) < 0.1
  );
}

export function bringPieceToFront(layout: PuzzleLayout, pieceId: string) {
  const highestZ = Math.max(...layout.pieces.map((piece) => piece.zIndex), 0);

  return {
    ...layout,
    pieces: layout.pieces.map((piece) =>
      piece.id === pieceId
        ? {
            ...piece,
            zIndex: highestZ + 1,
          }
        : piece,
    ),
  };
}

export function updatePiecePosition(
  layout: PuzzleLayout,
  pieceId: string,
  position: PuzzlePoint,
  snapDistance = 26,
) {
  return {
    ...layout,
    pieces: layout.pieces.map((piece) => {
      if (piece.id !== pieceId) {
        return piece;
      }

      const shouldSnap =
        Math.hypot(
          position.x - piece.correctPosition.x,
          position.y - piece.correctPosition.y,
        ) <= snapDistance;

      return {
        ...piece,
        currentPosition: shouldSnap ? piece.correctPosition : position,
      };
    }),
  };
}
