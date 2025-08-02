'use client';

import { Box, Flex, Text } from '@chakra-ui/react';

import { QUALITY_OPTIONS, QualityScore } from '../flash-cards-game.const';

interface PlayPageQualityFeedbackButtonsProps {
  onQualitySelect: (qualityScore: QualityScore) => void;
}

export const PlayPageQualityFeedbackButtons = ({
  onQualitySelect,
}: PlayPageQualityFeedbackButtonsProps) => {
  const getButtonStyles = (option: (typeof QUALITY_OPTIONS)[number]) => {
    const baseStyles = {
      hard: {
        bg: 'red.50',
        borderColor: 'red.200',
        color: 'red.700',
        _hover: {
          bg: 'red.100',
          borderColor: 'red.300',
          transform: 'translateY(-1px)',
        },
        _active: { bg: 'red.200', transform: 'translateY(0)' },
      },
      good: {
        bg: 'orange.50',
        borderColor: 'orange.200',
        color: 'orange.700',
        _hover: {
          bg: 'orange.100',
          borderColor: 'orange.300',
          transform: 'translateY(-1px)',
        },
        _active: { bg: 'orange.200', transform: 'translateY(0)' },
      },
      easy: {
        bg: 'green.50',
        borderColor: 'green.200',
        color: 'green.700',
        _hover: {
          bg: 'green.100',
          borderColor: 'green.300',
          transform: 'translateY(-1px)',
        },
        _active: { bg: 'green.200', transform: 'translateY(0)' },
      },
    };

    return option.colorScheme === 'red'
      ? baseStyles.hard
      : option.colorScheme === 'yellow'
        ? baseStyles.good
        : baseStyles.easy;
  };

  return (
    <Flex w="full" maxW="lg" mx="auto" justify="center" gap={3} mt={-2}>
      {QUALITY_OPTIONS.map((option) => {
        const styles = getButtonStyles(option);
        return (
          <Box
            key={option.score}
            as="button"
            onClick={() => onQualitySelect(option.score)}
            flex={1}
            maxW="110px"
            borderRadius="xl"
            border="2px solid"
            p={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            transition="all 0.2s ease"
            boxShadow="sm"
            _focus={{
              outline: 'none',
              boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.15)',
            }}
            {...styles}
          >
            <Text fontSize="2xl" mb={2} lineHeight={1}>
              {option.emoji}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="600"
              textAlign="center"
              lineHeight={1.2}
            >
              {option.label}
            </Text>
          </Box>
        );
      })}
    </Flex>
  );
};
