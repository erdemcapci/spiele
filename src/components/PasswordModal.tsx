import { FormEvent, useEffect, useState } from 'react';

import type { Role } from '../types/game';

interface PasswordModalProps {
  role: Role | null;
  errorMessage: string;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

const ROLE_TITLES: Record<Role, string> = {
  observer: 'Beobachter-Panel',
  player: 'Spieler-Panel',
};

export function PasswordModal({
  role,
  errorMessage,
  onClose,
  onSubmit,
}: PasswordModalProps) {
  const [password, setPassword] = useState('');

  useEffect(() => {
    setPassword('');
  }, [role]);

  if (!role) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(password);
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-modal-title"
      >
        <div className="modal-head">
          <div>
            <p className="eyebrow">Geschützter Bereich</p>
            <h2 id="password-modal-title">{ROLE_TITLES[role]} öffnen</h2>
          </div>
          <button type="button" className="ghost-button" onClick={onClose}>
            Schließen
          </button>
        </div>

        <p className="modal-copy">
          Bitte gib das passende Passwort ein. Ohne korrektes Passwort bleibt das
          Panel gesperrt.
        </p>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="role-password">
            Passwort
          </label>
          <input
            id="role-password"
            className="text-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
            placeholder="Passwort eingeben"
          />

          {errorMessage ? <p className="inline-error">{errorMessage}</p> : null}

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Abbrechen
            </button>
            <button type="submit">Panel öffnen</button>
          </div>
        </form>
      </div>
    </div>
  );
}
