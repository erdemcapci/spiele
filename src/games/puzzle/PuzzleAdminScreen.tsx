import { PUZZLE_CONFIG } from '../../config/puzzleConfig';
import { PuzzlePreview } from './PuzzlePreview';
import type { PuzzleLayout, PuzzlePreviewMode } from './types';

interface PuzzleAdminScreenProps {
  layout: PuzzleLayout | null;
  pieceCount: number;
  onBackToHome: () => void;
  onBackToPlay: () => void;
  onReloadProjectImage: () => void;
  onGenerate: () => void;
  onRegenerate: () => void;
  onRestart: () => void;
  onPreviewModeChange: (mode: PuzzlePreviewMode) => void;
  onHiddenMessageChange: (message: string) => void;
  onPieceCountChange: (pieceCount: number) => void;
  storageError: string;
  working: boolean;
}

const PREVIEW_MODES: PuzzlePreviewMode[] = ['image', 'outlines', 'shapes'];

export function PuzzleAdminScreen({
  layout,
  pieceCount,
  onBackToHome,
  onBackToPlay,
  onReloadProjectImage,
  onGenerate,
  onRegenerate,
  onRestart,
  onPreviewModeChange,
  onHiddenMessageChange,
  onPieceCountChange,
  storageError,
  working,
}: PuzzleAdminScreenProps) {
  return (
    <div className="puzzle-stage">
      <div className="puzzle-toolbar">
        <button type="button" className="secondary-button" onClick={onBackToHome}>
          Zur Startseite
        </button>
        <button type="button" className="secondary-button" onClick={onBackToPlay} disabled={!layout}>
          Zurück zum Puzzle
        </button>
        <button type="button" className="secondary-button" onClick={onReloadProjectImage} disabled={working}>
          Projektbild neu laden
        </button>
        <button type="button" className="secondary-button" onClick={onGenerate} disabled={!layout || working}>
          Teile erzeugen
        </button>
        <button type="button" className="secondary-button" onClick={onRegenerate} disabled={!layout || working}>
          Teile neu erzeugen
        </button>
        <button type="button" className="secondary-button" onClick={onRestart}>
          Zurücksetzen
        </button>
      </div>

      <div className="puzzle-admin-grid">
        <section className="puzzle-panel">
          <div className="puzzle-panel-head">
            <h2>Puzzle-Admin</h2>
          </div>

          <div className="puzzle-field">
            <span>Projektbild</span>
            <div className="puzzle-static-path">{PUZZLE_CONFIG.projectImagePath}</div>
          </div>

          <label className="puzzle-field">
            <span>Teile</span>
            <input
              className="text-input"
              type="number"
              min={PUZZLE_CONFIG.minPieceCount}
              max={PUZZLE_CONFIG.maxPieceCount}
              value={pieceCount}
              onChange={(event) => onPieceCountChange(Number(event.target.value))}
            />
          </label>

          <label className="puzzle-field">
            <span>Abschlussnachricht</span>
            <input
              className="text-input"
              type="text"
              value={layout?.hiddenMessage ?? ''}
              onChange={(event) => onHiddenMessageChange(event.target.value)}
              placeholder="Super gemacht!"
            />
          </label>

          <div className="puzzle-preview-switch">
            {PREVIEW_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                className={layout?.previewMode === mode ? 'puzzle-chip is-active' : 'puzzle-chip'}
                onClick={() => onPreviewModeChange(mode)}
                disabled={!layout}
              >
                {mode === 'image'
                  ? 'Nur Bild'
                  : mode === 'outlines'
                    ? 'Bild + Konturen'
                    : 'Teileformen'}
              </button>
            ))}
          </div>

          {layout?.uploadNotice ? <p className="puzzle-note">{layout.uploadNotice}</p> : null}
          {storageError ? <p className="puzzle-error">{storageError}</p> : null}
        </section>

        <section className="puzzle-panel puzzle-preview-panel">
          <PuzzlePreview layout={layout} previewMode={layout?.previewMode ?? 'image'} />
        </section>
      </div>
    </div>
  );
}
