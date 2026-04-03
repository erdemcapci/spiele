import type { Role } from '../types/game';

interface HomeScreenProps {
  title: string;
  onOpenRole: (role: Role) => void;
  onResetLocalData: () => void;
}

export function HomeScreen({
  title,
  onOpenRole,
  onResetLocalData,
}: HomeScreenProps) {
  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">3 Kinder, 1 Labyrinth, klare Hinweise</p>
          <h1>{title}</h1>
          <p className="lead">
            Dieses Spiel verteilt drei Rollen: Beobachter, Bote und Spieler. Der
            Beobachter sieht die komplette Karte, der Bote übermittelt die Hinweise
            und der Spieler versucht, den Ausgang zu finden.
          </p>
        </div>

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
            <span className="role-copy">
              Ganze Karte sehen, Befehle planen und den Marker manuell nachführen.
            </span>
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
            <span className="role-copy">
              Nur den eigenen Ausschnitt sehen, Befehle ausführen und den Ausgang
              erreichen.
            </span>
          </button>
        </div>
      </section>

      <section className="content-grid">
        <article className="info-card">
          <h2>So spielt man</h2>
          <ul className="rule-list">
            <li>Der Beobachter sieht das gesamte Labyrinth.</li>
            <li>Der Bote hört zu und sagt dem Spieler die Hinweise weiter.</li>
            <li>Der Spieler sieht nur seine eigene Ansicht und bewegt sich selbst.</li>
            <li>Das Ziel ist erreicht, sobald der Spieler den Ausgang findet.</li>
          </ul>
        </article>

        <article className="info-card">
          <h2>Wichtig für eure Geräte</h2>
          <p>
            Diese Version arbeitet vollständig ohne Backend. Deshalb verwaltet jedes
            Gerät seinen eigenen lokalen Stand. Der Beobachter führt den Marker auf
            seinem Gerät manuell nach, während der Spieler seinen echten Stand lokal
            speichert.
          </p>
        </article>

        <article className="info-card">
          <h2>Auf diesem Gerät neu starten</h2>
          <p>
            Damit werden Spielerstand, Beobachter-Marker und der lokale Verlauf auf
            diesem Gerät zurückgesetzt.
          </p>
          <button type="button" className="secondary-button" onClick={onResetLocalData}>
            Lokale Daten zurücksetzen
          </button>
        </article>
      </section>
    </main>
  );
}
