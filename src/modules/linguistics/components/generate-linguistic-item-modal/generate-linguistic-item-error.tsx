import React from 'react';

import { Box, Button, Text, VStack } from '@chakra-ui/react';

interface GenerateLinguisticItemErrorProps {
  error: string;
  onRetry?: () => void;
}

export const GenerateLinguisticItemError: React.FC<
  GenerateLinguisticItemErrorProps
> = ({ error, onRetry }) => {
  return (
    <VStack
      gap={{ base: 4, md: 4 }}
      py={{ base: 8, md: 4 }}
      px={{ base: 4, md: 0 }}
      align="center"
      justify="center"
      minH={{ base: '200px', md: 'auto' }}
    >
      {/* Error icon */}
      <Box
        w={{ base: '48px', md: '40px' }}
        h={{ base: '48px', md: '40px' }}
        bg="red.100"
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize={{ base: '24px', md: '20px' }} color="red.500">
          ⚠️
        </Text>
      </Box>

      <Text
        fontSize={{ base: 'lg', md: 'md' }}
        fontWeight="medium"
        color="red.600"
        textAlign="center"
        lineHeight="relaxed"
        maxW="300px"
      >
        {error}
      </Text>

      {onRetry && (
        <Button onClick={onRetry} size="md" mt={2}>
          Try Again
        </Button>
      )}
    </VStack>
  );
};
