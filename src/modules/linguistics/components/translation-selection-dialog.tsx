'use client';

import React from 'react';

import {
  Button,
  Dialog,
  Flex,
  Portal,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

import type { TranslationOption } from '@/modules/linguistics/linguistics.types';

export interface TranslationSelectionDialogProps {
  isOpen: boolean;
  originalInput: string;
  detectedLanguage: string;
  translations: TranslationOption[];
  isLoading: boolean;
  error: string | null;
  onSelectTranslation: (translation: string) => void;
  onClose: () => void;
  onRetry: () => void;
}

export const TranslationSelectionDialog: React.FC<
  TranslationSelectionDialogProps
> = ({
  isOpen,
  originalInput,
  detectedLanguage,
  translations,
  isLoading,
  error,
  onSelectTranslation,
  onClose,
  onRetry,
}) => {
  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.600" />
          <Dialog.Positioner
            position="fixed"
            inset={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
          >
            <Dialog.Content
              maxW={{ base: '90vw', md: 'md' }}
              w="full"
              shadow="lg"
            >
              <Dialog.Header>
                <VStack align="start" gap={1}>
                  <Dialog.Title>Select German Translation</Dialog.Title>
                  <Text fontSize="sm" color="gray.600" fontWeight="normal">
                    Original: <strong>{originalInput}</strong> (
                    {detectedLanguage})
                  </Text>
                </VStack>
                <Dialog.CloseTrigger />
              </Dialog.Header>

              <Dialog.Body p={6}>
                {isLoading ? (
                  <Flex justify="center" align="center" py={8}>
                    <Spinner size="lg" />
                  </Flex>
                ) : error ? (
                  <Flex direction="column" align="center" gap={4} py={6}>
                    <Text color="red.500" textAlign="center">
                      {error}
                    </Text>
                    <Button onClick={onRetry} size="md" variant="outline">
                      Retry
                    </Button>
                  </Flex>
                ) : translations.length > 0 ? (
                  <VStack gap={2} align="stretch">
                    {translations.map((translation, index) => (
                      <Button
                        key={index}
                        onClick={() => onSelectTranslation(translation.text)}
                        variant="outline"
                        justifyContent="flex-start"
                        w="full"
                        h="auto"
                        py={3}
                        px={4}
                        textAlign="left"
                        _hover={{
                          bg: 'gray.50',
                          borderColor: 'gray.400',
                        }}
                      >
                        <VStack align="start" gap={1} w="full">
                          <Text fontWeight="medium" fontSize="md">
                            {translation.text}
                          </Text>
                          {translation.context && (
                            <Text
                              fontSize="sm"
                              color="gray.600"
                              fontWeight="normal"
                              whiteSpace="normal"
                              wordBreak="break-word"
                            >
                              {translation.context}
                            </Text>
                          )}
                        </VStack>
                      </Button>
                    ))}
                  </VStack>
                ) : null}
              </Dialog.Body>

              <Dialog.Footer
                borderTopWidth="1px"
                borderColor="gray.100"
                display="flex"
                gap={3}
              >
                <Dialog.ActionTrigger asChild>
                  <Button variant="subtle" onClick={onClose} w="full" size="md">
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
