'use client';

import { Button, Flex, Text } from '@chakra-ui/react';

import { QUALITY_OPTIONS, QualityScore } from '../flash-cards-game.const';

interface PlayPageQualityFeedbackButtonsProps {
  onQualitySelect: (qualityScore: QualityScore) => void;
}

export const PlayPageQualityFeedbackButtons = ({
  onQualitySelect,
}: PlayPageQualityFeedbackButtonsProps) => {
  return (
    <Flex w="full" maxW="lg" mx="auto" justify="center" gap={4} mt={4}>
      {QUALITY_OPTIONS.map((option) => (
        <Button
          key={option.score}
          colorScheme={option.colorScheme}
          onClick={() => onQualitySelect(option.score)}
          flex={1}
          maxW="120px"
          display="flex"
          flexDirection="column"
          height="auto"
          py={3}
          px={2}
        >
          <Text fontSize="xl" mb={1}>
            {option.emoji}
          </Text>
          <Text fontSize="sm" fontWeight="semibold">
            {option.label}
          </Text>
        </Button>
      ))}
    </Flex>
  );
};
