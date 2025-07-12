import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

import type { SavedWord } from '@/modules/words-persistence/words-persistence.types';

interface SidebarContentProps {
  savedWords: SavedWord[];
  isLoadingWords: boolean;
}

export const SidebarContent = ({
  savedWords,
  isLoadingWords,
}: SidebarContentProps) => {
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
  );
};
