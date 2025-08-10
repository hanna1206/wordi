// Status configuration
export const WORD_STATUS_CONFIG = {
  new: {
    label: 'New',
    color: 'blue',
    description: 'Recently added words',
  },
  learning: {
    label: 'Learning',
    color: 'orange',
    description: 'Words in active learning phase',
  },
  review: {
    label: 'Review',
    color: 'yellow',
    description: 'Words scheduled for periodic review',
  },
  graduated: {
    label: 'Graduated',
    color: 'green',
    description: 'Well-learned words',
  },
  lapsed: {
    label: 'Lapsed',
    color: 'red',
    description: 'Words that need more practice',
  },
} as const;

// Part of speech labels
export const PART_OF_SPEECH_LABELS = {
  noun: 'Noun',
  verb: 'Verb',
  adjective: 'Adjective',
  adverb: 'Adverb',
  pronoun: 'Pronoun',
  preposition: 'Preposition',
  conjunction: 'Conjunction',
  interjection: 'Interjection',
  article: 'Article',
} as const;

// Table column configuration
export const DEFAULT_COLUMN_WIDTHS = {
  word: 200,
  partOfSpeech: 120,
  mainTranslation: 200,
  status: 120,
  successRate: 120,
  nextReviewDate: 150,
  actions: 100,
} as const;

// Filter presets
export const FILTER_PRESETS = {
  dueToday: {
    name: 'Due Today',
    filters: {
      overdue: true,
      isArchived: false,
    },
  },
  newWords: {
    name: 'New Words',
    filters: {
      status: ['new' as const],
      isArchived: false,
    },
  },
  struggling: {
    name: 'Needs Practice',
    filters: {
      status: ['lapsed' as const],
      isArchived: false,
    },
  },
  archived: {
    name: 'Archived',
    filters: {
      isArchived: true,
    },
  },
} as const;
