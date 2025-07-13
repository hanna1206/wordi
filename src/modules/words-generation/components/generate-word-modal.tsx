import React, { useState } from 'react';

import { Button, Dialog, Portal } from '@chakra-ui/react';

import { toaster } from '@/components/toaster';
import { GenerateWordError } from '@/modules/words-generation/components/generate-word-modal/generate-word-error';
import { GenerateWordLoaded } from '@/modules/words-generation/components/generate-word-modal/generate-word-loaded';
import { GenerateWordLoading } from '@/modules/words-generation/components/generate-word-modal/generate-word-loading';
import { getGenderProperties } from '@/modules/words-generation/utils/get-gender-properties';
import { PartOfSpeech } from '@/modules/words-generation/words-generation.const';
import type {
  TranslationNounResult,
  TranslationResult,
} from '@/modules/words-generation/words-generation.types';
import { saveWordForLearning } from '@/modules/words-persistence/words-persistence.actions';

interface GenerateWordModalProps {
  isOpen: boolean;
  word: string;
  isLoading: boolean;
  error: string | null;
  translation: TranslationResult | null;
  onClose: () => void;
  onRegenerate: (word: string) => void;
  onWordSaved: () => void;
}

export const GenerateWordModal: React.FC<GenerateWordModalProps> = ({
  isOpen,
  word,
  isLoading,
  error,
  translation,
  onClose,
  onRegenerate,
  onWordSaved,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const isNoun = translation?.partOfSpeech?.includes(PartOfSpeech.NOUN);
  const gender = isNoun
    ? (translation as TranslationNounResult).gender
    : undefined;
  const genderProps = getGenderProperties(gender);
  const genderColor = genderProps
    ? `${genderProps.colorScheme}.400`
    : undefined;

  const handleSaveWord = async () => {
    if (!translation) return;

    setIsSaving(true);
    try {
      const result = await saveWordForLearning({
        translationResult: translation,
      });

      if (result.success) {
        toaster.create({
          title: 'Word saved!',
          description: 'Word has been saved for learning',
          type: 'success',
          duration: 3000,
        });
        onWordSaved();
        onClose();
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
            h={{ base: '100dvh', md: 'auto' }}
            maxH={{ base: '100dvh', md: '80vh' }}
            m={0}
            bg="white"
            shadow={{ base: '0 -4px 20px rgba(0,0,0,0.15)', md: 'lg' }}
            overflow="hidden"
            position="relative"
            css={{
              '@supports not (height: 100dvh)': {
                height: { base: '100dvh', md: 'auto' },
                maxHeight: { base: '100dvh', md: '80vh' },
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
                <GenerateWordLoading word={word} />
              ) : error ? (
                <GenerateWordError error={error} />
              ) : translation ? (
                <GenerateWordLoaded
                  translation={translation}
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
              {translation && (
                <Button
                  size={{ base: 'lg', md: 'lg' }}
                  h={{ base: '48px', md: '44px' }}
                  borderRadius={{ base: 'xl', md: 'md' }}
                  w={{ base: 'full', md: 'auto' }}
                  onClick={handleSaveWord}
                  loading={isSaving}
                  disabled={isSaving}
                  flex={{ base: 'none', md: '1' }}
                >
                  {isSaving ? 'Saving...' : 'Save for learning'}
                </Button>
              )}
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onClose}
                  w={{ base: 'full', md: 'auto' }}
                  size={{ base: 'lg', md: 'lg' }}
                  h={{ base: '48px', md: '44px' }}
                  px={{ base: 6, md: 8 }}
                  borderRadius={{ base: 'xl', md: 'md' }}
                  fontWeight="medium"
                  border="1px solid"
                  borderColor="gray.200"
                  bg="white"
                  _hover={{
                    bg: 'gray.100',
                    borderColor: 'gray.300',
                  }}
                  _active={{
                    bg: 'gray.100',
                  }}
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
