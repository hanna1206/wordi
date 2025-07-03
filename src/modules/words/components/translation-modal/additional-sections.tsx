import React from 'react';
import { LuLayers, LuLink2, LuQuote, LuReplace } from 'react-icons/lu';

import { HStack, Icon, Text, VStack } from '@chakra-ui/react';

import type { TranslationResult } from '@/modules/words/words.types';

interface AdditionalSectionsProps {
  translation: TranslationResult;
}

export const AdditionalSections: React.FC<AdditionalSectionsProps> = ({
  translation,
}) => {
  return (
    <>
      {/* Additional Translations */}
      {translation.additionalTranslations.length > 0 && (
        <VStack align="start" gap={1}>
          <HStack align="center" color="gray.600">
            <Icon as={LuLayers} boxSize={4} />
            <Text fontWeight="semibold" fontSize="sm">
              Also means
            </Text>
          </HStack>
          <VStack align="start" pl={6} gap={0}>
            {translation.additionalTranslations.map((additionalTranslation) => (
              <Text key={additionalTranslation} fontSize="md" color="gray.700">
                • {additionalTranslation}
              </Text>
            ))}
          </VStack>
        </VStack>
      )}

      {/* Example Sentences */}
      {translation.exampleSentences.length > 0 && (
        <VStack align="start" gap={1}>
          <HStack align="center" color="gray.600">
            <Icon as={LuQuote} boxSize={4} />
            <Text fontWeight="semibold" fontSize="sm">
              Usage examples
            </Text>
          </HStack>
          <VStack align="start" pl={6} gap={1}>
            {translation.exampleSentences.map((sentence) => (
              <Text
                key={sentence}
                fontSize="sm"
                color="gray.600"
                fontStyle="italic"
              >
                &quot;{sentence}&quot;
              </Text>
            ))}
          </VStack>
        </VStack>
      )}

      {/* Synonyms */}
      {translation.synonyms.length > 0 && (
        <VStack align="start" gap={2}>
          <HStack align="center" color="gray.600">
            <Icon as={LuReplace} boxSize={4} />
            <Text fontWeight="semibold" fontSize="sm">
              Synonyms
            </Text>
          </HStack>
          <HStack wrap="wrap" gap={2} pl={6}>
            {translation.synonyms.map((synonym) => (
              <Text
                key={synonym}
                fontSize="sm"
                px={2.5}
                py={1}
                borderRadius="md"
                bg="gray.100"
                color="gray.800"
                _dark={{ bg: 'gray.700', color: 'gray.200' }}
              >
                {synonym}
              </Text>
            ))}
          </HStack>
        </VStack>
      )}

      {/* Collocations */}
      {translation.collocations.length > 0 && (
        <VStack align="start" gap={1}>
          <HStack align="center" color="gray.600">
            <Icon as={LuLink2} boxSize={4} />
            <Text fontWeight="semibold" fontSize="sm">
              Collocations
            </Text>
          </HStack>
          <VStack align="start" pl={6} gap={0}>
            {translation.collocations.map((collocation) => (
              <Text key={collocation} fontSize="md" color="gray.700">
                • {collocation}
              </Text>
            ))}
          </VStack>
        </VStack>
      )}
    </>
  );
};
