'use client';

import { Box, HStack, Progress, Text, VStack } from '@chakra-ui/react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  correctCount: number;
}

export const ProgressIndicator = ({
  current,
  total,
  correctCount,
}: ProgressIndicatorProps) => {
  const progressPercentage = (current / total) * 100;
  const accuracy = current > 0 ? Math.round((correctCount / current) * 100) : 0;

  return (
    <VStack gap={3} w="full">
      {/* Progress bar */}
      <Box w="full">
        <Progress.Root
          value={progressPercentage}
          size="sm"
          colorScheme="purple"
          borderRadius="full"
        >
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      </Box>

      {/* Stats row */}
      <HStack
        w="full"
        justify="space-between"
        fontSize="sm"
        fontWeight="medium"
        color="gray.700"
      >
        <Text>
          Progress: {current}/{total}
        </Text>
        <Text>
          Correct: {correctCount} ({accuracy}%)
        </Text>
      </HStack>
    </VStack>
  );
};
