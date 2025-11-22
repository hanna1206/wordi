import React from 'react';
import {
  LuBinary,
  LuLayers,
  LuLink2,
  LuQuote,
  LuReplace,
} from 'react-icons/lu';

import { Gender, PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import type { NounLinguisticItem } from '@/modules/linguistics/linguistics.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { LinguisticItemHeader } from './common/linguistic-item-header';
import { TranslationSection } from './common/translation-section';

interface NounContentProps {
  linguisticWordItem: NounLinguisticItem;
  onRegenerate?: () => void;
}

export const NounContent: React.FC<NounContentProps> = ({
  linguisticWordItem,
  onRegenerate,
}) => {
  const isNoun = linguisticWordItem.partOfSpeech?.includes(PartOfSpeech.NOUN);
  const hasPluralForm =
    'pluralForm' in linguisticWordItem && !!linguisticWordItem.pluralForm;
  const hasPrepositions =
    'prepositions' in linguisticWordItem && !!linguisticWordItem.prepositions;

  // Extract plural form and prepositions safely
  const pluralForm = hasPluralForm ? linguisticWordItem.pluralForm : '';
  const prepositions = hasPrepositions
    ? linguisticWordItem.prepositions || []
    : [];

  return (
    <CardLayout>
      <LinguisticItemHeader
        normalizedWord={linguisticWordItem.normalizedWord}
        mainTranslation={linguisticWordItem.mainTranslation}
        partOfSpeech={linguisticWordItem.partOfSpeech}
        gender={linguisticWordItem.gender as Gender}
        onRegenerate={onRegenerate}
      />

      {/* Plural */}
      {isNoun && hasPluralForm && (
        <TranslationSection
          icon={LuBinary}
          title="Plural"
          items={[pluralForm || 'N/A']}
          renderMode="text"
        />
      )}

      <CardDivider />

      <TranslationSection
        icon={LuBinary}
        title="Prepositions"
        items={prepositions}
        renderMode="table"
        show={hasPrepositions}
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
