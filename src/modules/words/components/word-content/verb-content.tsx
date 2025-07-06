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

interface VerbContentProps {
  translation: TranslationVerbResult;
}

export const VerbContent: React.FC<VerbContentProps> = ({ translation }) => {
  const prepositions = translation.prepositions || [];
  const conjugationAsArray = translation.conjugation.split(', ');
  const conjugationText =
    translation.regular === 'regular'
      ? conjugationAsArray[conjugationAsArray.length - 1]
      : conjugationAsArray.join(', ');

  return (
    <CardLayout>
      <WordHeader
        normalizedWord={translation.normalizedWord}
        mainTranslation={translation.mainTranslation}
        partOfSpeech={translation.partOfSpeech}
        regularOtIregularVerb={translation.regular}
        isReflexiveVerb={translation.isReflexive}
        separablePrefix={translation.separablePrefix}
      />

      {/* Conjugation */}
      <Text fontSize="md" color="gray.700">
        {conjugationText}
      </Text>

      <CardDivider />

      {translation.sichUsage && (
        <TranslationSection
          icon={LuBinary}
          title="Sich usage"
          items={[
            {
              rule: 'With sich',
              explanation: translation.sichUsage.withSich,
            },
            {
              rule: 'Without sich',
              explanation: translation.sichUsage.withoutSich,
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
