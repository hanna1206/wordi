import React from 'react';
import { LuLayers, LuQuote } from 'react-icons/lu';

import { Box, Grid, Text, VStack } from '@chakra-ui/react';

import type { LinguisticCollocationItem } from '@/modules/linguistics/linguistics.types';

import { CardDivider, CardLayout } from './common/card-layout';
import { LinguisticItemHeader } from './common/linguistic-item-header';
import { SectionHeader } from './common/section-header';

interface CollocationContentProps {
  linguisticCollocationItem: LinguisticCollocationItem;
  onRegenerate?: () => void;
}

export const CollocationContent: React.FC<CollocationContentProps> = ({
  linguisticCollocationItem,
  onRegenerate,
}) => {
  return (
    <CardLayout>
      {/* Header with normalized collocation and main translation */}
      <LinguisticItemHeader
        normalizedWord={linguisticCollocationItem.normalizedCollocation}
        mainTranslation={linguisticCollocationItem.mainTranslation}
        onRegenerate={onRegenerate}
      />

      <CardDivider />

      {/* Example Sentences */}
      {linguisticCollocationItem.exampleSentences.length > 0 && (
        <VStack align="start" gap={1}>
          <SectionHeader icon={LuQuote} title="Usage examples" />
          <VStack align="start" pl={6} gap={3}>
            {linguisticCollocationItem.exampleSentences.map(
              (example, index) => (
                <Box key={index}>
                  <Text
                    fontSize="sm"
                    color="gray.700"
                    fontStyle="italic"
                    mb={0.5}
                  >
                    &quot;{example.german}&quot;
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {example.translation}
                  </Text>
                </Box>
              ),
            )}
          </VStack>
        </VStack>
      )}

      {/* Component Words */}
      {linguisticCollocationItem.componentWords.length > 0 && (
        <VStack align="start" gap={1}>
          <SectionHeader icon={LuLayers} title="Component words" />
          <Box pl={6} w="full">
            <VStack gap={1} align="stretch">
              {linguisticCollocationItem.componentWords.map(
                (component, index) => (
                  <Grid
                    key={index}
                    templateColumns="1fr 1fr"
                    gap={4}
                    py={2}
                    px={3}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      {component.word}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {component.translation}
                    </Text>
                  </Grid>
                ),
              )}
            </VStack>
          </Box>
        </VStack>
      )}
    </CardLayout>
  );
};
