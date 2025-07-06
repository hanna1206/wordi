import React from 'react';

import { Button, Dialog, Portal } from '@chakra-ui/react';

import { GenerateWordError } from '@/modules/words/components/generate-word-modal/generate-word-error';
import { GenerateWordLoaded } from '@/modules/words/components/generate-word-modal/generate-word-loaded';
import { GenerateWordLoading } from '@/modules/words/components/generate-word-modal/generate-word-loading';
import type { TranslationResult } from '@/modules/words/words.types';

interface GenerateWordModalProps {
  isOpen: boolean;
  word: string;
  isLoading: boolean;
  error: string | null;
  translation: TranslationResult | null;
  onClose: () => void;
}

export const GenerateWordModal: React.FC<GenerateWordModalProps> = ({
  isOpen,
  word,
  isLoading,
  error,
  translation,
  onClose,
}) => {
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
          >
            <Dialog.Body>
              {isLoading ? (
                <GenerateWordLoading word={word} />
              ) : error ? (
                <GenerateWordError error={error} />
              ) : translation ? (
                <GenerateWordLoaded translation={translation} />
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
              {/* {translation && (
                <Button
                  colorScheme="blue"
                  ml={{ base: 0, md: 3 }}
                  w={{ base: '100%', md: 'auto' }}
                  bg="blue.500"
                >
                  Save to Collection
                </Button>
              )} */}
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
