import type { MazeDefinition, MoveDirection, ObserverState } from '../types/game';
import { MazeGrid } from './MazeGrid';

interface ObserverPanelProps {
  maze: MazeDefinition;
  state: ObserverState;
  onBackHome: () => void;
  onResetObserver: () => void;
  onMoveMarker: (direction: MoveDirection) => void;
}

const COMMAND_BUTTONS: Array<{ action: MoveDirection; label: string; icon: string }> = [
  { action: 'up', label: 'Oben', icon: '↑' },
  { action: 'right', label: 'Rechts', icon: '→' },
  { action: 'left', label: 'Links', icon: '←' },
  { action: 'down', label: 'Unten', icon: '↓' },
];

export function ObserverPanel({
  maze,
  state,
  onBackHome,
  onResetObserver,
  onMoveMarker,
}: ObserverPanelProps) {
  return (
    <main className="page-shell page-panel">
      <section className="panel-header">
        <div>
          <h1>Beobachter-Panel</h1>
        </div>

        <div className="header-actions">
          <button type="button" className="secondary-button" onClick={onBackHome}>
            Zur Startseite
          </button>
          <button type="button" className="ghost-button" onClick={onResetObserver}>
            Marker zurücksetzen
          </button>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="surface-card maze-panel">
          <div className="section-title-row">
            <h2>Komplette Karte</h2>
            <span className="badge">Start = S, Ziel = Z</span>
          </div>
          <MazeGrid
            maze={maze}
            markerPosition={state.trackedPosition}
            markerTone="observer"
            ariaLabel="Vollständiges Labyrinth mit Beobachter-Marker"
          />
        </article>

        <aside className="stack-column">
          <article className="surface-card surface-card-compact">
            <h2>Marker bewegen</h2>
            <div className="command-grid">
              {COMMAND_BUTTONS.map((button) => (
                <button
                  type="button"
                  key={button.action}
                  className="command-button"
                  onClick={() => onMoveMarker(button.action)}
                >
                  {button.icon}
                  <small>{button.label}</small>
                </button>
              ))}
            </div>
          </article>

          <article className="surface-card">
            <h2>Marker-Status</h2>
            <div className="metric-grid">
              <div className="metric-card">
                <span>Position</span>
                <strong>
                  {state.trackedPosition.x}, {state.trackedPosition.y}
                </strong>
              </div>
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}
