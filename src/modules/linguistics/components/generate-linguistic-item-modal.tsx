import React, { useState } from 'react';

import { Button, Dialog, Portal } from '@chakra-ui/react';

import { toaster } from '@/components/toaster';
import { useDueWordsCount } from '@/modules/flashcards/context/due-words-count-context';
import { GenerateLinguisticItemError } from '@/modules/linguistics/components/generate-linguistic-item-modal/generate-linguistic-item-error';
import { GenerateLinguisticItemLoaded } from '@/modules/linguistics/components/generate-linguistic-item-modal/generate-linguistic-item-loaded';
import { GenerateLinguisticItemLoading } from '@/modules/linguistics/components/generate-linguistic-item-modal/generate-linguistic-item-loading';
import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import type {
  LinguisticCollocationItem,
  LinguisticWordItem,
  NounLinguisticItem,
} from '@/modules/linguistics/linguistics.types';
import { getGenderProperties } from '@/modules/linguistics/utils/get-gender-properties';
import { isLinguisticCollocationItem } from '@/modules/linguistics/utils/is-linguistic-collocation-item';
import {
  saveCollocationForLearning,
  saveWordForLearning,
} from '@/modules/vocabulary/vocabulary.actions';

export interface GenerateLinguisticItemModalProps {
  isOpen: boolean;
  word: string;
  isLoading: boolean;
  error: string | null;
  linguisticItem: LinguisticWordItem | LinguisticCollocationItem | null;
  onClose: () => void;
  onRegenerate: (word: string) => void;
}

export const GenerateLinguisticItemModal: React.FC<
  GenerateLinguisticItemModalProps
> = ({
  isOpen,
  word,
  isLoading,
  error,
  linguisticItem,
  onClose,
  onRegenerate,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const { refetchDueCount } = useDueWordsCount();

  const isCollocation =
    linguisticItem && isLinguisticCollocationItem(linguisticItem);

  const isNoun =
    !isCollocation &&
    linguisticItem &&
    'partOfSpeech' in linguisticItem &&
    linguisticItem.partOfSpeech?.includes(PartOfSpeech.NOUN);
  const gender = isNoun
    ? (linguisticItem as NounLinguisticItem).gender
    : undefined;
  const genderProps = getGenderProperties(gender);
  const genderColor = genderProps
    ? `${genderProps.colorScheme}.400`
    : undefined;

  const handleVocabularyItem = async () => {
    if (!linguisticItem) return;

    setIsSaving(true);
    try {
      let result;

      if (isCollocation) {
        result = await saveCollocationForLearning(
          linguisticItem as LinguisticCollocationItem,
        );
      } else {
        result = await saveWordForLearning(
          linguisticItem as LinguisticWordItem,
        );
      }

      if (result.success) {
        toaster.create({
          title: isCollocation ? 'Collocation saved!' : 'Word saved!',
          description: isCollocation
            ? 'Collocation has been saved for learning'
            : 'Word has been saved for learning',
          type: 'success',
          duration: 3000,
        });
        onClose();
        refetchDueCount();
      } else {
        toaster.create({
          title: 'Save failed',
          description: result.error,
          type: 'error',
          duration: 5000,
        });
      }
    } catch {
      toaster.create({
        title: 'Save failed',
        description: 'An unexpected error occurred',
        type: 'error',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.600" />
        <Dialog.Positioner
          position="fixed"
          inset={0}
          display="flex"
          alignItems={{ base: 'flex-end', md: 'center' }}
          justifyContent="center"
          p={{ base: 0, md: 4 }}
        >
          <Dialog.Content
            borderTopWidth="8px"
            borderTopColor={genderColor}
            maxW={{ base: '100vw', md: 'lg', lg: 'xl' }}
            w="full"
            h={{ base: '100svh', md: 'auto' }}
            maxH={{ base: '100svh', md: '80vh' }}
            m={0}
            shadow={{ base: '0 -4px 20px rgba(0,0,0,0.15)', md: 'lg' }}
            overflow="hidden"
            position="relative"
            css={{
              '@supports not (height: 100svh)': {
                height: { base: '100svh', md: 'auto' },
                maxHeight: { base: '100svh', md: '80vh' },
              },
            }}
          >
            <Dialog.Body
              p={{ base: 4, md: 6 }}
              pt={{ base: 2, md: 6 }}
              pb={{ base: 4, md: 4 }}
              overflowY="auto"
              flex="1"
              display={isLoading ? 'flex' : 'block'}
              alignItems={isLoading ? 'center' : 'initial'}
              justifyContent={isLoading ? 'center' : 'initial'}
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#CBD5E0',
                  borderRadius: '4px',
                },
              }}
            >
              {isLoading ? (
                <GenerateLinguisticItemLoading word={word} />
              ) : error ? (
                <GenerateLinguisticItemError
                  error={error}
                  onRetry={() => onRegenerate(word)}
                />
              ) : linguisticItem ? (
                <GenerateLinguisticItemLoaded
                  linguisticItem={linguisticItem}
                  onRegenerate={() => onRegenerate(word)}
                />
              ) : null}
            </Dialog.Body>

            <Dialog.Footer
              px={{ base: 4, md: 6 }}
              py={{ base: 4, md: 4 }}
              borderTopWidth="1px"
              borderColor="gray.100"
              bg="gray.100"
              mt="auto"
              display="flex"
              gap={3}
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems="stretch"
            >
              {linguisticItem && (
                <Button
                  size={{ base: 'lg', md: 'lg' }}
                  h={{ base: '48px', md: '44px' }}
                  borderRadius={{ base: 'xl', md: 'md' }}
                  w={{ base: 'full', md: 'auto' }}
                  onClick={handleVocabularyItem}
                  loading={isSaving}
                  disabled={isSaving}
                  flex={{ base: 'none', md: '1' }}
                >
                  {isSaving ? 'Saving...' : 'Save for learning'}
                </Button>
              )}
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="subtle"
                  onClick={onClose}
                  w={{ base: 'full', md: 'auto' }}
                  size={{ base: 'lg', md: 'lg' }}
                  h={{ base: '48px', md: '44px' }}
                  px={{ base: 6, md: 8 }}
                  fontWeight="medium"
                  flex={{ base: 'none', md: '1' }}
                >
                  Close
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
