import type { PuzzleImageAsset } from '../games/puzzle/types';

const MAX_DIMENSION = 820;

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Bild konnte nicht geladen werden.'));
    image.src = dataUrl;
  });
}

function resolveProjectImageUrl(relativePath: string) {
  const normalizedPath = relativePath.startsWith('/')
    ? relativePath.slice(1)
    : relativePath;
  return `${import.meta.env.BASE_URL}${normalizedPath}`;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'));
    reader.readAsDataURL(file);
  });
}

export async function preparePuzzleImage(file: File): Promise<PuzzleImageAsset> {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);

  const largestSide = Math.max(image.width, image.height);
  if (largestSide <= MAX_DIMENSION) {
    return {
      dataUrl,
      width: image.width,
      height: image.height,
      scaled: false,
    };
  }

  const scale = MAX_DIMENSION / largestSide;
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas konnte nicht initialisiert werden.');
  }

  context.drawImage(image, 0, 0, width, height);

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width,
    height,
    scaled: true,
  };
}

export async function loadProjectPuzzleImage(relativePath: string): Promise<PuzzleImageAsset> {
  const resolvedUrl = resolveProjectImageUrl(relativePath);
  const image = await loadImage(resolvedUrl);

  const largestSide = Math.max(image.width, image.height);
  if (largestSide <= MAX_DIMENSION) {
    return {
      dataUrl: resolvedUrl,
      width: image.width,
      height: image.height,
      scaled: false,
    };
  }

  const scale = MAX_DIMENSION / largestSide;
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas konnte nicht initialisiert werden.');
  }

  context.drawImage(image, 0, 0, width, height);

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width,
    height,
    scaled: true,
  };
}
