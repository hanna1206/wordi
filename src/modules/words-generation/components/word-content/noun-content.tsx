import React from 'react';
import {
  LuBinary,
  LuLayers,
  LuLink2,
  LuQuote,
  LuReplace,
} from 'react-icons/lu';

import {
  Gender,
  PartOfSpeech,
} from '@/modules/words-generation/words-generation.const';
import type { TranslationNounResult } from '@/modules/words-generation/words-generation.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { TranslationSection } from './common/translation-section';
import { WordHeader } from './common/word-header';

interface NounContentProps {
  translation: TranslationNounResult;
  onRegenerate?: () => void;
}

export const NounContent: React.FC<NounContentProps> = ({
  translation,
  onRegenerate,
}) => {
  const isNoun = translation.partOfSpeech?.includes(PartOfSpeech.NOUN);
  const hasPluralForm = 'pluralForm' in translation && !!translation.pluralForm;
  const hasPrepositions =
    'prepositions' in translation && !!translation.prepositions;

  // Extract plural form and prepositions safely
  const pluralForm = hasPluralForm ? translation.pluralForm : '';
  const prepositions = hasPrepositions ? translation.prepositions || [] : [];

  return (
    <CardLayout>
      <WordHeader
        normalizedWord={translation.normalizedWord}
        mainTranslation={translation.mainTranslation}
        partOfSpeech={translation.partOfSpeech}
        gender={translation.gender as Gender}
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
