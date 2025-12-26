'use client';

import { Box, Card, Heading, Text } from '@chakra-ui/react';

interface QuestionCardProps {
  question: string;
  currentQuestion: number;
  totalQuestions: number;
}

export const QuestionCard = ({
  question,
  currentQuestion,
  totalQuestions,
}: QuestionCardProps) => {
  return (
    <Card.Root w="full" variant="outline" bg="gray.50">
      <Card.Body>
        <Box textAlign="center" py={{ base: 4, md: 6 }}>
          {/* Question number indicator */}
          <Text
            fontSize="sm"
            color="gray.600"
            fontWeight="medium"
            mb={4}
            letterSpacing="wide"
          >
            Question {currentQuestion} of {totalQuestions}
          </Text>

          {/* Question text in native language */}
          <Heading
            as="h2"
            size={{ base: 'xl', md: '2xl' }}
            color="gray.800"
            fontWeight="bold"
            lineHeight="1.3"
            wordBreak="break-word"
            hyphens="auto"
            px={{ base: 2, md: 4 }}
          >
            {question}
          </Heading>

          {/* Instruction text */}
          <Text fontSize="sm" color="gray.600" mt={4} fontStyle="italic">
            Select the correct translation
          </Text>
        </Box>
      </Card.Body>
    </Card.Root>
  );
};
