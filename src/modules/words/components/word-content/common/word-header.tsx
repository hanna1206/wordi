import React from 'react';

import { HStack, Text, VStack } from '@chakra-ui/react';

import type { Gender } from '@/modules/words/words.types';

interface WordHeaderProps {
  normalizedWord: string;
  mainTranslation: string;
  partOfSpeech?: string[];
  additionalInfo?: string; // For verb regular/irregular info
  gender?: Gender;
}

export const WordHeader: React.FC<WordHeaderProps> = ({
  normalizedWord,
  mainTranslation,
  partOfSpeech,
  additionalInfo,
}) => {
  return (
    <VStack gap={2} align="start">
      <HStack gap={2} align="baseline">
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          color="gray.800"
          fontWeight="semibold"
        >
          {normalizedWord}
        </Text>
        {partOfSpeech && partOfSpeech.length > 0 && (
          <Text
            as="span"
            fontSize={{ base: 'sm', md: 'md' }}
            color="gray.500"
            fontStyle="italic"
          >
            {partOfSpeech.join(', ')}
            {additionalInfo && ` / ${additionalInfo}`}
          </Text>
        )}
      </HStack>
      <Text
        fontSize={{ base: 'xl', md: '2xl' }}
        fontWeight="bold"
        color="blue.600"
      >
        {mainTranslation}
      </Text>
    </VStack>
  );
};
