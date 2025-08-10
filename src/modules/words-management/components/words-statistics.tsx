'use client';

import { FiBook, FiClock, FiTarget, FiTrendingUp } from 'react-icons/fi';

import { Box, Card, Grid, HStack, Text, VStack } from '@chakra-ui/react';

import { WORD_STATUS_CONFIG } from '../words-management.const';
import type { WordsStatistics } from '../words-management.types';

interface WordsStatisticsProps {
  statistics: WordsStatistics;
}

export const WordsStatisticsComponent = ({
  statistics,
}: WordsStatisticsProps) => {
  return (
    <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4} mb={6}>
      {/* Total Words */}
      <Card.Root>
        <Card.Body>
          <HStack justify="space-between">
            <VStack align="start" gap={1}>
              <Text fontSize="sm" color="gray.600">
                Total Words
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {statistics.totalWords}
              </Text>
            </VStack>
            <Box color="blue.500" fontSize="2xl">
              <FiBook />
            </Box>
          </HStack>
        </Card.Body>
      </Card.Root>

      {/* Due Today */}
      <Card.Root>
        <Card.Body>
          <HStack justify="space-between">
            <VStack align="start" gap={1}>
              <Text fontSize="sm" color="gray.600">
                Due Today
              </Text>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={
                  statistics.wordsDueTodayCount > 0 ? 'orange.600' : 'green.600'
                }
              >
                {statistics.wordsDueTodayCount}
              </Text>
            </VStack>
            <Box color="orange.500" fontSize="2xl">
              <FiClock />
            </Box>
          </HStack>
        </Card.Body>
      </Card.Root>

      {/* Success Rate */}
      <Card.Root>
        <Card.Body>
          <HStack justify="space-between">
            <VStack align="start" gap={1}>
              <Text fontSize="sm" color="gray.600">
                Success Rate
              </Text>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={
                  statistics.overallSuccessRate >= 80
                    ? 'green.600'
                    : statistics.overallSuccessRate >= 60
                      ? 'yellow.600'
                      : 'red.600'
                }
              >
                {statistics.overallSuccessRate.toFixed(0)}%
              </Text>
            </VStack>
            <Box color="green.500" fontSize="2xl">
              <FiTarget />
            </Box>
          </HStack>
        </Card.Body>
      </Card.Root>

      {/* Current Streak */}
      <Card.Root>
        <Card.Body>
          <HStack justify="space-between">
            <VStack align="start" gap={1}>
              <Text fontSize="sm" color="gray.600">
                Current Streak
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {statistics.currentStreak} days
              </Text>
            </VStack>
            <Box color="purple.500" fontSize="2xl">
              <FiTrendingUp />
            </Box>
          </HStack>
        </Card.Body>
      </Card.Root>

      {/* Status Breakdown */}
      <Card.Root gridColumn="span 2">
        <Card.Body>
          <Text fontSize="sm" color="gray.600" mb={3}>
            Words by Status
          </Text>
          <Grid templateColumns="repeat(5, 1fr)" gap={4}>
            {Object.entries(statistics.wordsByStatus).map(([status, count]) => {
              const config =
                WORD_STATUS_CONFIG[status as keyof typeof WORD_STATUS_CONFIG];
              return (
                <VStack key={status} gap={1}>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={`${config.color}.600`}
                  >
                    {count}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {config.label}
                  </Text>
                </VStack>
              );
            })}
          </Grid>
        </Card.Body>
      </Card.Root>
    </Grid>
  );
};
