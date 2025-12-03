'use client';

import { useMemo } from 'react';
import { LuCircleCheck, LuRotateCcw, LuX } from 'react-icons/lu';

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';

import type { ResultsSummaryProps } from '../multiple-choice.types';

interface StatRowProps {
  label: string;
  icon: React.ElementType;
  count: number;
  percentage: number;
  colorScheme: string;
}

const StatRow = ({
  label,
  icon,
  count,
  percentage,
  colorScheme,
}: StatRowProps) => {
  const bgColor = `${colorScheme}.50`;
  const borderColor = `${colorScheme}.200`;
  const textColor = `${colorScheme}.700`;

  return (
    <HStack
      w="full"
      justify="space-between"
      py={3}
      px={4}
      borderRadius="md"
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
    >
      <HStack gap={3}>
        <Box as={icon} boxSize={5} color={textColor} />
        <Text
          fontWeight="medium"
          fontSize={{ base: 'md', sm: 'lg' }}
          color={textColor}
        >
          {label}
        </Text>
      </HStack>
      <HStack gap={2}>
        <Text
          fontWeight="bold"
          fontSize={{ base: 'lg', sm: 'xl' }}
          color={textColor}
        >
          {count}
        </Text>
        <Text color="gray.600" fontSize="sm">
          ({percentage}%)
        </Text>
      </HStack>
    </HStack>
  );
};

const getMotivationalMessage = (accuracy: number): string => {
  if (accuracy === 100) {
    return 'Perfect score! Outstanding! 🏆';
  }
  if (accuracy >= 90) {
    return 'Excellent work! Keep it up! 🌟';
  }
  if (accuracy >= 70) {
    return "Great job! You're doing well! 💪";
  }
  if (accuracy >= 50) {
    return 'Good effort! Keep practicing! 📚';
  }
  return 'Keep going! Practice makes perfect! 🎯';
};

export const ResultsSummary = ({
  results,
  onRestart,
  onExit,
}: ResultsSummaryProps) => {
  const correctPercentage = Math.round(
    (results.correctAnswers / results.totalQuestions) * 100,
  );
  const incorrectPercentage = Math.round(
    (results.incorrectAnswers / results.totalQuestions) * 100,
  );

  const motivationalMessage = useMemo(
    () => getMotivationalMessage(results.accuracy),
    [results.accuracy],
  );

  const durationInSeconds = Math.round(results.duration / 1000);
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  const durationText = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <Flex
      direction="column"
      minH="100svh"
      align="center"
      justify="center"
      p={{ base: 3, sm: 4 }}
      py={{ base: 6, sm: 8 }}
    >
      <VStack gap={{ base: 4, sm: 6 }} maxW="600px" w="full">
        {/* Success Icon */}
        <Box
          as={LuCircleCheck}
          boxSize={{ base: 12, sm: 14, md: 16 }}
          color="green.500"
        />

        {/* Title */}
        <Heading as="h1" size={{ base: 'xl', sm: '2xl' }} textAlign="center">
          Exercise Complete!
        </Heading>

        {/* Motivational Message */}
        <Box
          bg="purple.50"
          px={{ base: 4, sm: 6 }}
          py={{ base: 2, sm: 3 }}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="purple.200"
        >
          <Text
            fontSize={{ base: 'md', sm: 'lg' }}
            fontWeight="medium"
            textAlign="center"
            color="purple.800"
          >
            {motivationalMessage}
          </Text>
        </Box>

        {/* Statistics Card */}
        <Card.Root w="full" variant="outline">
          <Card.Body>
            <VStack gap={4} align="stretch">
              <Heading as="h2" size={{ base: 'sm', sm: 'md' }} mb={2}>
                Your Results
              </Heading>

              {/* Summary Stats */}
              <HStack justify="space-around" py={3} borderBottomWidth="1px">
                <VStack gap={1}>
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    textTransform="uppercase"
                  >
                    Total
                  </Text>
                  <Text fontSize={{ base: 'xl', sm: '2xl' }} fontWeight="bold">
                    {results.totalQuestions}
                  </Text>
                </VStack>
                <VStack gap={1}>
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    textTransform="uppercase"
                  >
                    Accuracy
                  </Text>
                  <Text
                    fontSize={{ base: 'xl', sm: '2xl' }}
                    fontWeight="bold"
                    color="green.600"
                  >
                    {results.accuracy}%
                  </Text>
                </VStack>
                <VStack gap={1}>
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    textTransform="uppercase"
                  >
                    Time
                  </Text>
                  <Text fontSize={{ base: 'xl', sm: '2xl' }} fontWeight="bold">
                    {durationText}
                  </Text>
                </VStack>
              </HStack>

              {/* Correct/Incorrect Breakdown */}
              <VStack gap={3} pt={2}>
                <StatRow
                  label="Correct"
                  icon={LuCircleCheck}
                  count={results.correctAnswers}
                  percentage={correctPercentage}
                  colorScheme="green"
                />
                <StatRow
                  label="Incorrect"
                  icon={LuX}
                  count={results.incorrectAnswers}
                  percentage={incorrectPercentage}
                  colorScheme="red"
                />
              </VStack>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Action Buttons */}
        <VStack gap={3} w="full" maxW="400px">
          <Button onClick={onRestart} size="lg" colorScheme="purple" w="full">
            <HStack gap={2}>
              <LuRotateCcw />
              <Text>Practice Again</Text>
            </HStack>
          </Button>
          <Button
            onClick={onExit}
            size="lg"
            variant="outline"
            colorScheme="gray"
            w="full"
          >
            Back to Menu
          </Button>
        </VStack>
      </VStack>
    </Flex>
  );
};
