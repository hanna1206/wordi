import React from 'react';

import {
  Button,
  Dialog,
  Portal,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

import type { TranslationResult } from '@/modules/words/words.types';

interface TranslationModalProps {
  isOpen: boolean;
  word: string;
  isLoading: boolean;
  error: string | null;
  translation: TranslationResult | null;
  onClose: () => void;
}

const getGenderBgColor = (
  translation: TranslationResult | null,
): string | undefined => {
  if (
    translation &&
    Array.isArray(translation.partOfSpeech) &&
    translation.partOfSpeech.includes('noun') &&
    translation.gender
  ) {
    if (translation.gender === 'feminine') {
      return '#FFF0F6'; // very light pink
    } else if (translation.gender === 'masculine') {
      return '#E6F4FF'; // very light blue
    } else if (translation.gender === 'neuter') {
      return '#FFFBE6'; // very light yellow
    }
  }
  return undefined;
};

export const TranslationModal: React.FC<TranslationModalProps> = ({
  isOpen,
  word,
  isLoading,
  error,
  translation,
  onClose,
}) => {
  const bgColor = getGenderBgColor(translation);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="md"
            mx="auto"
            {...(bgColor ? { bg: bgColor } : {})}
          >
            <Dialog.Header>
              <Dialog.Title>Translating &quot;{word}&quot;</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {isLoading ? (
                <VStack gap={4} py={8}>
                  <Spinner size="lg" color="blue.500" />
                  <Text color="gray.500" _dark={{ color: 'gray.400' }}>
                    Getting translation...
                  </Text>
                </VStack>
              ) : error ? (
                <VStack gap={4} py={4}>
                  <Text color="red.500" textAlign="center">
                    {error}
                  </Text>
                </VStack>
              ) : translation ? (
                <VStack gap={4} py={4} align="stretch">
                  <VStack gap={1} align="start">
                    <Text fontSize="2xl" fontWeight="bold">
                      {translation.mainTranslation}
                    </Text>
                    {translation.partOfSpeech &&
                      translation.partOfSpeech.map((partOfSpeech) => (
                        <Text
                          fontSize="md"
                          color="gray.500"
                          fontStyle="italic"
                          key={partOfSpeech}
                        >
                          {partOfSpeech}
                        </Text>
                      ))}
                  </VStack>
                  {translation.additionalTranslations.length > 0 && (
                    <VStack align="start" gap={1}>
                      <Text fontWeight="semibold">Also can mean:</Text>
                      <VStack align="start" pl={2} gap={0}>
                        {translation.additionalTranslations.map(
                          (additionalTranslation) => (
                            <Text
                              key={additionalTranslation}
                              fontSize="md"
                              color="gray.700"
                            >
                              • {additionalTranslation}
                            </Text>
                          ),
                        )}
                      </VStack>
                    </VStack>
                  )}
                  {translation.exampleSentences.length > 0 && (
                    <VStack align="start" gap={1}>
                      <Text fontWeight="semibold">Usage examples:</Text>
                      <VStack align="start" pl={2} gap={0}>
                        {translation.exampleSentences.map((sentence) => (
                          <Text key={sentence} fontSize="sm" color="gray.600">
                            “{sentence}”
                          </Text>
                        ))}
                      </VStack>
                    </VStack>
                  )}
                  {translation.synonyms.length > 0 && (
                    <VStack align="start" gap={1}>
                      <Text fontWeight="semibold">Synonyms:</Text>
                      <VStack direction="row" wrap="wrap" gap={2} align="start">
                        {translation.synonyms.map((synonym) => (
                          <Text
                            key={synonym}
                            fontSize="sm"
                            px={2}
                            py={0.5}
                            borderRadius="md"
                            bg="gray.100"
                            color="gray.700"
                            display="inline-block"
                          >
                            {synonym}
                          </Text>
                        ))}
                      </VStack>
                    </VStack>
                  )}
                  {/* Collocations */}
                  {translation.collocations.length > 0 && (
                    <VStack align="start" gap={1}>
                      <Text fontWeight="semibold">Collocations:</Text>
                      <VStack align="start" pl={2} gap={0}>
                        {translation.collocations.map((collocation) => (
                          <Text
                            key={collocation}
                            fontSize="sm"
                            color="gray.700"
                          >
                            • {collocation}
                          </Text>
                        ))}
                      </VStack>
                    </VStack>
                  )}
                </VStack>
              ) : null}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </Dialog.ActionTrigger>
              {translation && (
                <Button colorScheme="blue" ml={3}>
                  Save to Collection
                </Button>
              )}
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
