'use client';

import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';

import { SavedWord } from '@/modules/words-persistence/words-persistence.types';

interface PlayPageGameCompleteStateProps {
  needsReviewWords: SavedWord[];
}

export const PlayPageGameCompleteState = ({
  needsReviewWords,
}: PlayPageGameCompleteStateProps) => {
  return (
    <Flex direction="column" h="100svh" align="center" justify="center" p={4}>
      <Heading as="h2" size="lg">
        Practice Complete!
      </Heading>
      {needsReviewWords.length > 0 ? (
        <Box mt={4} textAlign="center">
          <Text>You should review these words:</Text>
          <Flex direction="column" gap={2} mt={2}>
            {needsReviewWords.map((word) => (
              <Text key={word.id}>
                {word.normalizedWord} - {word.commonData.mainTranslation}
              </Text>
            ))}
          </Flex>
        </Box>
      ) : (
        <Text mt={4}>Great job! You knew all the words.</Text>
      )}
      <Link href="/flash-cards-game" passHref>
        <Button as="a" mt={8} colorScheme="blue">
          Play Again
        </Button>
      </Link>
    </Flex>
  );
};
