'use client';

import { useEffect, useState } from 'react';

import { Box, Button, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { SavedWord } from '@/modules/words-persistence/words-persistence.types';

import { getFlashCardsWords } from '../actions/flash-cards-game.actions';
import { FlashCard } from '../components/flash-card';
import { GameMode } from '../flash-cards-game.const';

export const FlashCardsPlayPage = () => {
  const searchParams = useSearchParams();
  const [words, setWords] = useState<SavedWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [knewWords, setKnewWords] = useState<SavedWord[]>([]);
  const [needsReviewWords, setNeedsReviewWords] = useState<SavedWord[]>([]);
  const [isGameFinished, setIsGameFinished] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      const mode = searchParams.get('mode') as GameMode | null;
      const limit = searchParams.get('limit');

      if (!mode || !limit) {
        setError('Invalid game parameters.');
        setIsLoading(false);
        return;
      }

      const limitNumber = parseInt(limit, 10);

      if (isNaN(limitNumber)) {
        setError('Invalid limit parameter.');
        setIsLoading(false);
        return;
      }

      const result = await getFlashCardsWords({ mode, limit: limitNumber });

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setWords(result.data);
      }
      setIsLoading(false);
    };

    fetchWords();
  }, [searchParams]);

  const handleNextCard = (knewIt: boolean) => {
    const currentWord = words[currentCardIndex];
    if (knewIt) {
      setKnewWords([...knewWords, currentWord]);
    } else {
      setNeedsReviewWords([...needsReviewWords, currentWord]);
    }

    if (currentCardIndex < words.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setIsGameFinished(true);
    }
  };

  if (isLoading) {
    return (
      <Flex
        h="100svh"
        w="full"
        align="center"
        justify="center"
        direction="column"
        gap={2}
      >
        <Spinner size="xl" />
        <Text>Loading your flashcards...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        h="100svh"
        w="full"
        align="center"
        justify="center"
        direction="column"
        gap={4}
      >
        <Heading as="h2" size="lg">
          Something went wrong
        </Heading>
        <Text>{error}</Text>
        <Link href="/flash-cards-game" passHref>
          <Button as="a" colorScheme="blue">
            Back to Setup
          </Button>
        </Link>
      </Flex>
    );
  }

  if (isGameFinished) {
    return (
      <Flex
        h="100svh"
        w="full"
        align="center"
        justify="center"
        direction="column"
        gap={4}
        p={4}
      >
        <Heading as="h2" size="xl">
          Session Complete!
        </Heading>
        <Text fontSize="lg">
          You knew {knewWords.length} out of {words.length} words.
        </Text>
        <Link href="/flash-cards-game" passHref>
          <Button as="a" colorScheme="blue" size="lg">
            Play Again
          </Button>
        </Link>
      </Flex>
    );
  }

  return (
    <Flex direction="column" h="100svh" align="center" justify="center" p={4}>
      <Box w="full" maxW="lg" flex={1} display="flex" alignItems="center">
        <FlashCard word={words[currentCardIndex]} />
      </Box>
      <Flex w="full" maxW="lg" justify="space-between" p={4}>
        <Button
          colorScheme="orange"
          size="lg"
          onClick={() => handleNextCard(false)}
        >
          Needs Review
        </Button>
        <Button
          colorScheme="green"
          size="lg"
          onClick={() => handleNextCard(true)}
        >
          I Knew This
        </Button>
      </Flex>
    </Flex>
  );
};
