import React from 'react';
import { LuLayers, LuLink2, LuQuote, LuReplace } from 'react-icons/lu';

import type { TranslationResult } from '@/modules/words/words.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { TranslationSection } from './common/translation-section';
import { WordHeader } from './common/word-header';

interface GeneralCardContentProps {
  translation: TranslationResult;
}

export const GeneralCardContent: React.FC<GeneralCardContentProps> = ({
  translation,
}) => {
  return (
    <CardLayout>
      <WordHeader
        normalizedWord={translation.normalizedWord}
        mainTranslation={translation.mainTranslation}
        partOfSpeech={translation.partOfSpeech}
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
        renderMode="list"
      />
    </CardLayout>
  );
};
