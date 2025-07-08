import React from 'react';

import { AdjectiveContent } from '@/modules/words/components/word-content/adjective-content';
import { DemonstrativePronounContent } from '@/modules/words/components/word-content/demonstrative-pronoun-content';
import { GeneralContent } from '@/modules/words/components/word-content/general-content';
import { NounContent } from '@/modules/words/components/word-content/noun-content';
import { PersonalPronounContent } from '@/modules/words/components/word-content/personal-pronoun-content';
import { VerbContent } from '@/modules/words/components/word-content/verb-content';
import { PartOfSpeech } from '@/modules/words/words.const';
import type {
  TranslationAdjectiveResult,
  TranslationDemonstrativePronounResult,
  TranslationNounResult,
  TranslationPronounResult,
  TranslationResult,
  TranslationVerbResult,
} from '@/modules/words/words.types';

interface GenerateWordLoadedProps {
  translation: TranslationResult;
  onRegenerate?: () => void;
}

export const GenerateWordLoaded: React.FC<GenerateWordLoadedProps> = ({
  translation,
  onRegenerate,
}) => {
  // Determine which component to render based on partOfSpeech
  const partOfSpeech = translation.partOfSpeech || [];

  if (partOfSpeech.includes(PartOfSpeech.NOUN)) {
    return (
      <NounContent
        translation={translation as TranslationNounResult}
        onRegenerate={onRegenerate}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.VERB)) {
    return (
      <VerbContent
        translation={translation as TranslationVerbResult}
        onRegenerate={onRegenerate}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.ADJECTIVE)) {
    return (
      <AdjectiveContent
        translation={translation as TranslationAdjectiveResult}
        onRegenerate={onRegenerate}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.PERSONAL_PRONOUN)) {
    return (
      <PersonalPronounContent
        translation={translation as TranslationPronounResult}
        onRegenerate={onRegenerate}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.DEMONSTRATIVE_PRONOUN)) {
    return (
      <DemonstrativePronounContent
        translation={translation as TranslationDemonstrativePronounResult}
        onRegenerate={onRegenerate}
      />
    );
  }

  // For all other parts of speech (adverb, etc.)
  return (
    <GeneralContent translation={translation} onRegenerate={onRegenerate} />
  );
};
