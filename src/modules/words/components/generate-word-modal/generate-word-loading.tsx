import React from 'react';

import { Spinner, Text, VStack } from '@chakra-ui/react';

interface GenerateWordLoadingProps {
  word: string;
}

export const GenerateWordLoading: React.FC<GenerateWordLoadingProps> = ({
  word,
}) => {
  return (
    <VStack
      gap={{ base: 6, md: 4 }}
      py={{ base: 12, md: 8 }}
      px={{ base: 4, md: 0 }}
      align="center"
      justify="center"
      minH={{ base: '200px', md: 'auto' }}
    >
      <Spinner size={{ base: 'xl', md: 'lg' }} color="blue.500" />
      <VStack gap={{ base: 3, md: 2 }} align="center">
        <Text
          fontSize={{ base: 'lg', md: 'md' }}
          fontWeight="medium"
          color="gray.700"
          textAlign="center"
        >
          Translating &quot;{word}&quot;...
        </Text>
        <Text
          fontSize={{ base: 'md', md: 'sm' }}
          color="gray.500"
          textAlign="center"
          lineHeight="relaxed"
        >
          Getting detailed information about this word
        </Text>
      </VStack>
    </VStack>
  );
};
