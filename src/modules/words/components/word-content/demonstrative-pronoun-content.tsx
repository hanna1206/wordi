import React from 'react';
import { LuLayers, LuLink2, LuQuote, LuReplace, LuTable } from 'react-icons/lu';

import { Box, Grid, Text, VStack } from '@chakra-ui/react';

import type { TranslationDemonstrativePronounResult } from '@/modules/words/words.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { SectionHeader } from './common/section-header';
import { TranslationSection } from './common/translation-section';
import { WordHeader } from './common/word-header';

interface DemonstrativePronounContentProps {
  translation: TranslationDemonstrativePronounResult;
  onRegenerate?: () => void;
}

export const DemonstrativePronounContent: React.FC<
  DemonstrativePronounContentProps
> = ({ translation, onRegenerate }) => {
  const hasDeclensions =
    translation.declensions &&
    translation.declensions.length > 0 &&
    translation.declensions.some(
      (declension) =>
        declension.masculine ||
        declension.feminine ||
        declension.neuter ||
        declension.plural,
    );

  const renderDeclensionTable = () => {
    if (!hasDeclensions) return null;

    const headers = ['Case', 'Masculine', 'Feminine', 'Neuter', 'Plural'];

    return (
      <Box pl={6}>
        {/* Header row */}
        <Grid
          templateColumns="repeat(5, 1fr)"
          gap={4}
          mb={2}
          py={2}
          px={3}
          borderRadius="md"
          bg="gray.50"
          _dark={{ bg: 'gray.700' }}
        >
          {headers.map((header) => (
            <Text
              key={header}
              fontSize="sm"
              fontWeight="bold"
              textTransform="capitalize"
              color="gray.600"
              _dark={{ color: 'gray.400' }}
              textAlign="center"
            >
              {header}
            </Text>
          ))}
        </Grid>
        {/* Data rows */}
        <VStack gap={1} align="stretch">
          {translation.declensions.map((declension, index) => (
            <Grid
              key={index}
              templateColumns="repeat(5, 1fr)"
              gap={4}
              py={2}
              px={3}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              _dark={{ borderColor: 'gray.600' }}
            >
              <Text
                fontSize="sm"
                color="gray.700"
                _dark={{ color: 'gray.300' }}
                fontWeight="medium"
                textAlign="center"
              >
                {declension.case}
              </Text>
              <Text
                fontSize="sm"
                color="gray.700"
                _dark={{ color: 'gray.300' }}
                textAlign="center"
              >
                {declension.masculine}
              </Text>
              <Text
                fontSize="sm"
                color="gray.700"
                _dark={{ color: 'gray.300' }}
                textAlign="center"
              >
                {declension.feminine}
              </Text>
              <Text
                fontSize="sm"
                color="gray.700"
                _dark={{ color: 'gray.300' }}
                textAlign="center"
              >
                {declension.neuter}
              </Text>
              <Text
                fontSize="sm"
                color="gray.700"
                _dark={{ color: 'gray.300' }}
                textAlign="center"
              >
                {declension.plural}
              </Text>
            </Grid>
          ))}
        </VStack>
      </Box>
    );
  };

  return (
    <CardLayout>
      <WordHeader
        normalizedWord={translation.normalizedWord}
        mainTranslation={translation.mainTranslation}
        partOfSpeech={translation.partOfSpeech}
        onRegenerate={onRegenerate}
      />

      <Text fontSize="md" color="gray.700" _dark={{ color: 'gray.300' }}>
        {translation.pronounType}
      </Text>
      <CardDivider />

      {/* Declension Table */}
      {hasDeclensions && (
        <VStack align="start" gap={1}>
          <SectionHeader
            icon={LuTable}
            title="Declension by Gender, Number and Case"
          />
          {renderDeclensionTable()}
        </VStack>
      )}

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
