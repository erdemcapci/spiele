export const PUZZLE_CONFIG = {
  adminPassword: 'mocha',
  defaultPieceCount: 15,
  minPieceCount: 6,
  maxPieceCount: 30,
  playerCount: 3,
  turnDurationSeconds: 60,
  projectImagePath: 'puzzle-images/puzzle-source.png',
  finalColorCode: [
    { id: 'yellow', label: 'Gelb', color: '#f4d03f', password: '4' },
    { id: 'green', label: 'Grün', color: '#5cb85c', password: '5' },
    { id: 'red', label: 'Rot', color: '#d9534f', password: '1' },
    { id: 'blue', label: 'Blau', color: '#428bca', password: '2' },
  ],
} as const;
