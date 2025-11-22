import React from 'react';
import {
  LuBinary,
  LuLayers,
  LuLink2,
  LuQuote,
  LuReplace,
} from 'react-icons/lu';

import { Text } from '@chakra-ui/react';

import type { VerbLinguisticItem } from '@/modules/linguistics/linguistics.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { LinguisticItemHeader } from './common/linguistic-item-header';
import { TranslationSection } from './common/translation-section';

interface VerbContentProps {
  linguisticWordItem: VerbLinguisticItem;
  onRegenerate?: () => void;
}

export const VerbContent: React.FC<VerbContentProps> = ({
  linguisticWordItem,
  onRegenerate,
}) => {
  const prepositions = linguisticWordItem.prepositions || [];
  const conjugationAsArray = linguisticWordItem.conjugation.split(', ');
  const conjugationText =
    linguisticWordItem.regular === 'regular'
      ? conjugationAsArray[conjugationAsArray.length - 1]
      : conjugationAsArray.join(', ');

  return (
    <CardLayout>
      <LinguisticItemHeader
        normalizedWord={linguisticWordItem.normalizedWord}
        mainTranslation={linguisticWordItem.mainTranslation}
        partOfSpeech={linguisticWordItem.partOfSpeech}
        regularOrIrregularVerb={linguisticWordItem.regular}
        isReflexiveVerb={linguisticWordItem.isReflexive}
        separablePrefix={linguisticWordItem.separablePrefix}
        onRegenerate={onRegenerate}
      />

      {/* Conjugation */}
      <Text fontSize="md" color="gray.700">
        {conjugationText}
      </Text>

      <CardDivider />

      {linguisticWordItem.sichUsage && (
        <TranslationSection
          icon={LuBinary}
          title="Sich usage"
          items={[
            {
              rule: 'With sich',
              explanation: linguisticWordItem.sichUsage.withSich,
            },
            {
              rule: 'Without sich',
              explanation: linguisticWordItem.sichUsage.withoutSich,
            },
          ]}
          renderMode="table"
        />
      )}

      <TranslationSection
        icon={LuBinary}
        title="Prepositions"
        items={prepositions}
        renderMode="table"
        show={prepositions.length > 0}
      />

      <TranslationSection
        icon={LuLayers}
        title="Also means"
        items={linguisticWordItem.additionalTranslations}
        renderMode="list"
      />

      <TranslationSection
        icon={LuQuote}
        title="Usage examples"
        items={linguisticWordItem.exampleSentences}
        renderMode="quotes"
      />

      <TranslationSection
        icon={LuReplace}
        title="Synonyms"
        items={linguisticWordItem.synonyms}
        renderMode="tags"
      />

      <TranslationSection
        icon={LuLink2}
        title="Collocations"
        items={linguisticWordItem.collocations}
        renderMode="table"
      />
    </CardLayout>
  );
};
