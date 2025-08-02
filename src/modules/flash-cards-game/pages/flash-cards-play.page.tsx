'use client';

import { useEffect, useState } from 'react';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';

import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { SavedWord } from '@/modules/words-persistence/words-persistence.types';

import { FlashCard } from '../components/flash-card';
import {
  getWordsForGame,
  saveQualityFeedback,
} from '../flash-cards-game.actions';
import {
  CardSide,
  GameMode,
  QUALITY_OPTIONS,
  QualityScore,
} from '../flash-cards-game.const';

export const FlashCardsPlayPage = () => {
  const searchParams = useSearchParams();
  const [words, setWords] = useState<SavedWord[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [needsReviewWords, setNeedsReviewWords] = useState<SavedWord[]>([]);

  const mode = searchParams.get('mode') as GameMode;
  const limit = Number(searchParams.get('limit'));
  const cardSide = (searchParams.get('cardSide') as CardSide) || CardSide.Word;

  useEffect(() => {
    const fetchWords = async () => {
      if (!mode || !limit) {
        setError('Invalid game parameters.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await getWordsForGame({ mode, limit });

        if (result.success && result.data) {
          setWords(result.data);
        } else {
          setError(result.error || 'Failed to fetch words');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, [mode, limit]);

  const handleNextCard = async (qualityScore: QualityScore) => {
    const currentWord = words[currentCardIndex];

    // Add words to review list if they were marked as hard
    if (qualityScore === QualityScore.Hard) {
      setNeedsReviewWords((prev) => [...prev, currentWord]);
    }

    // Save quality feedback to the database for spaced repetition
    try {
      const result = await saveQualityFeedback({
        wordId: currentWord.id,
        qualityScore,
      });

      if (!result.success) {
        // eslint-disable-next-line no-console
        console.error('Failed to save quality feedback:', result.error);
        // Continue with the game even if saving fails
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save quality feedback:', error);
      // Continue with the game even if saving fails
    }

    if (currentCardIndex < words.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setIsGameFinished(true);
    }
  };

  if (isLoading) {
    return (
      <Flex direction="column" h="100svh" align="center" justify="center" p={4}>
        <Spinner size="xl" />
        <Text mt={4}>Loading your words...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" h="100svh" align="center" justify="center" p={4}>
        <Heading as="h2" size="lg" color="red.500">
          Error
        </Heading>
        <Text mt={2}>{error}</Text>
        <Link href="/flash-cards-game" passHref>
          <Button as="a" mt={4} colorScheme="blue">
            Go Back
          </Button>
        </Link>
      </Flex>
    );
  }

  if (isGameFinished) {
    return (
      <Flex direction="column" h="100svh" align="center" justify="center" p={4}>
        <Heading as="h2" size="lg">
          Game Over!
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
  }

  return (
    <>
      <Flex direction="column" h="100svh" p={4} pt={24}>
        {/* Navigation Header */}
        <Flex align="center" justify="space-between" mb={4}>
          <Link href="/flash-cards-game" passHref>
            <IconButton
              as="a"
              aria-label="Back to game selection"
              variant="ghost"
              size="lg"
            >
              <FaArrowLeft />
            </IconButton>
          </Link>
          <Text fontSize="sm" color="gray.500">
            {currentCardIndex + 1} / {words.length}
          </Text>
          <Link href="/" passHref>
            <IconButton
              as="a"
              aria-label="Back to home"
              variant="ghost"
              size="lg"
            >
              <FaTimes />
            </IconButton>
          </Link>
        </Flex>

        {/* Game Content */}
        <Box
          w="full"
          maxW="lg"
          mx="auto"
          flex={1}
          display="flex"
          alignItems="center"
        >
          <FlashCard
            word={words[currentCardIndex]}
            cardSide={cardSide}
            allWordIds={words.map((w) => w.id)}
          />
        </Box>

        {/* Quality Feedback Buttons */}
        <Flex w="full" maxW="lg" mx="auto" justify="center" gap={4} mt={4}>
          {QUALITY_OPTIONS.map((option) => (
            <Button
              key={option.score}
              colorScheme={option.colorScheme}
              onClick={() => handleNextCard(option.score)}
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
      </Flex>
    </>
  );
};
