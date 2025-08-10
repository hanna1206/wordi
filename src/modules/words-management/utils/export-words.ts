import type { WordWithProgress } from '../words-management.types';

export interface ExportOptions {
  format: 'csv' | 'json' | 'anki';
  includeProgress?: boolean;
  selectedOnly?: boolean;
}

// Convert words to CSV format
export const exportToCSV = (
  words: WordWithProgress[],
  includeProgress = false,
): string => {
  const headers = [
    'Word',
    'Part of Speech',
    'Main Translation',
    'Additional Translations',
    'Example Sentences',
    'Synonyms',
    'Collocations',
    'Created At',
    ...(includeProgress
      ? [
          'Status',
          'Success Rate (%)',
          'Total Reviews',
          'Correct Reviews',
          'Easiness Factor',
          'Next Review Date',
          'Is Archived',
        ]
      : []),
  ];

  const rows = words.map((word) => [
    word.normalizedWord,
    word.partOfSpeech,
    word.mainTranslation,
    word.additionalTranslations.join('; '),
    word.exampleSentences.join('; '),
    word.synonyms.join('; '),
    word.collocations
      .map((c) => `${c.collocation}: ${c.translation}`)
      .join('; '),
    new Date(word.createdAt).toLocaleDateString(),
    ...(includeProgress
      ? [
          word.status,
          word.successRate.toFixed(1),
          word.totalReviews.toString(),
          word.correctReviews.toString(),
          word.easinessFactor.toFixed(2),
          word.nextReviewDate
            ? new Date(word.nextReviewDate).toLocaleDateString()
            : '',
          word.isArchived ? 'Yes' : 'No',
        ]
      : []),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((field) => `"${field.toString().replace(/"/g, '""')}"`).join(','),
    )
    .join('\n');

  return csvContent;
};

// Convert words to JSON format
export const exportToJSON = (
  words: WordWithProgress[],
  includeProgress = false,
): string => {
  const exportData = words.map((word) => {
    const baseData = {
      word: word.normalizedWord,
      partOfSpeech: word.partOfSpeech,
      mainTranslation: word.mainTranslation,
      additionalTranslations: word.additionalTranslations,
      exampleSentences: word.exampleSentences,
      synonyms: word.synonyms,
      collocations: word.collocations,
      createdAt: word.createdAt,
      targetLanguage: word.targetLanguage,
    };

    if (includeProgress) {
      return {
        ...baseData,
        progress: {
          status: word.status,
          successRate: word.successRate,
          totalReviews: word.totalReviews,
          correctReviews: word.correctReviews,
          easinessFactor: word.easinessFactor,
          intervalDays: word.intervalDays,
          repetitionCount: word.repetitionCount,
          nextReviewDate: word.nextReviewDate,
          lastReviewedAt: word.lastReviewedAt,
          isArchived: word.isArchived,
        },
      };
    }

    return baseData;
  });

  return JSON.stringify(exportData, null, 2);
};

// Convert words to Anki deck format (tab-separated values)
export const exportToAnki = (words: WordWithProgress[]): string => {
  const ankiCards = words.map((word) => {
    const front = word.normalizedWord;
    const back = [
      `<strong>${word.mainTranslation}</strong>`,
      word.additionalTranslations.length > 0
        ? `<br><em>Also:</em> ${word.additionalTranslations.join(', ')}`
        : '',
      word.exampleSentences.length > 0
        ? `<br><br><strong>Examples:</strong><br>${word.exampleSentences.map((s) => `• ${s}`).join('<br>')}`
        : '',
      word.synonyms.length > 0
        ? `<br><br><strong>Synonyms:</strong> ${word.synonyms.join(', ')}`
        : '',
      word.collocations.length > 0
        ? `<br><br><strong>Collocations:</strong><br>${word.collocations.map((c) => `• ${c.collocation} - ${c.translation}`).join('<br>')}`
        : '',
    ]
      .filter(Boolean)
      .join('');

    const tags = [
      word.partOfSpeech,
      word.status,
      word.targetLanguage || 'unknown-language',
    ]
      .filter(Boolean)
      .join(' ');

    return `${front}\t${back}\t${tags}`;
  });

  return ankiCards.join('\n');
};

// Download file helper
export const downloadFile = (
  content: string,
  filename: string,
  mimeType: string,
): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

// Main export function
export const exportWords = (
  words: WordWithProgress[],
  options: ExportOptions,
): void => {
  const timestamp = new Date().toISOString().split('T')[0];
  const wordCount = words.length;
  const baseFilename = `wordi-words-${timestamp}-${wordCount}`;

  let content: string;
  let filename: string;
  let mimeType: string;

  switch (options.format) {
    case 'csv':
      content = exportToCSV(words, options.includeProgress);
      filename = `${baseFilename}.csv`;
      mimeType = 'text/csv;charset=utf-8;';
      break;

    case 'json':
      content = exportToJSON(words, options.includeProgress);
      filename = `${baseFilename}.json`;
      mimeType = 'application/json;charset=utf-8;';
      break;

    case 'anki':
      content = exportToAnki(words);
      filename = `${baseFilename}-anki.txt`;
      mimeType = 'text/plain;charset=utf-8;';
      break;

    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }

  downloadFile(content, filename, mimeType);
};
