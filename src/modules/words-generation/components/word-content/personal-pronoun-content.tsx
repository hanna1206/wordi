import React from 'react';
import { LuLayers, LuLink2, LuQuote, LuReplace, LuTable } from 'react-icons/lu';

import { Text } from '@chakra-ui/react';

import type { TranslationPronounResult } from '@/modules/words-generation/words-generation.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { TranslationSection } from './common/translation-section';
import { WordHeader } from './common/word-header';

interface PersonalPronounContentProps {
  translation: TranslationPronounResult;
  onRegenerate?: () => void;
}

export const PersonalPronounContent: React.FC<PersonalPronounContentProps> = ({
  translation,
  onRegenerate,
}) => {
  const hasDeclensions =
    translation.declensions && translation.declensions.length > 0;

  return (
    <CardLayout>
      <WordHeader
        normalizedWord={translation.normalizedWord}
        mainTranslation={translation.mainTranslation}
        partOfSpeech={translation.partOfSpeech}
        onRegenerate={onRegenerate}
      />

      {/* Pronoun Type */}
      <Text fontSize="md" color="gray.700" _dark={{ color: 'gray.300' }}>
        {translation.pronounType}
      </Text>

      <CardDivider />

      {/* Case Declensions */}
      {hasDeclensions && (
        <TranslationSection
          icon={LuTable}
          title="Case Declensions"
          items={translation.declensions}
          renderMode="table"
        />
      )}

      <TranslationSection
        icon={LuLayers}
        title="Also means"
        items={translation.additionalTranslations}
        renderMode="list"
      />

      <TranslationSection
        icon={LuQuote}
        title="Usage examples"
        items={translation.exampleSentences}
        renderMode="quotes"
      />

      <TranslationSection
        icon={LuReplace}
        title="Synonyms"
        items={translation.synonyms}
        renderMode="tags"
      />

      <TranslationSection
        icon={LuLink2}
        title="Collocations"
        items={translation.collocations}
        renderMode="table"
      />
    </CardLayout>
  );
};
