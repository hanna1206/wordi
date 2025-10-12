import React from 'react';

import { AdjectiveContent } from '@/modules/linguistics/components/linguistic-item-content/adjective-content';
import { DemonstrativePronounContent } from '@/modules/linguistics/components/linguistic-item-content/demonstrative-pronoun-content';
import { GeneralContent } from '@/modules/linguistics/components/linguistic-item-content/general-content';
import { NounContent } from '@/modules/linguistics/components/linguistic-item-content/noun-content';
import { PersonalPronounContent } from '@/modules/linguistics/components/linguistic-item-content/personal-pronoun-content';
import { VerbContent } from '@/modules/linguistics/components/linguistic-item-content/verb-content';
import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import type {
  AdjectiveLinguisticItem,
  DemonstrativePronounLinguisticItem,
  LinguisticItem,
  NounLinguisticItem,
  PronounLinguisticItem,
  VerbLinguisticItem,
} from '@/modules/linguistics/linguistics.types';

interface GenerateLinguisticItemLoadedProps {
  linguisticItem: LinguisticItem;
  onRegenerate?: () => void;
}

export const GenerateLinguisticItemLoaded: React.FC<
  GenerateLinguisticItemLoadedProps
> = ({ linguisticItem, onRegenerate }) => {
  // Determine which component to render based on partOfSpeech
  const partOfSpeech = linguisticItem.partOfSpeech || [];

  if (partOfSpeech.includes(PartOfSpeech.NOUN)) {
    return (
      <NounContent
        linguisticItem={linguisticItem as NounLinguisticItem}
        onRegenerate={onRegenerate}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.VERB)) {
    return (
      <VerbContent
        linguisticItem={linguisticItem as VerbLinguisticItem}
        onRegenerate={onRegenerate}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.ADJECTIVE)) {
    return (
      <AdjectiveContent
        linguisticItem={linguisticItem as AdjectiveLinguisticItem}
        onRegenerate={onRegenerate}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.PERSONAL_PRONOUN)) {
    return (
      <PersonalPronounContent
        linguisticItem={linguisticItem as PronounLinguisticItem}
        onRegenerate={onRegenerate}
      />
    );
  }

  if (partOfSpeech.includes(PartOfSpeech.DEMONSTRATIVE_PRONOUN)) {
    return (
      <DemonstrativePronounContent
        linguisticItem={linguisticItem as DemonstrativePronounLinguisticItem}
        onRegenerate={onRegenerate}
      />
    );
  }

  // For all other parts of speech (adverb, etc.)
  return (
    <GeneralContent
      linguisticItem={linguisticItem}
      onRegenerate={onRegenerate}
    />
  );
};
