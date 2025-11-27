import React from 'react';

import { Alert, Spinner, Text, VStack } from '@chakra-ui/react';

interface GenerateLinguisticItemLoadingProps {
  word: string;
}

export const GenerateLinguisticItemLoading: React.FC<
  GenerateLinguisticItemLoadingProps
> = ({ word }) => {
  return (
    <VStack
      gap={6}
      align="center"
      justify="center"
      w="full"
      maxW="400px"
      mx="auto"
    >
      <Spinner size="xl" borderWidth="4px" />
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

      <Alert.Root status="info" w="full" mt={4} mb={8}>
        <Alert.Indicator />
        <VStack align="start" gap={3} fontSize="sm">
          <Alert.Title>
            AI-powered linguistic analysis and translation✨
          </Alert.Title>
          <VStack align="start" gap={1} fontSize="sm" color="gray.600">
            <Text fontWeight="medium" color="gray.700">
              💡 Important to know:
            </Text>
            <Text>
              • AI can sometimes make mistakes or &quot;hallucinate&quot;
            </Text>
            <Text>• Double-check the result, especially grammar details</Text>
            <Text>• Typos in the word can lead to inaccuracies</Text>
            <Text>• Use the &quot;Regenerate&quot; button to try again</Text>
          </VStack>
        </VStack>
      </Alert.Root>
    </VStack>
  );
};
