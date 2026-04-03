# Labyrinth-Funkspiel

Eine kindgerechte React-Webanwendung für ein 3-Personen-Labyrinthspiel mit den Rollen Beobachter, Bote und Spieler.

## Funktionen

- Startseite mit zwei großen Rollen-Buttons
- Passwortschutz für Beobachter- und Spieler-Panel
- Vollständige Kartenansicht im Beobachter-Panel
- Manuelle Marker-Nachverfolgung für den Beobachter
- Vollständig blindes Spieler-Panel ohne sichtbare Nachbarfelder
- Drei Leben für den Spieler, Wandkontakt kostet ein Leben
- Nach Verlust aller Leben startet der Spieler wieder am Anfang
- Bewegung mit Wandprüfung, Statusmeldungen und Gewinnbildschirm
- Lokale Speicherung über `localStorage`, damit ein Neuladen den Stand nicht sofort löscht
- Statischer Build ohne Router, dadurch gut für GitHub Pages geeignet

## Technik

- React
- Vite
- TypeScript
- Reines CSS ohne großes UI-Framework

## Projektstruktur

```text
.
├── .github/workflows/deploy.yml
├── index.html
├── package.json
├── src
│   ├── App.tsx
│   ├── components
│   ├── config/gameConfig.ts
│   ├── data/mazes.ts
│   ├── styles.css
│   ├── types/game.ts
│   └── utils
└── vite.config.ts
```

## Lokales Starten

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Entwicklungsserver starten

```bash
npm run dev
```

Danach zeigt Vite eine lokale Adresse wie `http://localhost:5173` an.

### 3. Produktions-Build erzeugen

```bash
npm run build
```

Der fertige statische Build landet im Ordner `dist/`.

## Passwörter und Konfiguration anpassen

Die Passwörter liegen bewusst zentral in:

[`src/config/gameConfig.ts`](./src/config/gameConfig.ts)

Dort kannst du die Passwörter, die Anzahl der Leben, die Storage-Keys und das Standard-Labyrinth festlegen.

Standardwerte in diesem Projekt:

- Beobachter-Passwort: `blick123`
- Spieler-Passwort: `schritt123`

## Labyrinthe erweitern

Neue Karten werden in:

[`src/data/mazes.ts`](./src/data/mazes.ts)

angelegt. Die Datenstruktur ist vorbereitet für weitere Labyrinthe mit:

- `id`
- `name`
- `description`
- `grid`
- `start`
- `goal`

## Wichtige Spielregeln dieser Version

Diese Anwendung arbeitet vollständig ohne Backend. Deshalb gibt es **keine Live-Synchronisation zwischen verschiedenen Geräten**.

- Das Spieler-Gerät speichert den echten Spielstand lokal.
- Das Beobachter-Gerät zeigt die komplette Karte und führt den Marker manuell nach.
- Der Bote bleibt die Verbindung zwischen beiden Geräten.
- Der Spieler sieht keine Nachbarfelder und keine Karte.
- Der Spieler hat 3 Leben. Jeder Wandkontakt kostet 1 Leben.
- Wenn alle Leben aufgebraucht sind, startet der Spieler wieder am Anfang.

## GitHub Pages Deployment

Die Vite-Konfiguration nutzt relative Asset-Pfade und ist damit für statisches Hosting vorbereitet.

### Variante A: Automatisch mit GitHub Actions

1. Ein neues GitHub-Repository anlegen.
2. Den kompletten Projektordner dorthin pushen.
3. In GitHub unter `Settings -> Pages` als Quelle `GitHub Actions` auswählen.
4. Bei jedem Push auf `main` baut der Workflow das Projekt und veröffentlicht `dist/` auf GitHub Pages.

Der Workflow liegt in:

[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)

### Variante B: Manuell veröffentlichen

1. Lokal `npm install` und `npm run build` ausführen.
2. Den Inhalt des Ordners `dist/` auf ein statisches Hosting hochladen.
3. Für GitHub Pages kann alternativ ein eigener Branch oder ein separates Deploy-Werkzeug genutzt werden.

## Abnahme-Checkliste

- Zwei große Rollen-Buttons auf der Startseite
- Passwortabfrage vor jedem Panel
- Ganze Karte nur im Beobachter-Panel sichtbar
- Keine sichtbaren Nachbarfelder im Spieler-Panel
- Oben, unten, links, rechts funktionieren
- Wandkollision wird erkannt, kostet Leben und setzt bei 0 Leben zurück
- Zielerreichung zeigt den Gewinnbildschirm
- Mobil und Desktop nutzbar
- Build ist statisch und GitHub-Pages-tauglich
