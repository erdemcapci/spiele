import type { Role } from '../types/game';

interface HomeScreenProps {
  onOpenRole: (role: Role) => void;
}

export function HomeScreen({ onOpenRole }: HomeScreenProps) {
  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-actions">
          <button
            type="button"
            className="role-card role-card-observer"
            onClick={() => onOpenRole('observer')}
          >
            <span className="role-icon" aria-hidden="true">
              🗺️
            </span>
            <span className="role-title">Beobachter-Panel</span>
          </button>

          <button
            type="button"
            className="role-card role-card-player"
            onClick={() => onOpenRole('player')}
          >
            <span className="role-icon" aria-hidden="true">
              🧒
            </span>
            <span className="role-title">Spieler-Panel</span>
          </button>
        </div>
      </section>
    </main>
  );
}
