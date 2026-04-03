import MazeGame from '../../App';

interface MazeGameWrapperProps {
  onBackHome: () => void;
}

export function MazeGameWrapper({ onBackHome }: MazeGameWrapperProps) {
  return (
    <div className="launcher-game-shell">
      <div className="launcher-topbar">
        <button type="button" className="secondary-button" onClick={onBackHome}>
          Back to Home
        </button>
      </div>
      <MazeGame />
    </div>
  );
}
