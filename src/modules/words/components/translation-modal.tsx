import React from 'react';

import { Button, Dialog, Portal } from '@chakra-ui/react';

import { TranslationLoading } from '@/modules/words/components/generate-word-modal/generate-loading';
import { TranslationError } from '@/modules/words/components/generate-word-modal/generate-word-error';
import { TranslationContent } from '@/modules/words/components/generate-word-modal/generate-word-loaded';
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

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            maxW={{ base: '95vw', md: 'lg', lg: 'xl' }}
            mx="auto"
            px={{ base: 4, md: 6 }}
            py={{ base: 4, md: 6 }}
            {...(bgColor ? { bg: bgColor } : {})}
          >
            <Dialog.Body>
              {isLoading ? (
                <TranslationLoading word={word} />
              ) : error ? (
                <TranslationError error={error} />
              ) : translation ? (
                <TranslationContent translation={translation} />
              ) : null}
            </Dialog.Body>
            <Dialog.Footer
              flexDirection={{ base: 'column', md: 'row' }}
              gap={{ base: 2, md: 3 }}
              pt={4}
              borderTopWidth="1px"
              borderColor="gray.200"
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
