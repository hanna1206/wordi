import React from 'react';

import { Text, VStack } from '@chakra-ui/react';

interface GenerateWordErrorProps {
  error: string;
}

export const GenerateWordError: React.FC<GenerateWordErrorProps> = ({
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
