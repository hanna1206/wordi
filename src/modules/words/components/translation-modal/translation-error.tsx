import React from 'react';

import { Text, VStack } from '@chakra-ui/react';

interface TranslationErrorProps {
  error: string;
}

export const TranslationError: React.FC<TranslationErrorProps> = ({
  error,
}) => {
  return (
    <VStack gap={{ base: 2, md: 4 }} py={{ base: 2, md: 4 }}>
      <Text
        fontSize={{ base: 'sm', md: 'md' }}
        color="red.500"
        textAlign="center"
      >
        {error}
      </Text>
    </VStack>
  );
};
