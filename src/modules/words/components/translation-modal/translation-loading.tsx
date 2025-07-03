import React from 'react';

import { Spinner, Text, VStack } from '@chakra-ui/react';

interface TranslationLoadingProps {
  word: string;
}

export const TranslationLoading: React.FC<TranslationLoadingProps> = ({
  word,
}) => {
  return (
    <VStack gap={{ base: 2, md: 4 }} py={{ base: 4, md: 8 }}>
      <Spinner size={{ base: 'md', md: 'lg' }} color="blue.500" />
      <Text
        fontSize={{ base: 'sm', md: 'md' }}
        color="gray.500"
        textAlign="center"
      >
        Translating &quot;{word}&quot;...
      </Text>
      <Text
        fontSize={{ base: 'xs', md: 'sm' }}
        color="gray.400"
        textAlign="center"
      >
        Getting detailed information about this word
      </Text>
    </VStack>
  );
};
