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
      <Box
        p={2}
        pr={4}
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
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
      <Box
        pt={2}
        pb={8}
        pl={4}
        flex="1"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        <Box mb={4} flexShrink={0}>
          <Text fontSize="md" fontWeight="semibold">
            Your Saved Words
          </Text>
        </Box>

        {savedWords.length === 0 ? (
          <Box
            flex="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            pr={4}
          >
            <Text fontSize="sm" color="gray.600" textAlign="center">
              No saved words yet. Generate and save some words to see them here!
            </Text>
          </Box>
        ) : (
          <Box flex="1" overflowY="auto" pr={3}>
            <VStack gap={1} align="stretch">
              {savedWords.map((word) => (
                <Box
                  key={word.id}
                  p={2}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                  bg="white"
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
