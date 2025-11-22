import React from 'react';
import { LuLayers, LuLink2, LuQuote, LuReplace } from 'react-icons/lu';

import type { LinguisticWordItem } from '@/modules/linguistics/linguistics.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { LinguisticItemHeader } from './common/linguistic-item-header';
import { TranslationSection } from './common/translation-section';

interface GeneralWordContentProps {
  linguisticWordItem: LinguisticWordItem;
  onRegenerate?: () => void;
}

export const GeneralWordContent: React.FC<GeneralWordContentProps> = ({
  linguisticWordItem,
  onRegenerate,
}) => {
  return (
    <CardLayout>
      <LinguisticItemHeader
        normalizedWord={linguisticWordItem.normalizedWord}
        mainTranslation={linguisticWordItem.mainTranslation}
        partOfSpeech={linguisticWordItem.partOfSpeech}
        onRegenerate={onRegenerate}
      />

      <CardDivider />

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
