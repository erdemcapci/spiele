import { useEffect, useState } from 'react';

import { HomeScreen } from './components/HomeScreen';
import { ObserverPanel } from './components/ObserverPanel';
import { PasswordModal } from './components/PasswordModal';
import { PlayerPanel } from './components/PlayerPanel';
import { VictoryScreen } from './components/VictoryScreen';
import { GAME_CONFIG } from './config/gameConfig';
import { getMazeById } from './data/mazes';
import type {
  AppAccessState,
  MoveDirection,
  ObserverState,
  PlayerGameState,
  Role,
} from './types/game';
import {
  createInitialObserverState,
  createInitialPlayerState,
  getStepTarget,
  isGoalReached,
  isWalkable,
} from './utils/maze';
import { loadStoredState, saveStoredState } from './utils/storage';

const activeMaze = getMazeById(GAME_CONFIG.defaultMazeId);

const INITIAL_ACCESS_STATE: AppAccessState = {
  screen: 'home',
  activeRole: null,
  passwordModalFor: null,
  passwordError: '',
};

function normalizePlayerState(state: PlayerGameState): PlayerGameState {
  const fallback = createInitialPlayerState(activeMaze);

  return {
    ...fallback,
    ...state,
    position: state.position ?? fallback.position,
    visitedPath:
      Array.isArray(state.visitedPath) && state.visitedPath.length > 0
        ? state.visitedPath
        : [state.position ?? fallback.position],
  };
}

function normalizeObserverState(state: ObserverState): ObserverState {
  const fallback = createInitialObserverState(activeMaze);

  return {
    ...fallback,
    ...state,
    trackedPosition: state.trackedPosition ?? fallback.trackedPosition,
  };
}

