import {
  collectionsTable,
  collectionVocabularyItemsTable,
} from '@/modules/collection/collections.schema';
import { userWordProgressTable } from '@/modules/flashcards/flashcards.schema';
import { userSettingsTable } from '@/modules/user-settings/user-settings.schema';
import {
  vocabularyCacheView,
  vocabularyItemsTable,
} from '@/modules/vocabulary/vocabulary.schema';

import { languageCodeEnum, partOfSpeechEnum } from '../shared';

export {
  collectionsTable,
  collectionVocabularyItemsTable,
  languageCodeEnum,
  partOfSpeechEnum,
  userSettingsTable,
  userWordProgressTable,
  vocabularyCacheView,
  vocabularyItemsTable,
};
