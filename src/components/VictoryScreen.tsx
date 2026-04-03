import type { PlayerGameState } from '../types/game';

interface VictoryScreenProps {
  state: PlayerGameState;
  onPlayAgain: () => void;
  onBackHome: () => void;
}

export function VictoryScreen({
  state,
  onPlayAgain,
  onBackHome,
}: VictoryScreenProps) {
  return (
    <main className="page-shell victory-shell">
      <section className="victory-card">
        <p className="eyebrow">Ausgang erreicht</p>
        <h1>Geschafft!</h1>
        <p className="lead">
          Der Spieler hat den Ausgang gefunden. Jetzt könnt ihr noch einmal spielen
          oder die Rollen tauschen.
        </p>

        <div className="victory-metrics">
          <div className="metric-card">
            <span>Verbleibende Leben</span>
            <strong>{state.lives}</strong>
          </div>
          <div className="metric-card">
            <span>Schritte</span>
            <strong>{state.moves}</strong>
          </div>
          <div className="metric-card">
            <span>Wandkontakte</span>
            <strong>{state.bumps}</strong>
          </div>
        </div>

        <div className="victory-actions">
          <button type="button" onClick={onPlayAgain}>
            Noch eine Runde
          </button>
          <button type="button" className="secondary-button" onClick={onBackHome}>
            Zur Startseite
          </button>
        </div>
      </section>
    </main>
  );
}
