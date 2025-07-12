import { useState } from 'react';

import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

import type { SavedWord } from '@/modules/words-persistence/words-persistence.types';

import { SavedWordModal } from './saved-word-modal';

interface SidebarContentProps {
  savedWords: SavedWord[];
  isLoadingWords: boolean;
}

export const SidebarContent = ({
  savedWords,
  isLoadingWords,
}: SidebarContentProps) => {
  const [selectedWord, setSelectedWord] = useState<SavedWord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWordClick = (word: SavedWord) => {
    setSelectedWord(word);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedWord(null);
  };

  if (isLoadingWords) {
    return (
      <Box p={4}>
        <VStack gap={2}>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.600">
            Loading your words...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <>
      <Box p={4}>
        <VStack gap={4} align="stretch">
          <Text fontSize="lg" fontWeight="semibold">
            Your Saved Words
          </Text>

          {savedWords.length === 0 ? (
            <Text fontSize="sm" color="gray.600">
              No saved words yet. Generate and save some words to see them here!
            </Text>
          ) : (
            <VStack gap={2} align="stretch">
              {savedWords.map((word) => (
                <Box
                  key={word.id}
                  p={3}
                  bg="gray.50"
                  _dark={{ bg: 'gray.700', borderColor: 'gray.600' }}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    bg: 'gray.100',
                    _dark: { bg: 'gray.600' },
                    transform: 'translateY(-1px)',
                    shadow: 'sm',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  onClick={() => handleWordClick(word)}
                >
                  <Text fontWeight="medium" fontSize="sm">
                    {word.normalized_word}
                  </Text>
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    _dark={{ color: 'gray.400' }}
                  >
                    {word.common_data.mainTranslation}
                  </Text>
                </Box>
              ))}
            </VStack>
          )}
        </VStack>
      </Box>

      <SavedWordModal
        isOpen={isModalOpen}
        savedWord={selectedWord}
        onClose={handleModalClose}
      />
    </>
  );
};
