import React from 'react';
import {
  LuBinary,
  LuLayers,
  LuLink2,
  LuQuote,
  LuReplace,
} from 'react-icons/lu';

import { Text } from '@chakra-ui/react';

import type { TranslationVerbResult } from '@/modules/words/words.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { TranslationSection } from './common/translation-section';
import { WordHeader } from './common/word-header';

interface VerbCardContentProps {
  translation: TranslationVerbResult;
}

export const VerbCardContent: React.FC<VerbCardContentProps> = ({
  translation,
}) => {
  const prepositions = translation.prepositions || [];
  const conjugationText =
    translation.regular === 'regular'
      ? translation.conjugation[translation.conjugation.length - 1]
      : translation.conjugation;

  return (
    <CardLayout>
      <WordHeader
        normalizedWord={translation.normalizedWord}
        mainTranslation={translation.mainTranslation}
        partOfSpeech={translation.partOfSpeech}
        additionalInfo={translation.regular}
      />

      {/* Conjugation */}
      <Text fontSize="md" color="gray.700">
        {conjugationText}
      </Text>

      <CardDivider />

      <TranslationSection
        icon={LuBinary}
        title="Prepositions"
        items={prepositions}
        renderMode="list"
        show={prepositions.length > 0}
      />

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
        renderMode="list"
      />
    </CardLayout>
  );
};
