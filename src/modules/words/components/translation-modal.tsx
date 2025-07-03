import React from 'react';

import {
  Button,
  Dialog,
  Portal,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

import { getGenderBgColor } from '@/modules/words/utils/get-gender-bg-color';
import type { TranslationResult } from '@/modules/words/words.types';

interface TranslationModalProps {
  isOpen: boolean;
  word: string;
  isLoading: boolean;
  error: string | null;
  translation: TranslationResult | null;
  onClose: () => void;
}

export const TranslationModal: React.FC<TranslationModalProps> = ({
  isOpen,
  word,
  isLoading,
  error,
  translation,
  onClose,
}) => {
  const bgColor =
    translation && 'gender' in translation
      ? getGenderBgColor(translation)
      : undefined;

  const isNoun = translation && translation.partOfSpeech?.includes('noun');

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            maxW={{ base: '95vw', md: 'md' }}
            mx="auto"
            px={{ base: 2, md: 6 }}
            py={{ base: 2, md: 4 }}
            {...(bgColor ? { bg: bgColor } : {})}
          >
            <Dialog.Header>
              <Dialog.Title fontSize={{ base: 'lg', md: '2xl' }}>
                Translating &quot;{word}&quot;
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {isLoading ? (
                <VStack gap={{ base: 2, md: 4 }} py={{ base: 4, md: 8 }}>
                  <Spinner size={{ base: 'md', md: 'lg' }} color="blue.500" />
                  <Text
                    fontSize={{ base: 'sm', md: 'md' }}
                    color="gray.500"
                    _dark={{ color: 'gray.400' }}
                  >
                    Getting translation...
                  </Text>
                </VStack>
              ) : error ? (
                <VStack gap={{ base: 2, md: 4 }} py={{ base: 2, md: 4 }}>
                  <Text
                    fontSize={{ base: 'sm', md: 'md' }}
                    color="red.500"
                    textAlign="center"
                  >
                    {error}
                  </Text>
                </VStack>
              ) : translation ? (
                <VStack
                  gap={{ base: 2, md: 4 }}
                  py={{ base: 2, md: 4 }}
                  align="stretch"
                >
                  <VStack gap={1} align="start">
                    <Text
                      fontSize={{ base: 'lg', md: '2xl' }}
                      fontWeight="bold"
                    >
                      {translation.normalizedWord}
                    </Text>
                    <Text
                      fontSize={{ base: 'lg', md: '2xl' }}
                      fontWeight="bold"
                    >
                      {translation.mainTranslation}
                    </Text>
                    {translation.partOfSpeech &&
                      translation.partOfSpeech.map((partOfSpeech) => (
                        <Text
                          fontSize={{ base: 'sm', md: 'md' }}
                          color="gray.500"
                          fontStyle="italic"
                          key={partOfSpeech}
                        >
                          {partOfSpeech}
                        </Text>
                      ))}
                  </VStack>
                  {/* Plural */}
                  {isNoun && 'pluralForm' in translation && (
                    <VStack align="start" gap={1}>
                      <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight="semibold"
                      >
                        Plural:
                        <Text as="span" fontWeight="normal" ml={2}>
                          {translation.pluralForm || ''}
                        </Text>
                      </Text>
                    </VStack>
                  )}
                  {translation.additionalTranslations.length > 0 && (
                    <VStack align="start" gap={1}>
                      <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight="semibold"
                      >
                        Also can mean:
                      </Text>
                      <VStack align="start" pl={2} gap={0}>
                        {translation.additionalTranslations.map(
                          (additionalTranslation) => (
                            <Text
                              key={additionalTranslation}
                              fontSize={{ base: 'sm', md: 'md' }}
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
                      <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight="semibold"
                      >
                        Usage examples:
                      </Text>
                      <VStack align="start" pl={2} gap={0}>
                        {translation.exampleSentences.map((sentence) => (
                          <Text
                            key={sentence}
                            fontSize={{ base: 'xs', md: 'sm' }}
                            color="gray.600"
                          >
                            “{sentence}”
                          </Text>
                        ))}
                      </VStack>
                    </VStack>
                  )}
                  {translation.synonyms.length > 0 && (
                    <VStack align="start" gap={1}>
                      <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight="semibold"
                      >
                        Synonyms:
                      </Text>
                      <VStack direction="row" wrap="wrap" gap={2} align="start">
                        {translation.synonyms.map((synonym) => (
                          <Text
                            key={synonym}
                            fontSize={{ base: 'xs', md: 'sm' }}
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
                      <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight="semibold"
                      >
                        Collocations:
                      </Text>
                      <VStack align="start" pl={2} gap={0}>
                        {translation.collocations.map((collocation) => (
                          <Text
                            key={collocation}
                            fontSize={{ base: 'xs', md: 'sm' }}
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
            <Dialog.Footer
              flexDirection={{ base: 'column', md: 'row' }}
              gap={{ base: 2, md: 3 }}
            >
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onClose}
                  w={{ base: '100%', md: 'auto' }}
                >
                  Close
                </Button>
              </Dialog.ActionTrigger>
              {translation && (
                <Button
                  colorScheme="blue"
                  ml={{ base: 0, md: 3 }}
                  w={{ base: '100%', md: 'auto' }}
                >
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
