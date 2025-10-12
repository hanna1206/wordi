import React from 'react';
import { LuLayers, LuLink2, LuQuote, LuReplace } from 'react-icons/lu';

import type { LinguisticItem } from '@/modules/linguistics/linguistics.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { LinguisticItemHeader } from './common/linguistic-item-header';
import { TranslationSection } from './common/translation-section';

interface GeneralContentProps {
  linguisticItem: LinguisticItem;
  onRegenerate?: () => void;
}

export const GeneralContent: React.FC<GeneralContentProps> = ({
  linguisticItem,
  onRegenerate,
}) => {
  return (
    <CardLayout>
      <LinguisticItemHeader
        normalizedWord={linguisticItem.normalizedWord}
        mainTranslation={linguisticItem.mainTranslation}
        partOfSpeech={linguisticItem.partOfSpeech}
        onRegenerate={onRegenerate}
      />

      <CardDivider />

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
