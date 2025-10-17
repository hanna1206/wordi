import { LinguisticItem } from '@/modules/linguistics/linguistics.types';
import { LanguageCode } from '@/modules/user-settings/user-settings.const';

import type {
  CommonWordData,
  VocabularyItemDatabaseInput,
} from '../vocabulary.types';

export const transformLinguisticItemToVocabularyItem = (
  linguisticItem: LinguisticItem,
  userId: string,
  targetLanguage: LanguageCode,
) => {
  const commonData: CommonWordData = {
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
    normalizedWord: linguisticItem.normalizedWord,
    partOfSpeech: linguisticItem.partOfSpeech[0] || 'other',
    commonData,
    partSpecificData: specificData,
    targetLanguage,
  };

  return vocabularyItem;
};
