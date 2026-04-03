import { useState } from 'react';

import { APP_ACCESS_CONFIG } from './config/appAccessConfig';
import { MazeGameWrapper } from './games/maze/MazeGameWrapper';
import { PuzzleGame } from './games/puzzle/PuzzleGame';

type MainScreen = 'home' | 'maze' | 'puzzle';

export default function MainApp() {
  const [screen, setScreen] = useState<MainScreen>('home');
  const [puzzlePasswordOpen, setPuzzlePasswordOpen] = useState(false);
  const [puzzlePasswordValue, setPuzzlePasswordValue] = useState('');
  const [puzzlePasswordError, setPuzzlePasswordError] = useState('');

  function openPuzzlePrompt() {
    setPuzzlePasswordValue('');
    setPuzzlePasswordError('');
    setPuzzlePasswordOpen(true);
  }

  function closePuzzlePrompt() {
    setPuzzlePasswordValue('');
    setPuzzlePasswordError('');
    setPuzzlePasswordOpen(false);
  }

  function submitPuzzlePassword() {
    if (puzzlePasswordValue !== APP_ACCESS_CONFIG.puzzlePassword) {
      setPuzzlePasswordError('Das Passwort stimmt nicht.');
      return;
    }

    closePuzzlePrompt();
    setScreen('puzzle');
  }

  return (
    <div className="launcher-root">
      {screen === 'home' ? (
        <main className="launcher-shell">
          <section className="launcher-card">
            <h1 className="launcher-title">Spielesammlung</h1>
            <div className="launcher-actions">
              <button
                type="button"
                className="launcher-button launcher-button-maze"
                onClick={() => setScreen('maze')}
              >
                Maze Game
              </button>
              <button
                type="button"
                className="launcher-button launcher-button-puzzle"
                onClick={openPuzzlePrompt}
              >
                Puzzle-Spiel
              </button>
            </div>
          </section>
        </main>
      ) : null}

      {screen === 'maze' ? <MazeGameWrapper onBackHome={() => setScreen('home')} /> : null}

      {screen === 'puzzle' ? <PuzzleGame onBackHome={() => setScreen('home')} /> : null}

      {puzzlePasswordOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="puzzle-access-title">
            <div className="modal-head">
              <h2 id="puzzle-access-title">Puzzle-Spiel</h2>
              <button type="button" className="ghost-button" onClick={closePuzzlePrompt}>
                Schließen
              </button>
            </div>
            <form
              className="modal-form"
              onSubmit={(event) => {
                event.preventDefault();
                submitPuzzlePassword();
              }}
            >
              <label className="field-label" htmlFor="puzzle-access-password">
                Passwort
              </label>
              <input
                id="puzzle-access-password"
                className="text-input"
                type="password"
                value={puzzlePasswordValue}
                onChange={(event) => setPuzzlePasswordValue(event.target.value)}
                autoFocus
              />
              {puzzlePasswordError ? <p className="inline-error">{puzzlePasswordError}</p> : null}
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={closePuzzlePrompt}>
                  Abbrechen
                </button>
                <button type="submit">Öffnen</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
