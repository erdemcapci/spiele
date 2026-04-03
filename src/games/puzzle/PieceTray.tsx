interface PieceTrayProps {
  boardHeight: number;
  trayHeight: number;
}

export function PieceTray({ boardHeight, trayHeight }: PieceTrayProps) {
  return (
    <div
      className="puzzle-tray"
      style={{
        top: `${boardHeight + 20}px`,
        height: `${Math.max(0, trayHeight - 20)}px`,
      }}
      aria-hidden="true"
    />
  );
}
