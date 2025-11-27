import React from 'react';

import { AdjectiveContent } from '@/modules/linguistics/components/linguistic-item-content/adjective-content';
import { CollocationContent } from '@/modules/linguistics/components/linguistic-item-content/collocation-content';
import { DemonstrativePronounContent } from '@/modules/linguistics/components/linguistic-item-content/demonstrative-pronoun-content';
import { GeneralWordContent } from '@/modules/linguistics/components/linguistic-item-content/general-content';
import { NounContent } from '@/modules/linguistics/components/linguistic-item-content/noun-content';
import { PersonalPronounContent } from '@/modules/linguistics/components/linguistic-item-content/personal-pronoun-content';
import { VerbContent } from '@/modules/linguistics/components/linguistic-item-content/verb-content';
import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import type {
  AdjectiveLinguisticItem,
  DemonstrativePronounLinguisticItem,
  LinguisticCollocationItem,
  LinguisticWordItem,
  NounLinguisticItem,
  PronounLinguisticItem,
  VerbLinguisticItem,
} from '@/modules/linguistics/linguistics.types';

interface VocabularyItemContentProps {
  linguisticWordItem: LinguisticWordItem | LinguisticCollocationItem;
}

export const VocabularyItemContent: React.FC<VocabularyItemContentProps> = ({
  linguisticWordItem,
}) => {
  // Check if it's a collocation first
  if ('normalizedCollocation' in linguisticWordItem) {
    return (
      <CollocationContent
        linguisticCollocationItem={
          linguisticWordItem as LinguisticCollocationItem
        }
      />
    );
  }

  const partOfSpeech = linguisticWordItem.partOfSpeech || [];

  if (partOfSpeech.includes(PartOfSpeech.NOUN)) {
    return (
      <NounContent
        linguisticWordItem={linguisticWordItem as NounLinguisticItem}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.VERB)) {
    return (
      <VerbContent
        linguisticWordItem={linguisticWordItem as VerbLinguisticItem}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.ADJECTIVE)) {
    return (
      <AdjectiveContent
        linguisticWordItem={linguisticWordItem as AdjectiveLinguisticItem}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.PERSONAL_PRONOUN)) {
    return (
      <PersonalPronounContent
        linguisticWordItem={linguisticWordItem as PronounLinguisticItem}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.DEMONSTRATIVE_PRONOUN)) {
    return (
      <DemonstrativePronounContent
        linguisticWordItem={
          linguisticWordItem as DemonstrativePronounLinguisticItem
        }
      />
    );
  }

  return <GeneralWordContent linguisticWordItem={linguisticWordItem} />;
};
