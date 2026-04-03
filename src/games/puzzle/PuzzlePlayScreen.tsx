import { useEffect, useMemo, useRef, useState } from 'react';

import { PUZZLE_CONFIG } from '../../config/puzzleConfig';
import {
  bringPieceToFront,
  isPieceSnapped,
  isPuzzleSolved,
  resetPuzzlePieces,
  updatePiecePosition,
} from '../../utils/puzzleGeneration';
import { CompletionModal } from './CompletionModal';
import { PieceTray } from './PieceTray';
import { PuzzleBoard } from './PuzzleBoard';
import { PuzzlePiece } from './PuzzlePiece';
import type { PuzzleLayout, PuzzlePoint } from './types';

interface PuzzlePlayScreenProps {
  layout: PuzzleLayout;
  adminPasswordError: string;
  adminPasswordValue: string;
  adminPromptOpen: boolean;
  onAdminPasswordChange: (value: string) => void;
  onAdminPromptOpen: () => void;
  onAdminPromptClose: () => void;
  onAdminSubmit: () => void;
  onUpdateLayout: (layout: PuzzleLayout) => void;
  onBackToHome: () => void;
}

interface DragState {
  pieceId: string;
  pointerOffset: PuzzlePoint;
}

type TurnPhase = 'waiting' | 'active' | 'code' | 'won';

