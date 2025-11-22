import React from 'react';
import { LuLayers, LuLink2, LuQuote, LuReplace, LuTable } from 'react-icons/lu';

import { Box, Grid, Text, VStack } from '@chakra-ui/react';

import type { DemonstrativePronounLinguisticItem } from '@/modules/linguistics/linguistics.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { LinguisticItemHeader } from './common/linguistic-item-header';
import { SectionHeader } from './common/section-header';
import { TranslationSection } from './common/translation-section';

interface DemonstrativePronounContentProps {
  linguisticWordItem: DemonstrativePronounLinguisticItem;
  onRegenerate?: () => void;
}

export const DemonstrativePronounContent: React.FC<
  DemonstrativePronounContentProps
> = ({ linguisticWordItem, onRegenerate }) => {
  const hasDeclensions =
    linguisticWordItem.declensions &&
    linguisticWordItem.declensions.length > 0 &&
    linguisticWordItem.declensions.some(
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
          bg="gray.100"
        >
          {headers.map((header) => (
            <Text
              key={header}
              fontSize="sm"
              fontWeight="bold"
              textTransform="capitalize"
              color="gray.600"
              textAlign="center"
            >
              {header}
            </Text>
          ))}
        </Grid>
        {/* Data rows */}
        <VStack gap={1} align="stretch">
          {linguisticWordItem.declensions.map((declension, index) => (
            <Grid
              key={index}
              templateColumns="repeat(5, 1fr)"
              gap={4}
              py={2}
              px={3}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
            >
              <Text
                fontSize="sm"
                color="gray.700"
                fontWeight="medium"
                textAlign="center"
              >
                {declension.case}
              </Text>
              <Text fontSize="sm" color="gray.700" textAlign="center">
                {declension.masculine}
              </Text>
              <Text fontSize="sm" color="gray.700" textAlign="center">
                {declension.feminine}
              </Text>
              <Text fontSize="sm" color="gray.700" textAlign="center">
                {declension.neuter}
              </Text>
              <Text fontSize="sm" color="gray.700" textAlign="center">
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
      <LinguisticItemHeader
        normalizedWord={linguisticWordItem.normalizedWord}
        mainTranslation={linguisticWordItem.mainTranslation}
        partOfSpeech={linguisticWordItem.partOfSpeech}
        onRegenerate={onRegenerate}
      />

      <Text fontSize="md" color="gray.700">
        {linguisticWordItem.pronounType}
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
