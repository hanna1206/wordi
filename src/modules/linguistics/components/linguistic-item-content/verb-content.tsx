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
  linguisticItem: VerbLinguisticItem;
  onRegenerate?: () => void;
}

export const VerbContent: React.FC<VerbContentProps> = ({
  linguisticItem,
  onRegenerate,
}) => {
  const prepositions = linguisticItem.prepositions || [];
  const conjugationAsArray = linguisticItem.conjugation.split(', ');
  const conjugationText =
    linguisticItem.regular === 'regular'
      ? conjugationAsArray[conjugationAsArray.length - 1]
      : conjugationAsArray.join(', ');

  return (
    <CardLayout>
      <LinguisticItemHeader
        normalizedWord={linguisticItem.normalizedWord}
        mainTranslation={linguisticItem.mainTranslation}
        partOfSpeech={linguisticItem.partOfSpeech}
        regularOrIrregularVerb={linguisticItem.regular}
        isReflexiveVerb={linguisticItem.isReflexive}
        separablePrefix={linguisticItem.separablePrefix}
        onRegenerate={onRegenerate}
      />

      {/* Conjugation */}
      <Text fontSize="md" color="gray.700">
        {conjugationText}
      </Text>

      <CardDivider />

      {linguisticItem.sichUsage && (
        <TranslationSection
          icon={LuBinary}
          title="Sich usage"
          items={[
            {
              rule: 'With sich',
              explanation: linguisticItem.sichUsage.withSich,
            },
            {
              rule: 'Without sich',
              explanation: linguisticItem.sichUsage.withoutSich,
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
        items={linguisticItem.additionalTranslations}
        renderMode="list"
      />

      <TranslationSection
        icon={LuQuote}
        title="Usage examples"
        items={linguisticItem.exampleSentences}
        renderMode="quotes"
      />

      <TranslationSection
        icon={LuReplace}
        title="Synonyms"
        items={linguisticItem.synonyms}
        renderMode="tags"
      />

      <TranslationSection
        icon={LuLink2}
        title="Collocations"
        items={linguisticItem.collocations}
        renderMode="table"
      />
    </CardLayout>
  );
};
