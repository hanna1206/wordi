import React, { useMemo } from 'react';

import { Dialog, Portal, Separator } from '@chakra-ui/react';

import { VocabularyItemCollections } from '@/modules/collection/components/vocabulary-item-collections';
import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import type {
  LinguisticCollocationItem,
  LinguisticWordItem,
  NounLinguisticItem,
} from '@/modules/linguistics/linguistics.types';
import { getGenderProperties } from '@/modules/linguistics/utils/get-gender-properties';
import { useVocabularyItemModal } from '@/modules/main/hooks/use-vocabulary-item-modal';
import type { VocabularyItem } from '@/modules/vocabulary/vocabulary.types';

import { VocabularyItemContent } from '../vocabulary-item-content';
import { DeleteConfirmation } from './delete-confirmation';
import { ModalFooter } from './modal-footer';

interface VocabularyItemModalProps {
  isOpen: boolean;
  savedWord: VocabularyItem | null;
  onClose: () => void;
  onWordDeleted?: () => void;
  allowDelete?: boolean;
}

const convertVocabularyItemToTranslationResult = (
  savedWord: VocabularyItem,
): LinguisticWordItem | LinguisticCollocationItem => {
  // Handle collocations
  if (savedWord.type === 'collocation') {
    const collocationItem: LinguisticCollocationItem = {
      normalizedCollocation: savedWord.normalizedText,
      mainTranslation: savedWord.commonData.mainTranslation,
      exampleSentences: savedWord.commonData.exampleSentences.map((ex) => {
        const [german, translation] = ex.split(' - ');
        return { german: german || ex, translation: translation || '' };
      }),
      ...(savedWord.specificData as {
        componentWords: LinguisticCollocationItem['componentWords'];
      }),
    };
    return collocationItem;
  }

  // Handle words
  const baseTranslation: LinguisticWordItem = {
    normalizedWord: savedWord.normalizedText,
    partOfSpeech: [savedWord.partOfSpeech as PartOfSpeech],
    ...savedWord.commonData,
    ...savedWord.specificData,
  };

  return baseTranslation;
};

export const VocabularyItemModal: React.FC<VocabularyItemModalProps> = ({
  isOpen,
  savedWord,
  onClose,
  onWordDeleted,
  allowDelete = true,
}) => {
  const {
    isDeleting,
    showDeleteConfirm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleClose,
  } = useVocabularyItemModal({
    savedWord,
    onClose,
    onWordDeleted,
    allowDelete,
  });

  const translation = useMemo(
    () =>
      savedWord ? convertVocabularyItemToTranslationResult(savedWord) : null,
    [savedWord],
  );

  const { genderColor } = useMemo(() => {
    if (!translation) return { genderColor: undefined };

    const isNoun =
      'partOfSpeech' in translation &&
      translation.partOfSpeech?.includes(PartOfSpeech.NOUN);
    const gender = isNoun
      ? (translation as NounLinguisticItem).gender
      : undefined;
    const genderProps = getGenderProperties(gender);
    const color = genderProps ? `${genderProps.colorScheme}.400` : undefined;

    return { genderColor: color };
  }, [translation]);

  if (!savedWord || !translation) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
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
              {showDeleteConfirm ? (
                <DeleteConfirmation savedWord={savedWord} />
              ) : (
                <>
                  <VocabularyItemContent linguisticWordItem={translation} />
                  <Separator my={4} />
                  <VocabularyItemCollections vocabularyItemId={savedWord.id} />
                </>
              )}
            </Dialog.Body>

            <ModalFooter
              allowDelete={allowDelete}
              showDeleteConfirm={showDeleteConfirm}
              isDeleting={isDeleting}
              onDeleteClick={handleDeleteClick}
              onDeleteConfirm={handleDeleteConfirm}
              onDeleteCancel={handleDeleteCancel}
              onClose={handleClose}
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
