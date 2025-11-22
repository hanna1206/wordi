import React from 'react';
import {
  LuBinary,
  LuLayers,
  LuLink2,
  LuQuote,
  LuReplace,
  LuTrendingUp,
} from 'react-icons/lu';

import type { AdjectiveLinguisticItem } from '@/modules/linguistics/linguistics.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { LinguisticItemHeader } from './common/linguistic-item-header';
import { TranslationSection } from './common/translation-section';

interface AdjectiveContentProps {
  linguisticWordItem: AdjectiveLinguisticItem;
  onRegenerate?: () => void;
}

export const AdjectiveContent: React.FC<AdjectiveContentProps> = ({
  linguisticWordItem,
  onRegenerate,
}) => {
  const prepositions = linguisticWordItem.prepositions || [];
  const hasComparisonForms = linguisticWordItem.comparisonForms;

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
      <LinguisticItemHeader
        normalizedWord={linguisticWordItem.normalizedWord}
        mainTranslation={linguisticWordItem.mainTranslation}
        partOfSpeech={linguisticWordItem.partOfSpeech}
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
