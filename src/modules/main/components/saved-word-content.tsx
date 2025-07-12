import React from 'react';

import { AdjectiveContent } from '@/modules/words-generation/components/word-content/adjective-content';
import { DemonstrativePronounContent } from '@/modules/words-generation/components/word-content/demonstrative-pronoun-content';
import { GeneralContent } from '@/modules/words-generation/components/word-content/general-content';
import { NounContent } from '@/modules/words-generation/components/word-content/noun-content';
import { PersonalPronounContent } from '@/modules/words-generation/components/word-content/personal-pronoun-content';
import { VerbContent } from '@/modules/words-generation/components/word-content/verb-content';
import { PartOfSpeech } from '@/modules/words-generation/words-generation.const';
import type {
  TranslationAdjectiveResult,
  TranslationDemonstrativePronounResult,
  TranslationNounResult,
  TranslationPronounResult,
  TranslationResult,
  TranslationVerbResult,
} from '@/modules/words-generation/words-generation.types';

interface SavedWordContentProps {
  translation: TranslationResult;
}

export const SavedWordContent: React.FC<SavedWordContentProps> = ({
  translation,
}) => {
  const partOfSpeech = translation.partOfSpeech || [];

  if (partOfSpeech.includes(PartOfSpeech.NOUN)) {
    return <NounContent translation={translation as TranslationNounResult} />;
  }

  if (partOfSpeech.includes(PartOfSpeech.VERB)) {
    return <VerbContent translation={translation as TranslationVerbResult} />;
  }

  if (partOfSpeech.includes(PartOfSpeech.ADJECTIVE)) {
    return (
      <AdjectiveContent
        translation={translation as TranslationAdjectiveResult}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.PERSONAL_PRONOUN)) {
    return (
      <PersonalPronounContent
        translation={translation as TranslationPronounResult}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.DEMONSTRATIVE_PRONOUN)) {
    return (
      <DemonstrativePronounContent
        translation={translation as TranslationDemonstrativePronounResult}
      />
    );
  }

  return <GeneralContent translation={translation} />;
};
