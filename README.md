# Spielesammlung

Eine React- und Vite-Webanwendung mit zwei vollständig clientseitigen Spielen:

- `Maze Game`: das bestehende Labyrinthspiel, unverändert eingebunden
- `Puzzle Game`: ein neues Bildpuzzle mit Admin-Modus und Spielmodus

## Überblick

Die Startseite zeigt zwei große Buttons:

- `Maze Game`
- `Puzzle Game`

`Maze Game` öffnet das vorhandene Labyrinthspiel direkt. `Puzzle Game` öffnet direkt den Spielbildschirm des neuen Puzzlesystems.

## Maze Game

Das Maze Game ist die bereits vorhandene Spiel-Logik und wurde als bestehendes Spiel eingebunden. Es wird im neuen Hauptmenü nur als eigenes Spiel gestartet und intern nicht verändert.

Kurz:

- Passwortgeschützte Beobachter- und Spieler-Ansicht
- Beobachter sieht das komplette Labyrinth
- Spieler sieht nur den bereits gegangenen Weg
- Wandkontakt kostet Leben
- Admin kann im Spielerbildschirm Leben hinzufügen

## Puzzle Game

Das Puzzle Game besteht aus zwei Bereichen:

### 1. Puzzle Admin

Hier wird das Puzzle vorbereitet.

Funktionen:

- Projektbild aus dem Projektordner verwenden
- Vorschau anzeigen
- Anzahl der Teile erhöhen oder verringern
- Unregelmäßige Puzzle-Teile erzeugen
- Neues Layout mit demselben Bild erzeugen
- Alles zurücksetzen
- Versteckte Abschlussnachricht festlegen
- Vorschau-Modi wechseln:
  - `Image only`
  - `Image + outlines`
  - `Piece shapes`

Admin-Zugang:

- Die Admin-Seite wird aus dem Spielbildschirm über den `Admin`-Button geöffnet
- Passwort: `mocha`

### 2. Puzzle Play

Hier wird das Puzzle gespielt.

Funktionen:

- Puzzlebrett mit Umrissen anzeigen
- Gemischte Teile im unteren Bereich anzeigen
- Teile per Drag-and-Drop bewegen
- Teile in die richtige Position einrasten lassen, wenn sie nah genug liegen
- Falsche Platzierung erlauben
- Abschluss erkennen, wenn alle Teile korrekt sitzen
- Abschlussnachricht anzeigen

Steuerung:

- `Restart Puzzle`
- `Shuffle Again`
- `Admin`
- `Back to Home`

## Wie das Puzzle technisch funktioniert

Das Puzzle verwendet kein einfaches Haupt-Square-Grid. Stattdessen wird eine praktische Voronoi-ähnliche Aufteilung verwendet:

- zufällige Punkte werden über dem Bild verteilt
- aus diesen Punkten werden unregelmäßige Polygonbereiche erzeugt
- jede Form wird als eigenes Puzzle-Stück gerendert

Dadurch entstehen:

- diagonale Kanten
- unterschiedliche Größen
- kindgerechte, aber nicht nur rechteckige Stücke

## Admin-Modus verwenden

1. Bilddatei im Projektordner `public/puzzle-images/puzzle-source.svg` oder an derselben Stelle mit `png/jpg`-Ersatz ablegen
2. `Puzzle Game` auf der Startseite öffnen
3. Im Spielbildschirm `Admin` wählen
4. Passwort `mocha` eingeben
5. Stückzahl anpassen
6. Falls nötig `Completion Message` eintragen
7. Mit `Reload Project Image`, `Generate Pieces` oder `Regenerate Pieces` arbeiten
8. Mit `Back to Puzzle` zurück ins Spiel

## Projektbild verwenden

- Die Puzzle-Grafik kommt aus dem Projektordner `public/puzzle-images/`
- Standarddatei: `puzzle-source.svg`
- Du kannst diese Datei durch eine eigene `png`, `jpg`, `jpeg` oder `svg` Datei mit demselben Namen ersetzen
- Das Bild wird im Browser geladen und bei Bedarf verkleinert

## Persistenz über localStorage

Gespeichert werden:

- Projektbild als geladene Data URL
- Puzzle-Layout
- aktuelle Positionen der Teile
- versteckte Abschlussnachricht
- Stückzahl

Wenn das Bild für `localStorage` dennoch zu groß ist, zeigt die App eine Meldung an. Das Puzzle funktioniert dann weiterhin im aktuellen Tab, aber Persistenz kann fehlschlagen.

## Projektstruktur

```text
src/
  App.tsx
  MainApp.tsx
  app-shell.css
  components/
  games/
    maze/
      MazeGameWrapper.tsx
    puzzle/
      CompletionModal.tsx
      ImageUploader.tsx
      PieceTray.tsx
      PuzzleAdminScreen.tsx
      PuzzleBoard.tsx
      PuzzleGame.tsx
      PuzzlePiece.tsx
      PuzzlePlayScreen.tsx
      PuzzlePreview.tsx
      types.ts
  utils/
    imageProcessing.ts
    maze.ts
    puzzleGeneration.ts
    storage.ts
```

## Lokal starten

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Entwicklungsserver starten

```bash
npm run dev
```

Danach öffnet Vite eine lokale URL, meist `http://localhost:5173`.

### 3. Produktions-Build erzeugen

```bash
npm run build
```

Der statische Build landet in `dist/`.

## GitHub Pages Deployment

Das Projekt ist für statisches Hosting vorbereitet.

### Mit GitHub Actions

1. Repository nach GitHub pushen
2. In GitHub `Settings -> Pages` öffnen
3. `Source` auf `GitHub Actions` setzen
4. Workflow aus [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) laufen lassen

### Manuell

1. `npm run build`
2. Inhalt von `dist/` auf ein statisches Hosting hochladen

## Einschränkungen

- Kein Backend, daher keine Live-Synchronisation zwischen Geräten
- Bilder werden lokal im Browser verarbeitet
- Sehr große Bilder können wegen `localStorage`-Grenzen nicht dauerhaft gespeichert werden
- Puzzle-Stücke werden clientseitig erzeugt und geshuffelt; die genaue Form ist bei jeder Neugenerierung anders
