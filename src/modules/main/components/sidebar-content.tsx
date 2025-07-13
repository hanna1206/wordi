import { useState } from 'react';

import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

import type { SavedWord } from '@/modules/words-persistence/words-persistence.types';

import { SavedWordModal } from './saved-word-modal';

interface SidebarContentProps {
  savedWords: SavedWord[];
  isLoadingWords: boolean;
  onWordDeleted: () => void;
}

export const SidebarContent = ({
  savedWords,
  isLoadingWords,
  onWordDeleted,
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
      <Box p={2}>
        <VStack gap={1}>
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
      <Box p={2} h="full" display="flex" flexDirection="column">
        <VStack gap={2} align="stretch" h="full">
          <Text fontSize="md" fontWeight="semibold">
            Your Saved Words
          </Text>

          {savedWords.length === 0 ? (
            <Text fontSize="sm" color="gray.600">
              No saved words yet. Generate and save some words to see them here!
            </Text>
          ) : (
            <Box flex="1" overflowY="auto" pr={1}>
              <VStack gap={1} align="stretch">
                {savedWords.map((word) => (
                  <Box
                    key={word.id}
                    p={2}
                    bg="gray.50"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.200"
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      bg: 'gray.100',
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
                    <Text fontSize="xs" color="gray.600">
                      {word.common_data.mainTranslation}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>

      <SavedWordModal
        isOpen={isModalOpen}
        savedWord={selectedWord}
        onClose={handleModalClose}
        onWordDeleted={onWordDeleted}
      />
    </>
  );
};
