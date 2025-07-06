import React from 'react';

import { AdjectiveContent } from '@/modules/words/components/word-content/adjective-content';
import { GeneralContent } from '@/modules/words/components/word-content/general-content';
import { NounContent } from '@/modules/words/components/word-content/noun-content';
import { PronounContent } from '@/modules/words/components/word-content/pronoun-content';
import { VerbContent } from '@/modules/words/components/word-content/verb-content';
import { PartOfSpeech } from '@/modules/words/words.const';
import type {
  TranslationAdjectiveResult,
  TranslationNounResult,
  TranslationPronounResult,
  TranslationResult,
  TranslationVerbResult,
} from '@/modules/words/words.types';

interface GenerateWordLoadedProps {
  translation: TranslationResult;
}

export const GenerateWordLoaded: React.FC<GenerateWordLoadedProps> = ({
  translation,
}) => {
  // Determine which component to render based on partOfSpeech
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
      <PronounContent translation={translation as TranslationPronounResult} />
    );
  }

  // For all other parts of speech (adverb, etc.)
  return <GeneralContent translation={translation} />;
};
