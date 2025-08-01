export enum GameMode {
  Latest = 'latest',
  Random = 'random',
}

export enum CardSide {
  Word = 'word',
  Translation = 'translation',
}

export enum QualityScore {
  Hard = 0, // Forgot or very difficult - decrease easiness
  Good = 1, // Remembered with effort - maintain interval
  Easy = 2, // Remembered easily - increase interval
}

export const QUALITY_OPTIONS = [
  {
    score: QualityScore.Hard,
    label: 'Hard',
    emoji: '😕',
    description: 'Forgot or very difficult',
    colorScheme: 'red',
  },
  {
    score: QualityScore.Good,
    label: 'Good',
    emoji: '🙂',
    description: 'Remembered with effort',
    colorScheme: 'yellow',
  },
  {
    score: QualityScore.Easy,
    label: 'Easy',
    emoji: '😎',
    description: 'Remembered easily',
    colorScheme: 'green',
  },
] as const;
