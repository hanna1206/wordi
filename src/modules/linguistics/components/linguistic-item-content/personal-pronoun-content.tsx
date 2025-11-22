import React from 'react';
import { LuLayers, LuLink2, LuQuote, LuReplace, LuTable } from 'react-icons/lu';

import { Text } from '@chakra-ui/react';

import type { PronounLinguisticItem } from '@/modules/linguistics/linguistics.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { LinguisticItemHeader } from './common/linguistic-item-header';
import { TranslationSection } from './common/translation-section';

interface PersonalPronounContentProps {
  linguisticWordItem: PronounLinguisticItem;
  onRegenerate?: () => void;
}

export const PersonalPronounContent: React.FC<PersonalPronounContentProps> = ({
  linguisticWordItem,
  onRegenerate,
}) => {
  const hasDeclensions =
    linguisticWordItem.declensions && linguisticWordItem.declensions.length > 0;

  return (
    <CardLayout>
      <LinguisticItemHeader
        normalizedWord={linguisticWordItem.normalizedWord}
        mainTranslation={linguisticWordItem.mainTranslation}
        partOfSpeech={linguisticWordItem.partOfSpeech}
        onRegenerate={onRegenerate}
      />

      {/* Pronoun Type */}
      <Text fontSize="md" color="gray.700">
        {linguisticWordItem.pronounType}
      </Text>

      <CardDivider />

      {/* Case Declensions */}
      {hasDeclensions && (
        <TranslationSection
          icon={LuTable}
          title="Case Declensions"
          items={linguisticWordItem.declensions}
          renderMode="table"
        />
      )}

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
