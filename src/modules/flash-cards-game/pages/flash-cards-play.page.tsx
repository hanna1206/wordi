'use client';

import { useEffect, useState } from 'react';

import { Box, Flex } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';

import { SavedWord } from '@/modules/words-persistence/words-persistence.types';

import { FlashCard } from '../components/flash-card';
import { PlayPageErrorState } from '../components/play-page-error-state';
import { PlayPageGameCompleteState } from '../components/play-page-game-complete-state';
import { PlayPageLoadingState } from '../components/play-page-loading-state';
import { PlayPageNavigation } from '../components/play-page-navigation';
import { PlayPageQualityFeedbackButtons } from '../components/play-page-quality-feedback-buttons';
import {
  getWordsForGame,
  saveQualityFeedback,
} from '../flash-cards-game.actions';
import { CardSide, GameMode, QualityScore } from '../flash-cards-game.const';

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
    return <PlayPageLoadingState />;
  }

  if (error) {
    return <PlayPageErrorState error={error} />;
  }

  if (isGameFinished) {
    return <PlayPageGameCompleteState needsReviewWords={needsReviewWords} />;
  }

  return (
    <>
      <Flex direction="column" h="100svh" p={4} pt={24}>
        <PlayPageNavigation
          currentIndex={currentCardIndex}
          totalCount={words.length}
        />

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

        <PlayPageQualityFeedbackButtons onQualitySelect={handleNextCard} />
      </Flex>
    </>
  );
};
