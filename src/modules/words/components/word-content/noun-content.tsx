import React from 'react';
import {
  LuBinary,
  LuLayers,
  LuLink2,
  LuQuote,
  LuReplace,
} from 'react-icons/lu';

import type { TranslationResult } from '@/modules/words/words.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { TranslationSection } from './common/translation-section';
import { WordHeader } from './common/word-header';

interface NounCardContentProps {
  translation: TranslationResult;
}

export const NounCardContent: React.FC<NounCardContentProps> = ({
  translation,
}) => {
  const isNoun = translation.partOfSpeech?.includes('noun');
  const hasPluralForm = 'pluralForm' in translation && translation.pluralForm;
  const hasPrepositions =
    'prepositions' in translation && translation.prepositions;

  // Extract plural form and prepositions safely
  const pluralForm = hasPluralForm ? translation.pluralForm : '';
  const prepositions = hasPrepositions ? translation.prepositions || [] : [];

  return (
    <CardLayout>
      <WordHeader
        normalizedWord={translation.normalizedWord}
        mainTranslation={translation.mainTranslation}
        partOfSpeech={translation.partOfSpeech}
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
        renderMode="list"
        show={Boolean(hasPrepositions)}
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
        renderMode="list"
      />
    </CardLayout>
  );
};
