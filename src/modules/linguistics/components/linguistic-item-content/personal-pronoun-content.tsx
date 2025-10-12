import React from 'react';
import { LuLayers, LuLink2, LuQuote, LuReplace, LuTable } from 'react-icons/lu';

import { Text } from '@chakra-ui/react';

import type { PronounLinguisticItem } from '@/modules/linguistics/linguistics.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { LinguisticItemHeader } from './common/linguistic-item-header';
import { TranslationSection } from './common/translation-section';

interface PersonalPronounContentProps {
  linguisticItem: PronounLinguisticItem;
  onRegenerate?: () => void;
}

export const PersonalPronounContent: React.FC<PersonalPronounContentProps> = ({
  linguisticItem,
  onRegenerate,
}) => {
  const hasDeclensions =
    linguisticItem.declensions && linguisticItem.declensions.length > 0;

  return (
    <CardLayout>
      <LinguisticItemHeader
        normalizedWord={linguisticItem.normalizedWord}
        mainTranslation={linguisticItem.mainTranslation}
        partOfSpeech={linguisticItem.partOfSpeech}
        onRegenerate={onRegenerate}
      />

      {/* Pronoun Type */}
      <Text fontSize="md" color="gray.700">
        {linguisticItem.pronounType}
      </Text>

      <CardDivider />

      {/* Case Declensions */}
      {hasDeclensions && (
        <TranslationSection
          icon={LuTable}
          title="Case Declensions"
          items={linguisticItem.declensions}
          renderMode="table"
        />
      )}

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
