import { Text, VStack } from '@chakra-ui/react';

import type { VocabularyItem } from '@/modules/vocabulary/vocabulary.types';

interface DeleteConfirmationProps {
  savedWord: VocabularyItem;
}

export const DeleteConfirmation = ({ savedWord }: DeleteConfirmationProps) => {
  return (
    <VStack gap={6} align="center" justify="center" h="full" py={8}>
      <VStack gap={2} align="center" textAlign="center">
        <Text fontSize="xl" fontWeight="bold">
          Are you sure you want to delete this word?
        </Text>
        <Text fontSize="md" color="gray.600">
          <strong>&ldquo;{savedWord.normalizedWord}&rdquo;</strong> will be
          permanently removed from your saved words.
        </Text>
        <Text fontSize="sm" color="gray.500">
          This action cannot be undone.
        </Text>
      </VStack>
    </VStack>
  );
};
