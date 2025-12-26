'use client';

import { Box, Button, VStack } from '@chakra-ui/react';

interface AnswerOptionsProps {
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  showFeedback: boolean;
}

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

    // Show feedback - use bright colors
    if (option === correctAnswer) {
      return 'green';
    }

    if (option === selectedAnswer && option !== correctAnswer) {
      return 'red';
    }

    return 'gray';
  };

  const getButtonStyles = (option: string) => {
    if (!showFeedback) {
      return {};
    }

    // Add explicit background colors for feedback
    if (option === correctAnswer) {
      return {
        bg: 'green.500',
        color: 'white',
        borderColor: 'green.600',
        _hover: { bg: 'green.500' },
      };
    }

    if (option === selectedAnswer && option !== correctAnswer) {
      return {
        bg: 'red.500',
        color: 'white',
        borderColor: 'red.600',
        _hover: { bg: 'red.500' },
      };
    }

    return {
      opacity: 0.5,
    };
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
          {...getButtonStyles(option)}
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
