import React from 'react';

import { Dialog, Portal } from '@chakra-ui/react';

import { getGenderProperties } from '@/modules/words-generation/utils/get-gender-properties';
import { PartOfSpeech } from '@/modules/words-generation/words-generation.const';
import type {
  TranslationNounResult,
  TranslationResult,
} from '@/modules/words-generation/words-generation.types';
import type { SavedWord } from '@/modules/words-persistence/words-persistence.types';

import { useSavedWordModal } from '../../hooks/use-saved-word-modal';
import { SavedWordContent } from '../saved-word-content';
import { DeleteConfirmation } from './delete-confirmation';
import { ModalFooter } from './modal-footer';

interface SavedWordModalProps {
  isOpen: boolean;
  savedWord: SavedWord | null;
  onClose: () => void;
  onWordDeleted: () => void;
}

const convertSavedWordToTranslationResult = (
  savedWord: SavedWord,
): TranslationResult => {
  const baseTranslation: TranslationResult = {
    normalizedWord: savedWord.normalized_word,
    partOfSpeech: [savedWord.part_of_speech as PartOfSpeech],
    ...savedWord.common_data,
    ...savedWord.part_specific_data,
  };

  return baseTranslation;
};

export const SavedWordModal: React.FC<SavedWordModalProps> = ({
  isOpen,
  savedWord,
  onClose,
  onWordDeleted,
}) => {
  const {
    isDeleting,
    showDeleteConfirm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
  } = useSavedWordModal({ savedWord, onClose, onWordDeleted });

  if (!savedWord) return null;

  const translation = convertSavedWordToTranslationResult(savedWord);
  const isNoun = translation.partOfSpeech?.includes(PartOfSpeech.NOUN);
  const gender = isNoun
    ? (translation as TranslationNounResult).gender
    : undefined;
  const genderProps = getGenderProperties(gender);
  const genderColor = genderProps
    ? `${genderProps.colorScheme}.400`
    : undefined;

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
                <SavedWordContent translation={translation} />
              )}
            </Dialog.Body>

            <ModalFooter
              showDeleteConfirm={showDeleteConfirm}
              isDeleting={isDeleting}
              onDeleteClick={handleDeleteClick}
              onDeleteConfirm={handleDeleteConfirm}
              onDeleteCancel={handleDeleteCancel}
              onClose={onClose}
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
