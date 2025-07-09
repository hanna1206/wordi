import React from 'react';
import { LuLayers, LuLink2, LuQuote, LuReplace } from 'react-icons/lu';

import type { TranslationResult } from '@/modules/words-generation/words-generation.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { TranslationSection } from './common/translation-section';
import { WordHeader } from './common/word-header';

interface GeneralContentProps {
  translation: TranslationResult;
  onRegenerate?: () => void;
}

export const GeneralContent: React.FC<GeneralContentProps> = ({
  translation,
  onRegenerate,
}) => {
  return (
    <CardLayout>
      <WordHeader
        normalizedWord={translation.normalizedWord}
        mainTranslation={translation.mainTranslation}
        partOfSpeech={translation.partOfSpeech}
        onRegenerate={onRegenerate}
      />

      <CardDivider />

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
