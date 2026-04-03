export type PuzzleView = 'admin' | 'play';
export type PuzzlePreviewMode = 'image' | 'outlines' | 'shapes';

export interface PuzzlePoint {
  x: number;
  y: number;
}

export interface PuzzleBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PuzzleImageAsset {
  dataUrl: string;
  width: number;
  height: number;
  scaled: boolean;
}

export interface PuzzlePiece {
  id: string;
  color: string;
  absolutePoints: PuzzlePoint[];
  relativePoints: PuzzlePoint[];
  path: string;
  bbox: PuzzleBounds;
  correctPosition: PuzzlePoint;
  currentPosition: PuzzlePoint;
  startPosition: PuzzlePoint;
  zIndex: number;
}

export interface PuzzleLayout {
  sourceImagePath: string;
  imageDataUrl: string;
  imageWidth: number;
  imageHeight: number;
  pieceCount: number;
  previewMode: PuzzlePreviewMode;
  hiddenMessage: string;
  pieces: PuzzlePiece[];
  trayHeight: number;
  uploadNotice: string;
}

export interface PuzzleStorageState {
  layout: PuzzleLayout | null;
}
