import { useEffect, useMemo, useState } from 'react';

import { PUZZLE_CONFIG } from '../../config/puzzleConfig';
import { loadProjectPuzzleImage } from '../../utils/imageProcessing';
import { generatePuzzleLayout } from '../../utils/puzzleGeneration';
import { PuzzleAdminScreen } from './PuzzleAdminScreen';
import { PuzzlePlayScreen } from './PuzzlePlayScreen';
import type {
  PuzzleImageAsset,
  PuzzleLayout,
  PuzzlePreviewMode,
  PuzzleStorageState,
  PuzzleView,
} from './types';

const PUZZLE_STORAGE_KEY = 'spiele-puzzle-game-v3';

interface PuzzleGameProps {
  onBackHome: () => void;
}

function loadPuzzleStorage(): PuzzleStorageState {
  const rawValue = localStorage.getItem(PUZZLE_STORAGE_KEY);
  if (!rawValue) {
    return { layout: null };
  }

  try {
    return JSON.parse(rawValue) as PuzzleStorageState;
  } catch {
    return { layout: null };
  }
}

export function PuzzleGame({ onBackHome }: PuzzleGameProps) {
  const stored = useMemo(() => loadPuzzleStorage(), []);
  const compatibleStoredLayout =
    stored.layout?.sourceImagePath === PUZZLE_CONFIG.projectImagePath ? stored.layout : null;
  const [view, setView] = useState<PuzzleView>('play');
  const [layout, setLayout] = useState<PuzzleLayout | null>(compatibleStoredLayout);
  const [imageAsset, setImageAsset] = useState<PuzzleImageAsset | null>(
    compatibleStoredLayout
      ? {
          dataUrl: compatibleStoredLayout.imageDataUrl,
          width: compatibleStoredLayout.imageWidth,
          height: compatibleStoredLayout.imageHeight,
          scaled: compatibleStoredLayout.uploadNotice.length > 0,
        }
      : null,
  );
  const [pieceCount, setPieceCount] = useState(
    compatibleStoredLayout?.pieceCount ?? PUZZLE_CONFIG.defaultPieceCount,
  );
  const [working, setWorking] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [adminPromptOpen, setAdminPromptOpen] = useState(false);
  const [adminPasswordValue, setAdminPasswordValue] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(PUZZLE_STORAGE_KEY, JSON.stringify({ layout }));
      setStorageError('');
    } catch {
      setStorageError(
        'Lokales Speichern ist fehlgeschlagen. Das Bild ist möglicherweise zu groß für localStorage.',
      );
    }
  }, [layout]);

  useEffect(() => {
    if (layout || working) {
      return;
    }

    void reloadProjectImage(pieceCount, 'Super gemacht!', 'image');
  }, [layout, pieceCount, working]);

  async function reloadProjectImage(
    nextPieceCount: number,
    hiddenMessage = layout?.hiddenMessage ?? 'Super gemacht!',
    previewMode: PuzzlePreviewMode = layout?.previewMode ?? 'image',
  ) {
    setWorking(true);

    try {
      const prepared = await loadProjectPuzzleImage(PUZZLE_CONFIG.projectImagePath);
      setImageAsset(prepared);

      setLayout(
        generatePuzzleLayout(
          PUZZLE_CONFIG.projectImagePath,
          prepared.dataUrl,
          prepared.width,
          prepared.height,
          hiddenMessage,
          previewMode,
          nextPieceCount,
          prepared.scaled
            ? 'Das Projektbild wurde für lokale Speicherung und bessere Performance verkleinert.'
            : '',
        ),
      );
    } catch (error) {
      setStorageError(
        error instanceof Error ? error.message : 'Projektbild konnte nicht geladen werden.',
      );
    } finally {
      setWorking(false);
    }
  }

  function regenerateLayout() {
    if (!imageAsset || !layout) {
      return;
    }

    setLayout(
      generatePuzzleLayout(
        PUZZLE_CONFIG.projectImagePath,
        imageAsset.dataUrl,
        imageAsset.width,
        imageAsset.height,
        layout.hiddenMessage,
        layout.previewMode,
        pieceCount,
        layout.uploadNotice,
      ),
    );
  }

  function clearPuzzle() {
    setView('play');
    setLayout(null);
    setImageAsset(null);
    setPieceCount(PUZZLE_CONFIG.defaultPieceCount);
    localStorage.removeItem(PUZZLE_STORAGE_KEY);
    setStorageError('');
    setAdminPromptOpen(false);
    setAdminPasswordError('');
    setAdminPasswordValue('');
  }

  function updatePreviewMode(mode: PuzzlePreviewMode) {
    if (!layout) {
      return;
    }

    setLayout({
      ...layout,
      previewMode: mode,
    });
  }

  function updateHiddenMessage(message: string) {
    if (!layout) {
      return;
    }

    setLayout({
      ...layout,
      hiddenMessage: message,
    });
  }

  function generateFromCurrentImage() {
    if (!imageAsset) {
      return;
    }

    const hiddenMessage = layout?.hiddenMessage ?? 'Super gemacht!';
    const previewMode = layout?.previewMode ?? 'image';
    const uploadNotice = layout?.uploadNotice ?? '';

    setLayout(
      generatePuzzleLayout(
        PUZZLE_CONFIG.projectImagePath,
        imageAsset.dataUrl,
        imageAsset.width,
        imageAsset.height,
        hiddenMessage,
        previewMode,
        pieceCount,
        uploadNotice,
      ),
    );
  }

  function handlePieceCountChange(nextValue: number) {
    const clampedValue = Math.min(
      PUZZLE_CONFIG.maxPieceCount,
      Math.max(PUZZLE_CONFIG.minPieceCount, Number.isFinite(nextValue) ? nextValue : PUZZLE_CONFIG.defaultPieceCount),
    );
    setPieceCount(clampedValue);
  }

  function openAdminPrompt() {
    setAdminPasswordValue('');
    setAdminPasswordError('');
    setAdminPromptOpen(true);
  }

  function closeAdminPrompt() {
    setAdminPasswordValue('');
    setAdminPasswordError('');
    setAdminPromptOpen(false);
  }

  function openAdminAfterPassword() {
    if (adminPasswordValue !== PUZZLE_CONFIG.adminPassword) {
      setAdminPasswordError('Das Passwort stimmt nicht.');
      return;
    }

    closeAdminPrompt();
    setView('admin');
  }

  return view === 'admin' ? (
    <PuzzleAdminScreen
      layout={layout}
      pieceCount={pieceCount}
      onBackToHome={onBackHome}
      onBackToPlay={() => setView('play')}
      onReloadProjectImage={() =>
        reloadProjectImage(pieceCount, layout?.hiddenMessage ?? 'Super gemacht!', layout?.previewMode ?? 'image')
      }
      onGenerate={generateFromCurrentImage}
      onRegenerate={regenerateLayout}
      onRestart={clearPuzzle}
      onPreviewModeChange={updatePreviewMode}
      onHiddenMessageChange={updateHiddenMessage}
      onPieceCountChange={handlePieceCountChange}
      storageError={storageError}
      working={working}
    />
  ) : layout ? (
    <PuzzlePlayScreen
      layout={layout}
      adminPasswordError={adminPasswordError}
      adminPasswordValue={adminPasswordValue}
      adminPromptOpen={adminPromptOpen}
      onAdminPasswordChange={setAdminPasswordValue}
      onAdminPromptOpen={openAdminPrompt}
      onAdminPromptClose={closeAdminPrompt}
      onAdminSubmit={openAdminAfterPassword}
      onUpdateLayout={setLayout}
      onBackToHome={onBackHome}
    />
  ) : (
    <div className="puzzle-stage">
      <div className="puzzle-toolbar">
        <button type="button" className="secondary-button" onClick={onBackHome}>
          Zur Startseite
        </button>
      </div>
      <div className="puzzle-panel puzzle-loading-panel">
        <h2>Puzzle-Spiel</h2>
        <p>{working ? 'Projektbild wird geladen...' : storageError || 'Puzzle wird vorbereitet...'}</p>
      </div>
    </div>
  );
}
