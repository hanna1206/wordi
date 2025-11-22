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
import { isLinguisticCollocationItem } from '@/modules/linguistics/utils/is-linguistic-collocation-item';

interface GenerateLinguisticItemLoadedProps {
  linguisticItem: LinguisticWordItem | LinguisticCollocationItem;
  onRegenerate?: () => void;
}

export const GenerateLinguisticItemLoaded: React.FC<
  GenerateLinguisticItemLoadedProps
> = ({ linguisticItem, onRegenerate }) => {
  if (isLinguisticCollocationItem(linguisticItem)) {
    return (
      <CollocationContent
        linguisticCollocationItem={linguisticItem}
        onRegenerate={onRegenerate}
      />
    );
  }

  const partOfSpeech = linguisticItem.partOfSpeech || [];

  if (partOfSpeech.includes(PartOfSpeech.NOUN)) {
    return (
      <NounContent
        linguisticWordItem={linguisticItem as NounLinguisticItem}
        onRegenerate={onRegenerate}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.VERB)) {
    return (
      <VerbContent
        linguisticWordItem={linguisticItem as VerbLinguisticItem}
        onRegenerate={onRegenerate}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.ADJECTIVE)) {
    return (
      <AdjectiveContent
        linguisticWordItem={linguisticItem as AdjectiveLinguisticItem}
        onRegenerate={onRegenerate}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.PERSONAL_PRONOUN)) {
    return (
      <PersonalPronounContent
        linguisticWordItem={linguisticItem as PronounLinguisticItem}
        onRegenerate={onRegenerate}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.DEMONSTRATIVE_PRONOUN)) {
    return (
      <DemonstrativePronounContent
        linguisticWordItem={
          linguisticItem as DemonstrativePronounLinguisticItem
        }
        onRegenerate={onRegenerate}
      />
    );
  }

  // For all other parts of speech (adverb, etc.)
  return (
    <GeneralWordContent
      linguisticWordItem={linguisticItem}
      onRegenerate={onRegenerate}
    />
  );
};
