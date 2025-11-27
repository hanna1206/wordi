'use client';

import { useMemo } from 'react';
import { LuCircleCheck } from 'react-icons/lu';

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
import Link from 'next/link';

import { QUALITY_OPTIONS, QualityScore } from '../flashcards.const';

interface PlayPageGameCompleteStateProps {
  totalCards: number;
  qualityScores: Record<string, QualityScore>;
}

interface GameStatistics {
  totalCards: number;
  easyCount: number;
  goodCount: number;
  hardCount: number;
  easyPercentage: number;
  goodPercentage: number;
  hardPercentage: number;
  accuracyRate: number;
}

interface StatRowProps {
  label: string;
  emoji: string;
  count: number;
  percentage: number;
  colorScheme: string;
}

const StatRow = ({ label, emoji, count, percentage }: StatRowProps) => {
  return (
    <HStack
      w="full"
      justify="space-between"
      py={2}
      flexWrap={{ base: 'wrap', sm: 'nowrap' }}
    >
      <HStack gap={2}>
        <Text fontSize={{ base: 'xl', sm: '2xl' }}>{emoji}</Text>
        <Text fontWeight="medium" fontSize={{ base: 'md', sm: 'lg' }}>
          {label}
        </Text>
      </HStack>
      <HStack gap={{ base: 2, sm: 4 }} mt={{ base: 1, sm: 0 }}>
        <HStack gap={1} minW={{ base: '60px', sm: '80px' }} justify="flex-end">
          <Text fontWeight="bold" fontSize={{ base: 'md', sm: 'lg' }}>
            {count}
          </Text>
          <Text color="gray.600" fontSize="xs">
            ({percentage}%)
          </Text>
        </HStack>
        <Box
          w={{ base: '80px', sm: '120px' }}
          h="8px"
          bg="gray.200"
          borderRadius="full"
          overflow="hidden"
        >
          <Box h="full" w={`${percentage}%`} transition="width 0.3s ease" />
        </Box>
      </HStack>
    </HStack>
  );
};

const calculateStatistics = (
  qualityScores: Record<string, QualityScore>,
  totalCards: number,
): GameStatistics => {
  const scores = Object.values(qualityScores);

  const easyCount = scores.filter((s) => s === QualityScore.Easy).length;
  const goodCount = scores.filter((s) => s === QualityScore.Good).length;
  const hardCount = scores.filter((s) => s === QualityScore.Hard).length;

  const easyPercentage = Math.round((easyCount / totalCards) * 100);
  const goodPercentage = Math.round((goodCount / totalCards) * 100);
  const hardPercentage = Math.round((hardCount / totalCards) * 100);
  const accuracyRate = Math.round(((easyCount + goodCount) / totalCards) * 100);

  return {
    totalCards,
    easyCount,
    goodCount,
    hardCount,
    easyPercentage,
    goodPercentage,
    hardPercentage,
    accuracyRate,
  };
};

const getMotivationalMessage = (
  accuracyRate: number,
  easyPercentage: number,
): string => {
  if (easyPercentage === 100) {
    return 'Perfect! Outstanding mastery! 🏆';
  }
  if (accuracyRate > 80) {
    return 'Excellent work! Keep it up! 🌟';
  }
  if (accuracyRate >= 50) {
    return "Good progress! You're learning well! 💪";
  }
  return "Keep practicing - you're improving! 📚";
};

export const PlayPageGameCompleteState = ({
  totalCards,
  qualityScores,
}: PlayPageGameCompleteStateProps) => {
  const statistics = useMemo(
    () => calculateStatistics(qualityScores, totalCards),
    [qualityScores, totalCards],
  );

  const motivationalMessage = useMemo(
    () =>
      getMotivationalMessage(
        statistics.accuracyRate,
        statistics.easyPercentage,
      ),
    [statistics.accuracyRate, statistics.easyPercentage],
  );

  const easyOption = QUALITY_OPTIONS.find(
    (opt) => opt.score === QualityScore.Easy,
  )!;
  const goodOption = QUALITY_OPTIONS.find(
    (opt) => opt.score === QualityScore.Good,
  )!;
  const hardOption = QUALITY_OPTIONS.find(
    (opt) => opt.score === QualityScore.Hard,
  )!;

  return (
    <Flex
      direction="column"
      h="100svh"
      align="center"
      justify="center"
      p={{ base: 3, sm: 4 }}
    >
      <VStack gap={{ base: 4, sm: 6, md: 8 }} maxW="600px" w="full">
        {/* Success Icon */}
        <Box
          as={LuCircleCheck}
          boxSize={{ base: 12, sm: 14, md: 16 }}
          color="green.500"
        />

        {/* Title */}
        <Heading as="h1" size={{ base: 'xl', sm: '2xl' }} textAlign="center">
          Practice Complete!
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
          >
            {motivationalMessage}
          </Text>
        </Box>

        {/* Statistics Card */}
        <Card.Root w="full" variant="outline">
          <Card.Body>
            <VStack gap={4} align="stretch">
              <Heading as="h2" size={{ base: 'sm', sm: 'md' }} mb={2}>
                Your Performance
              </Heading>

              {/* Summary Stats */}
              <HStack justify="space-around" py={3} borderBottomWidth="1px">
                <VStack gap={1}>
                  <Text fontSize="xs" color="gray.600">
                    Total Cards
                  </Text>
                  <Text fontSize={{ base: 'xl', sm: '2xl' }} fontWeight="bold">
                    {statistics.totalCards}
                  </Text>
                </VStack>
                <VStack gap={1}>
                  <Text fontSize="xs" color="gray.600">
                    Accuracy
                  </Text>
                  <Text
                    fontSize={{ base: 'xl', sm: '2xl' }}
                    fontWeight="bold"
                    color="green.600"
                  >
                    {statistics.accuracyRate}%
                  </Text>
                </VStack>
              </HStack>

              {/* Quality Breakdown */}
              <VStack gap={2} pt={2}>
                <StatRow
                  label={easyOption.label}
                  emoji={easyOption.emoji}
                  count={statistics.easyCount}
                  percentage={statistics.easyPercentage}
                  colorScheme={easyOption.colorScheme}
                />
                <StatRow
                  label={goodOption.label}
                  emoji={goodOption.emoji}
                  count={statistics.goodCount}
                  percentage={statistics.goodPercentage}
                  colorScheme={goodOption.colorScheme}
                />
                <StatRow
                  label={hardOption.label}
                  emoji={hardOption.emoji}
                  count={statistics.hardCount}
                  percentage={statistics.hardPercentage}
                  colorScheme={hardOption.colorScheme}
                />
              </VStack>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Navigation Button */}
        <Button asChild size="lg" colorScheme="purple" w="full" maxW="300px">
          <Link href="/">Back to Home</Link>
        </Button>
      </VStack>
    </Flex>
  );
};
