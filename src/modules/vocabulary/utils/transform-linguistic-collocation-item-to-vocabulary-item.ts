import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import { LinguisticCollocationItem } from '@/modules/linguistics/linguistics.types';
import { LanguageCode } from '@/modules/user-settings/user-settings.const';

import type {
  CommonVocabularyData,
  VocabularyItemDatabaseInput,
} from '../vocabulary.types';
import { extractSortableText } from './extract-sortable-text';

export const transformLinguisticCollocationItemToVocabularyItem = (
  linguisticItem: LinguisticCollocationItem,
  userId: string,
  targetLanguage: LanguageCode,
): VocabularyItemDatabaseInput => {
  const commonData: CommonVocabularyData = {
    mainTranslation: linguisticItem.mainTranslation,
    additionalTranslations: [],
    exampleSentences: linguisticItem.exampleSentences.map(
      (ex) => `${ex.german} - ${ex.translation}`,
    ),
    synonyms: [],
    collocations: [],
  };

  const specificData = {
    componentWords: linguisticItem.componentWords,
  };

  return {
    userId,
    type: 'collocation',
    normalizedText: linguisticItem.normalizedCollocation,
    sortableText: extractSortableText(linguisticItem.normalizedCollocation),
    partOfSpeech: PartOfSpeech.OTHER,
    commonData,
    specificData: specificData,
    targetLanguage,
  };
};
