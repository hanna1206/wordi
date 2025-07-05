import React from 'react';

import { GeneralCardContent } from '@/modules/words/components/word-content/general-content';
import { NounCardContent } from '@/modules/words/components/word-content/noun-content';
import { VerbCardContent } from '@/modules/words/components/word-content/verb-content';
import type {
  TranslationNounResult,
  TranslationResult,
  TranslationVerbResult,
} from '@/modules/words/words.types';

interface TranslationContentProps {
  translation: TranslationResult;
}

export const TranslationContent: React.FC<TranslationContentProps> = ({
  translation,
}) => {
  // Determine which component to render based on partOfSpeech
  const partOfSpeech = translation.partOfSpeech || [];

  if (partOfSpeech.includes('noun')) {
    return (
      <NounCardContent translation={translation as TranslationNounResult} />
    );
  }

  if (partOfSpeech.includes('verb')) {
    return (
      <VerbCardContent translation={translation as TranslationVerbResult} />
    );
  }

  // For all other parts of speech (adjective, adverb, etc.)
  return <GeneralCardContent translation={translation} />;
};
