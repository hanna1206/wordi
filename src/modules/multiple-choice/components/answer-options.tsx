'use client';

import { Box, Button, VStack } from '@chakra-ui/react';

import type { AnswerOptionsProps } from '../multiple-choice.types';

export const AnswerOptions = ({
  options,
  correctAnswer,
  selectedAnswer,
  onSelect,
  showFeedback,
}: AnswerOptionsProps) => {
  const getButtonVariant = (option: string) => {
    if (!showFeedback) {
      return selectedAnswer === option ? 'solid' : 'outline';
    }

    // Show feedback
    if (option === correctAnswer) {
      return 'solid';
    }

    if (option === selectedAnswer && option !== correctAnswer) {
      return 'solid';
    }

    return 'outline';
  };

  const getButtonColorScheme = (option: string) => {
    if (!showFeedback) {
      return selectedAnswer === option ? 'purple' : 'gray';
    }

    // Show feedback
    if (option === correctAnswer) {
      return 'green';
    }

    if (option === selectedAnswer && option !== correctAnswer) {
      return 'red';
    }

    return 'gray';
  };

  const isDisabled = () => {
    // Disable all buttons after selection
    return selectedAnswer !== null;
  };

  return (
    <VStack gap={3} w="full">
      {options.map((option, index) => (
        <Button
          key={`${option}-${index}`}
          onClick={() => onSelect(option)}
          disabled={isDisabled()}
          variant={getButtonVariant(option)}
          colorScheme={getButtonColorScheme(option)}
          size="lg"
          w="full"
          h="auto"
          minH="60px"
          py={4}
          px={6}
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight="semibold"
          textAlign="center"
          whiteSpace="normal"
          wordBreak="break-word"
          transition="all 0.2s ease"
          _hover={{
            transform: selectedAnswer === null ? 'scale(1.02)' : 'none',
            boxShadow: selectedAnswer === null ? 'md' : 'none',
          }}
          _active={{
            transform: selectedAnswer === null ? 'scale(0.98)' : 'none',
          }}
        >
          <Box as="span" display="flex" alignItems="center" gap={2}>
            <Box
              as="span"
              fontSize="sm"
              fontWeight="bold"
              opacity={0.7}
              minW="24px"
            >
              {String.fromCharCode(65 + index)}.
            </Box>
            <Box as="span">{option}</Box>
          </Box>
        </Button>
      ))}
    </VStack>
  );
};