function createEmptyCodeValues() {
  return Object.fromEntries(PUZZLE_CONFIG.finalColorCode.map((entry) => [entry.id, ''])) as Record<
    string,
    string
  >;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export function PuzzlePlayScreen({
  layout,
  adminPasswordError,
  adminPasswordValue,
  adminPromptOpen,
  onAdminPasswordChange,
  onAdminPromptOpen,
  onAdminPromptClose,
  onAdminSubmit,
  onUpdateLayout,
  onBackToHome,
}: PuzzlePlayScreenProps) {
  const playAreaRef = useRef<HTMLDivElement | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('waiting');
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(PUZZLE_CONFIG.turnDurationSeconds);
  const [showCompletion, setShowCompletion] = useState(false);
  const [codeSolved, setCodeSolved] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [codeValues, setCodeValues] = useState<Record<string, string>>(() => createEmptyCodeValues());
  const turnActive = turnPhase === 'active';
  const puzzleSolved = useMemo(() => isPuzzleSolved(layout), [layout]);

  const sortedPieces = useMemo(
    () => [...layout.pieces].sort((left, right) => left.zIndex - right.zIndex),
    [layout.pieces],
  );

  const visiblePieces = useMemo(
    () => sortedPieces.filter((piece) => turnActive || isPieceSnapped(piece)),
    [sortedPieces, turnActive],
  );

  useEffect(() => {
    if (!puzzleSolved) {
      return;
    }

    setShowCompletion(true);
    setTurnPhase((previousPhase) => (previousPhase === 'won' ? 'won' : 'code'));
    setDragState(null);
  }, [puzzleSolved]);

  useEffect(() => {
    if (!turnActive || puzzleSolved) {
      return;
    }

    if (timeLeft <= 0) {
      setTurnPhase('waiting');
      setCurrentPlayer((previousPlayer) => (previousPlayer % PUZZLE_CONFIG.playerCount) + 1);
      setTimeLeft(PUZZLE_CONFIG.turnDurationSeconds);
      setDragState(null);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setTimeLeft((previousTime) => Math.max(0, previousTime - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [puzzleSolved, timeLeft, turnActive]);

  useEffect(() => {
    if (!dragState || !turnActive || puzzleSolved) {
      return;
    }

    const activeDrag = dragState;

    function handlePointerMove(event: PointerEvent) {
      if (!playAreaRef.current) {
        return;
      }

      const areaRect = playAreaRef.current.getBoundingClientRect();
      const piece = layout.pieces.find((entry) => entry.id === activeDrag.pieceId);
      if (!piece) {
        return;
      }

      const nextPosition = {
        x: Math.max(
          0,
          Math.min(
            areaRect.width - piece.bbox.width,
            event.clientX - areaRect.left - activeDrag.pointerOffset.x,
          ),
        ),
        y: Math.max(
          0,
          Math.min(
            areaRect.height - piece.bbox.height,
            event.clientY - areaRect.top - activeDrag.pointerOffset.y,
          ),
        ),
      };

      onUpdateLayout(updatePiecePosition(layout, piece.id, nextPosition, 0));
    }

    function handlePointerUp() {
      const piece = layout.pieces.find((entry) => entry.id === activeDrag.pieceId);
      if (!piece) {
        setDragState(null);
        return;
      }

      onUpdateLayout(updatePiecePosition(layout, piece.id, piece.currentPosition));
      setDragState(null);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState, layout, onUpdateLayout, puzzleSolved, turnActive]);

  function resetTurnFlow() {
    setDragState(null);
    setTurnPhase('waiting');
    setCurrentPlayer(1);
    setTimeLeft(PUZZLE_CONFIG.turnDurationSeconds);
    setShowCompletion(false);
    setCodeSolved(false);
    setCodeError('');
    setCodeValues(createEmptyCodeValues());
  }

  function startTurn() {
    if (puzzleSolved) {
      return;
    }

    setDragState(null);
    setTimeLeft(PUZZLE_CONFIG.turnDurationSeconds);
    setTurnPhase('active');
  }

  function handleRestartPuzzle() {
    resetTurnFlow();
    onUpdateLayout(resetPuzzlePieces(layout));
  }

  function handleCodeChange(id: string, value: string) {
    setCodeError('');
    setCodeValues((currentValues) => ({
      ...currentValues,
      [id]: value.replace(/\D/g, '').slice(0, 1),
    }));
  }

  function handleCodeSubmit() {
    const isValid = PUZZLE_CONFIG.finalColorCode.every(
      (entry) => (codeValues[entry.id] ?? '') === entry.password,
    );

    if (!isValid) {
      setCodeError('Der Farbcode stimmt noch nicht.');
      return;
    }

    setCodeSolved(true);
    setTurnPhase('won');
    setCodeError('');
  }

  function handlePointerDown(pieceId: string, event: React.PointerEvent<HTMLDivElement>) {
    if (!playAreaRef.current || !turnActive || puzzleSolved) {
      return;
    }

    const piece = layout.pieces.find((entry) => entry.id === pieceId);
    if (!piece || isPieceSnapped(piece)) {
      return;
    }

    const areaRect = playAreaRef.current.getBoundingClientRect();
    const offset = {
      x: event.clientX - areaRect.left - piece.currentPosition.x,
      y: event.clientY - areaRect.top - piece.currentPosition.y,
    };

    setDragState({
      pieceId,
      pointerOffset: offset,
    });

    onUpdateLayout(bringPieceToFront(layout, pieceId));
  }

  return (
    <div className="puzzle-stage">
      <div className="puzzle-toolbar">
        <button type="button" className="secondary-button" onClick={onBackToHome}>
          Zur Startseite
        </button>
        <button type="button" className="secondary-button" onClick={onAdminPromptOpen}>
          Admin
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={handleRestartPuzzle}
        >
          Puzzle neu starten
        </button>
      </div>

      <section className="puzzle-panel puzzle-turn-panel">
        <div>
          <span className="puzzle-turn-label">Spieler {currentPlayer}</span>
          <strong className="puzzle-turn-time">
            {turnActive ? formatTime(timeLeft) : 'Bereit'}
          </strong>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={startTurn}
          disabled={turnActive || puzzleSolved}
        >
          Start
        </button>
      </section>

      <div className="puzzle-play-area-shell">
        <div
          ref={playAreaRef}
          className="puzzle-play-area"
          style={{
            width: `${layout.imageWidth}px`,
            height: `${layout.imageHeight + layout.trayHeight}px`,
          }}
        >
          <PuzzleBoard layout={layout} />
          {turnActive ? <PieceTray boardHeight={layout.imageHeight} trayHeight={layout.trayHeight} /> : null}

          {visiblePieces.map((piece) => (
            <PuzzlePiece
              key={piece.id}
              canDrag={turnActive && !isPieceSnapped(piece)}
              piece={piece}
              layout={layout}
              onPointerDown={handlePointerDown}
            />
          ))}
        </div>
      </div>

      {showCompletion ? (
        <CompletionModal
          codeError={codeError}
          codeSolved={codeSolved}
          codeValues={codeValues}
          message={layout.hiddenMessage}
          onClose={() => setShowCompletion(false)}
          onCodeChange={handleCodeChange}
          onSubmit={handleCodeSubmit}
        />
      ) : null}

      {adminPromptOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="puzzle-admin-title">
            <div className="modal-head">
              <h2 id="puzzle-admin-title">Puzzle-Admin</h2>
              <button type="button" className="ghost-button" onClick={onAdminPromptClose}>
                Schließen
              </button>
            </div>
            <form
              className="modal-form"
              onSubmit={(event) => {
                event.preventDefault();
                onAdminSubmit();
              }}
            >
              <label className="field-label" htmlFor="puzzle-admin-password">
                Passwort
              </label>
              <input
                id="puzzle-admin-password"
                className="text-input"
                type="password"
                value={adminPasswordValue}
                onChange={(event) => onAdminPasswordChange(event.target.value)}
                autoFocus
              />
              {adminPasswordError ? <p className="inline-error">{adminPasswordError}</p> : null}
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={onAdminPromptClose}>
                  Abbrechen
                </button>
                <button type="submit">Admin öffnen</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
