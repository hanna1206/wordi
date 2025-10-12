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
  linguisticItem: NounLinguisticItem;
  onRegenerate?: () => void;
}

export const NounContent: React.FC<NounContentProps> = ({
  linguisticItem,
  onRegenerate,
}) => {
  const isNoun = linguisticItem.partOfSpeech?.includes(PartOfSpeech.NOUN);
  const hasPluralForm =
    'pluralForm' in linguisticItem && !!linguisticItem.pluralForm;
  const hasPrepositions =
    'prepositions' in linguisticItem && !!linguisticItem.prepositions;

  // Extract plural form and prepositions safely
  const pluralForm = hasPluralForm ? linguisticItem.pluralForm : '';
  const prepositions = hasPrepositions ? linguisticItem.prepositions || [] : [];

  return (
    <CardLayout>
      <LinguisticItemHeader
        normalizedWord={linguisticItem.normalizedWord}
        mainTranslation={linguisticItem.mainTranslation}
        partOfSpeech={linguisticItem.partOfSpeech}
        gender={linguisticItem.gender as Gender}
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
