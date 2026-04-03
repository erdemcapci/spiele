import { PUZZLE_CONFIG } from '../../config/puzzleConfig';

interface CompletionModalProps {
  codeError: string;
  codeSolved: boolean;
  codeValues: Record<string, string>;
  message: string;
  onClose: () => void;
  onCodeChange: (id: string, value: string) => void;
  onSubmit: () => void;
}

export function CompletionModal({
  codeError,
  codeSolved,
  codeValues,
  message,
  onClose,
  onCodeChange,
  onSubmit,
}: CompletionModalProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="complete-title">
        <div className="modal-head">
          <h2 id="complete-title">{codeSolved ? 'Gewonnen' : 'Farbcode eingeben'}</h2>
          {codeSolved ? (
            <button type="button" className="ghost-button" onClick={onClose}>
              Schließen
            </button>
          ) : null}
        </div>
        {codeSolved ? (
          <p className="puzzle-complete-message">{message || 'Super gemacht!'}</p>
        ) : (
          <>
            <div className="puzzle-code-grid">
              {PUZZLE_CONFIG.finalColorCode.map((entry) => (
                <label key={entry.id} className="puzzle-code-card">
                  <span
                    className="puzzle-code-swatch"
                    style={{ backgroundColor: entry.color }}
                    aria-hidden="true"
                  />
                  <span className="puzzle-code-label">{entry.label}</span>
                  <input
                    className="text-input puzzle-code-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={codeValues[entry.id] ?? ''}
                    onChange={(event) => onCodeChange(entry.id, event.target.value)}
                  />
                </label>
              ))}
            </div>
            {codeError ? <p className="inline-error">{codeError}</p> : null}
            <div className="modal-actions">
              <button type="button" onClick={onSubmit}>
                Prüfen
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
