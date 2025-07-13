import React from 'react';

import { Alert, Spinner, Text, VStack } from '@chakra-ui/react';

interface GenerateWordLoadingProps {
  word: string;
}

export const GenerateWordLoading: React.FC<GenerateWordLoadingProps> = ({
  word,
}) => {
  return (
    <VStack
      gap={6}
      align="center"
      justify="center"
      w="full"
      maxW="400px"
      mx="auto"
    >
      <Spinner size="xl" color="blue.500" borderWidth="4px" />
      <VStack gap={2} align="center">
        <Text
          fontSize="lg"
          fontWeight="medium"
          color="gray.700"
          textAlign="center"
        >
          Translating &quot;{word}&quot;...
        </Text>
      </VStack>

      <Alert.Root status="info" w="full" mt={4} mb={2}>
        <Alert.Indicator />
        <VStack align="start" gap={2} fontSize="sm">
          <Alert.Title>
            AI-powered linguistic analysis and translation✨
          </Alert.Title>
          <VStack align="start" gap={1} fontSize="sm">
            <Text>• AI-generated content - double-check if needed</Text>
            <Text>• Hallucinating? Check for typos in your input</Text>
            <Text>• Use &quot;Regenerate&quot; for different results</Text>
          </VStack>
        </VStack>
      </Alert.Root>
    </VStack>
  );
};
