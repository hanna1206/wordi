import { LinguisticWordItem } from '@/modules/linguistics/linguistics.types';
import { LanguageCode } from '@/modules/user-settings/user-settings.const';

import type {
  CommonVocabularyData,
  VocabularyItemDatabaseInput,
} from '../vocabulary.types';
import { extractSortableText } from './extract-sortable-text';

export const transformLinguisticWordItemToVocabularyItem = (
  linguisticItem: LinguisticWordItem,
  userId: string,
  targetLanguage: LanguageCode,
) => {
  const commonData: CommonVocabularyData = {
    mainTranslation: linguisticItem.mainTranslation,
    additionalTranslations: linguisticItem.additionalTranslations,
    exampleSentences: linguisticItem.exampleSentences,
    synonyms: linguisticItem.synonyms,
    collocations: linguisticItem.collocations,
  };

  const specificData: Record<string, unknown> = {};
  const commonFields = new Set([
    'normalizedWord',
    'mainTranslation',
    'additionalTranslations',
    'exampleSentences',
    'synonyms',
    'collocations',
    'partOfSpeech',
  ]);

  Object.entries(linguisticItem).forEach(([key, value]) => {
    if (!commonFields.has(key)) {
      specificData[key] = value;
    }
  });

  // Create camelCase object first, then convert to snake_case for database
  const vocabularyItem: VocabularyItemDatabaseInput = {
    userId,
    type: 'word',
    normalizedText: linguisticItem.normalizedWord,
    sortableText: extractSortableText(linguisticItem.normalizedWord),
    partOfSpeech: linguisticItem.partOfSpeech[0] || 'other',
    commonData,
    specificData: specificData,
    targetLanguage,
  };

  return vocabularyItem;
};