export default function App() {
  const [accessState, setAccessState] = useState<AppAccessState>(INITIAL_ACCESS_STATE);
  const [adminLifeModalOpen, setAdminLifeModalOpen] = useState(false);
  const [adminLifePassword, setAdminLifePassword] = useState('');
  const [adminLifeError, setAdminLifeError] = useState('');
  const [playerState, setPlayerState] = useState<PlayerGameState>(() =>
    normalizePlayerState(
      loadStoredState(GAME_CONFIG.storageKeys.player, createInitialPlayerState(activeMaze)),
    ),
  );
  const [observerState, setObserverState] = useState<ObserverState>(() =>
    normalizeObserverState(
      loadStoredState(GAME_CONFIG.storageKeys.observer, createInitialObserverState(activeMaze)),
    ),
  );

  useEffect(() => {
    saveStoredState(GAME_CONFIG.storageKeys.player, playerState);
  }, [playerState]);

  useEffect(() => {
    saveStoredState(GAME_CONFIG.storageKeys.observer, observerState);
  }, [observerState]);

  useEffect(() => {
    if (playerState.finished && accessState.screen === 'player') {
      setAccessState((current) => ({
        ...current,
        screen: 'victory',
        activeRole: 'player',
      }));
    }
  }, [playerState.finished, accessState.screen]);

  function openPasswordModal(role: Role) {
    setAccessState((current) => ({
      ...current,
      passwordModalFor: role,
      passwordError: '',
    }));
  }

  function closePasswordModal() {
    setAccessState((current) => ({
      ...current,
      passwordModalFor: null,
      passwordError: '',
    }));
  }

  function openRolePanel(role: Role) {
    setAccessState({
      screen: role === 'player' && playerState.finished ? 'victory' : role,
      activeRole: role,
      passwordModalFor: null,
      passwordError: '',
    });
  }

  function verifyPassword(password: string) {
    const requestedRole = accessState.passwordModalFor;

    if (!requestedRole) {
      return;
    }

    if (password === GAME_CONFIG.rolePasswords[requestedRole]) {
      openRolePanel(requestedRole);
      return;
    }

    setAccessState((current) => ({
      ...current,
      passwordError: 'Das Passwort stimmt nicht. Bitte versuche es noch einmal.',
    }));
  }

  function goHome() {
    setAccessState(INITIAL_ACCESS_STATE);
  }

  function resetPlayerGame() {
    setPlayerState(createInitialPlayerState(activeMaze));
    setAccessState((current) => ({
      ...current,
      screen: current.activeRole === 'player' ? 'player' : current.screen,
    }));
  }

  function resetObserverTracking() {
    setObserverState(createInitialObserverState(activeMaze));
  }

  function openAdminLifeModal() {
    setAdminLifePassword('');
    setAdminLifeError('');
    setAdminLifeModalOpen(true);
  }

  function closeAdminLifeModal() {
    setAdminLifePassword('');
    setAdminLifeError('');
    setAdminLifeModalOpen(false);
  }

  function confirmAdminLifeIncrease() {
    if (adminLifePassword !== GAME_CONFIG.adminPassword) {
      setAdminLifeError('Das Passwort stimmt nicht.');
      return;
    }

    setPlayerState((current) => ({
      ...current,
      lives: current.lives + 1,
      statusMessage: `Admin: 1 Leben hinzugefügt. Jetzt ${current.lives + 1} Leben.`,
    }));
    closeAdminLifeModal();
  }

  function movePlayer(direction: MoveDirection) {
    setPlayerState((current) => {
      if (current.finished) {
        return current;
      }

      const nextPosition = getStepTarget(current.position, direction);

      if (!isWalkable(activeMaze, nextPosition)) {
        const nextLives = current.lives - 1;

        if (nextLives <= 0) {
          return {
            ...createInitialPlayerState(activeMaze),
            bumps: current.bumps + 1,
            statusMessage: 'Alle 3 Leben sind weg. Du startest wieder am Anfang.',
          };
        }

        return {
          ...current,
          bumps: current.bumps + 1,
          lives: nextLives,
          statusMessage: `Stopp. Dort ist eine Wand. Noch ${nextLives} Leben übrig.`,
        };
      }

      const finished = isGoalReached(activeMaze, nextPosition);

      return {
        ...current,
        position: nextPosition,
        visitedPath: [...current.visitedPath, nextPosition],
        moves: current.moves + 1,
        finished,
        statusMessage: finished
          ? 'Super, du hast den Ausgang gefunden!'
          : 'Ein Feld weitergegangen.',
      };
    });
  }

  function moveObserverMarker(direction: MoveDirection) {
    setObserverState((current) => {
      const nextPosition = getStepTarget(current.trackedPosition, direction);

      if (!isWalkable(activeMaze, nextPosition)) {
        return {
          ...current,
          statusMessage:
            'Der Marker würde hier gegen eine Wand laufen. Prüfe die Nachverfolgung.',
        };
      }

      return {
        ...current,
        trackedPosition: nextPosition,
        statusMessage: 'Marker verschoben.',
      };
    });
  }

  return (
    <>
      {accessState.screen === 'home' ? (
        <HomeScreen onOpenRole={openPasswordModal} />
      ) : null}

      {accessState.screen === 'observer' ? (
        <ObserverPanel
          maze={activeMaze}
          state={observerState}
          onBackHome={goHome}
          onResetObserver={resetObserverTracking}
          onMoveMarker={moveObserverMarker}
        />
      ) : null}

      {accessState.screen === 'player' ? (
        <PlayerPanel
          state={playerState}
          onBackHome={goHome}
          onResetPlayer={resetPlayerGame}
          onAdminIncreaseLife={openAdminLifeModal}
          onMoveUp={() => movePlayer('up')}
          onMoveRight={() => movePlayer('right')}
          onMoveDown={() => movePlayer('down')}
          onMoveLeft={() => movePlayer('left')}
        />
      ) : null}

      {accessState.screen === 'victory' ? (
        <VictoryScreen
          state={playerState}
          onPlayAgain={resetPlayerGame}
          onBackHome={goHome}
        />
      ) : null}

      <PasswordModal
        role={accessState.passwordModalFor}
        errorMessage={accessState.passwordError}
        onClose={closePasswordModal}
        onSubmit={verifyPassword}
      />

      {adminLifeModalOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-life-modal-title"
          >
            <div className="modal-head">
              <div>
                <h2 id="admin-life-modal-title">Admin +1 Leben</h2>
              </div>
              <button type="button" className="ghost-button" onClick={closeAdminLifeModal}>
                Schließen
              </button>
            </div>

            <form
              className="modal-form"
              onSubmit={(event) => {
                event.preventDefault();
                confirmAdminLifeIncrease();
              }}
            >
              <label className="field-label" htmlFor="admin-life-password">
                Passwort
              </label>
              <input
                id="admin-life-password"
                className="text-input"
                type="password"
                value={adminLifePassword}
                onChange={(event) => setAdminLifePassword(event.target.value)}
                autoFocus
                placeholder="Passwort eingeben"
              />

              {adminLifeError ? <p className="inline-error">{adminLifeError}</p> : null}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeAdminLifeModal}
                >
                  Abbrechen
                </button>
                <button type="submit">+1 Leben</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
