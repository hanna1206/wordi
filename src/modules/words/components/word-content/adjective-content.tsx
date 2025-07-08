import React from 'react';
import {
  LuBinary,
  LuLayers,
  LuLink2,
  LuQuote,
  LuReplace,
  LuTrendingUp,
} from 'react-icons/lu';

import type { TranslationAdjectiveResult } from '@/modules/words/words.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { TranslationSection } from './common/translation-section';
import { WordHeader } from './common/word-header';

interface AdjectiveContentProps {
  translation: TranslationAdjectiveResult;
  onRegenerate?: () => void;
}

export const AdjectiveContent: React.FC<AdjectiveContentProps> = ({
  translation,
  onRegenerate,
}) => {
  const prepositions = translation.prepositions || [];
  const hasComparisonForms = translation.comparisonForms;

  // Create comparison forms data for table display
  const comparisonFormsTable = hasComparisonForms
    ? [
        {
          positive: hasComparisonForms.positive,
          comparative: hasComparisonForms.comparative || 'N/A',
          superlative: hasComparisonForms.superlative || 'N/A',
        },
      ]
    : [];

  return (
    <CardLayout>
      <WordHeader
        normalizedWord={translation.normalizedWord}
        mainTranslation={translation.mainTranslation}
        partOfSpeech={translation.partOfSpeech}
        onRegenerate={onRegenerate}
      />
      <CardDivider />
      {/* Comparison Forms */}
      {hasComparisonForms && (
        <TranslationSection
          icon={LuTrendingUp}
          title="Comparison Forms"
          items={comparisonFormsTable}
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
