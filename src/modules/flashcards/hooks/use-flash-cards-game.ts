'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { VocabularyItem } from '@/modules/vocabulary/vocabulary.types';

import { getWordsForGame, saveQualityFeedback } from '../flashcards.actions';
import { CardSide, GameMode, QualityScore } from '../flashcards.const';

const REVEAL_DELAY_MS = 1400;

export const useFlashCardsGame = () => {
  const searchParams = useSearchParams();
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [qualityScoresByWord, setQualityScoresByWord] = useState<
    Record<string, QualityScore>
  >({});
  const [isCurrentFlipped, setIsCurrentFlipped] = useState(false);
  const [flippedWordIds, setFlippedWordIds] = useState<Set<string>>(new Set());
  const cardButtonRef = useRef<HTMLDivElement | null>(null);
  const switchTimeoutRef = useRef<number | null>(null);
  const hasFetchedRef = useRef(false);

  const mode = searchParams.get('mode') as GameMode;
  const limit = Number(searchParams.get('limit'));
  const cardSide = (searchParams.get('cardSide') as CardSide) || CardSide.Word;

  const focusCard = useCallback(() => {
    cardButtonRef.current?.focus();
  }, []);

  // Fetch words on mount
  useEffect(() => {
    // Prevent double-fetching in development strict mode
    if (hasFetchedRef.current) return;

    const fetchWords = async () => {
      if (!mode || !limit) {
        setError('Invalid game parameters.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        hasFetchedRef.current = true;
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

  // Focus the card when the index changes or words are loaded
  useEffect(() => {
    if (!isLoading && !error && !isGameFinished) {
      const id = window.setTimeout(() => {
        cardButtonRef.current?.focus();
      }, 0);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [currentCardIndex, isLoading, error, isGameFinished]);

  // Clear pending switch timer on unmount or index change
  useEffect(() => {
    return () => {
      if (switchTimeoutRef.current != null) {
        window.clearTimeout(switchTimeoutRef.current);
        switchTimeoutRef.current = null;
      }
    };
  }, [currentCardIndex]);

  const markCardAsFlipped = useCallback((wordId: string) => {
    setFlippedWordIds((prev) => new Set(prev).add(wordId));
    setIsCurrentFlipped(true);
  }, []);

  const moveToNextCard = useCallback(() => {
    const hasMoreCards = currentCardIndex < words.length - 1;

    if (hasMoreCards) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsCurrentFlipped(false);
      setTimeout(focusCard, 0);
    } else {
      setIsGameFinished(true);
    }
  }, [currentCardIndex, words.length, focusCard]);

  const autoFlipAndAdvance = useCallback(
    (wordId: string) => {
      cardButtonRef.current?.click();
      markCardAsFlipped(wordId);

      const timeoutId = window.setTimeout(moveToNextCard, REVEAL_DELAY_MS);
      switchTimeoutRef.current = timeoutId;
    },
    [markCardAsFlipped, moveToNextCard],
  );

  const shouldAutoFlipCard = useCallback(
    (qualityScore: QualityScore, wasCardFlippedBefore: boolean) => {
      const isHardOrGood =
        qualityScore === QualityScore.Hard ||
        qualityScore === QualityScore.Good;
      return isHardOrGood && !wasCardFlippedBefore;
    },
    [],
  );

  const saveFeedbackInBackground = useCallback(
    (wordId: string, qualityScore: QualityScore) => {
      saveQualityFeedback({ wordId, qualityScore })
        .then((result) => {
          if (!result.success) {
            // eslint-disable-next-line no-console
            console.error('Failed to save quality feedback:', result.error);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Failed to save quality feedback:', error);
        });
    },
    [],
  );

  const handleNextCard = useCallback(
    (qualityScore: QualityScore) => {
      const currentWord = words[currentCardIndex];
      if (!currentWord) return;

      // Record quality score for statistics
      setQualityScoresByWord((prev) => ({
        ...prev,
        [currentWord.id]: qualityScore,
      }));

      const wasCardFlippedBefore = flippedWordIds.has(currentWord.id);

      if (shouldAutoFlipCard(qualityScore, wasCardFlippedBefore)) {
        autoFlipAndAdvance(currentWord.id);
      } else {
        moveToNextCard();
      }

      saveFeedbackInBackground(currentWord.id, qualityScore);
    },
    [
      words,
      currentCardIndex,
      flippedWordIds,
      shouldAutoFlipCard,
      autoFlipAndAdvance,
      moveToNextCard,
      saveFeedbackInBackground,
    ],
  );

  const handleCardFlip = useCallback(() => {
    const currentWord = words[currentCardIndex];
    if (currentWord) {
      setFlippedWordIds((prev) => new Set(prev).add(currentWord.id));
    }
    cardButtonRef.current?.click();
    setIsCurrentFlipped((v) => !v);
  }, [words, currentCardIndex]);

  return {
    // State
    words,
    currentCardIndex,
    isLoading,
    error,
    isGameFinished,
    qualityScoresByWord,
    isCurrentFlipped,
    cardSide,

    // Refs
    cardButtonRef,

    // Handlers
    handleNextCard,
    handleCardFlip,
  };
};
