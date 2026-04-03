import type { PlayerGameState } from '../types/game';
import { getMazeById } from '../data/mazes';
import { GAME_CONFIG } from '../config/gameConfig';
import { MazeGrid } from './MazeGrid';

interface PlayerPanelProps {
  state: PlayerGameState;
  onBackHome: () => void;
  onResetPlayer: () => void;
  onMoveUp: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onMoveLeft: () => void;
}

export function PlayerPanel({
  state,
  onBackHome,
  onResetPlayer,
  onMoveUp,
  onMoveRight,
  onMoveDown,
  onMoveLeft,
}: PlayerPanelProps) {
  const maze = getMazeById(GAME_CONFIG.defaultMazeId);

  return (
    <main className="page-shell page-panel">
      <section className="panel-header">
        <div>
          <h1>Spieler-Panel</h1>
        </div>

        <div className="header-actions">
          <button type="button" className="secondary-button" onClick={onBackHome}>
            Zur Startseite
          </button>
          <button type="button" className="ghost-button" onClick={onResetPlayer}>
            Spielstand zurücksetzen
          </button>
        </div>
      </section>

      <section className="dashboard-grid player-grid">
        <article className="surface-card player-view-card">
          <h2>Dein Sichtfeld</h2>
          <div className="blind-view">
            <MazeGrid
              maze={maze}
              markerPosition={state.position}
              markerTone="player"
              visiblePath={state.visitedPath}
              ariaLabel="Labyrinth mit bisher besuchtem Weg des Spielers"
            />
          </div>
        </article>

        <aside className="stack-column">
          <article className="surface-card">
            <h2>Bewegung</h2>
            {state.statusMessage ? (
              <p
                className={`status-message ${
                  state.statusMessage.includes('Wand') ||
                  state.statusMessage.includes('Leben')
                    ? 'warning'
                    : 'info'
                }`}
              >
                {state.statusMessage}
              </p>
            ) : null}
            <div className="control-pad">
              <span className="control-spacer" aria-hidden="true" />
              <button type="button" className="control-button" onClick={onMoveUp}>
                ↑
                <small>Oben</small>
              </button>
              <span className="control-spacer" aria-hidden="true" />

              <button type="button" className="control-button" onClick={onMoveLeft}>
                ←
                <small>Links</small>
              </button>
              <div className="direction-pill lives-pill">
                <strong>{'❤'.repeat(state.lives) || '–'}</strong>
                <span>Noch {state.lives} Leben</span>
              </div>
              <button type="button" className="control-button" onClick={onMoveRight}>
                →
                <small>Rechts</small>
              </button>

              <span className="control-spacer" aria-hidden="true" />
              <button type="button" className="control-button" onClick={onMoveDown}>
                ↓
                <small>Unten</small>
              </button>
              <span className="control-spacer" aria-hidden="true" />
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}
