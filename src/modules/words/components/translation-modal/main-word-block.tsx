import React from 'react';

import { HStack, Text, VStack } from '@chakra-ui/react';

import type { TranslationResult } from '@/modules/words/words.types';

interface MainWordBlockProps {
  translation: TranslationResult;
}

export const MainWordBlock: React.FC<MainWordBlockProps> = ({
  translation,
}) => {
  return (
    <VStack gap={2} align="start">
      <HStack gap={2} align="baseline">
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          color="gray.800"
          fontWeight="semibold"
        >
          {translation.normalizedWord}
        </Text>
        {translation.partOfSpeech && translation.partOfSpeech.length > 0 && (
          <Text
            as="span"
            fontSize={{ base: 'sm', md: 'md' }}
            color="gray.500"
            fontStyle="italic"
          >
            {translation.partOfSpeech.join(', ')}
          </Text>
        )}
      </HStack>
      <Text
        fontSize={{ base: 'xl', md: '2xl' }}
        fontWeight="bold"
        color="blue.600"
      >
        {translation.mainTranslation}
      </Text>
    </VStack>
  );
};
