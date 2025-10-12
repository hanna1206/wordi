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
  linguisticItem: AdjectiveLinguisticItem;
  onRegenerate?: () => void;
}

export const AdjectiveContent: React.FC<AdjectiveContentProps> = ({
  linguisticItem,
  onRegenerate,
}) => {
  const prepositions = linguisticItem.prepositions || [];
  const hasComparisonForms = linguisticItem.comparisonForms;

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
        normalizedWord={linguisticItem.normalizedWord}
        mainTranslation={linguisticItem.mainTranslation}
        partOfSpeech={linguisticItem.partOfSpeech}
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
