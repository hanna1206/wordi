'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { VocabularyItem } from '@/modules/vocabulary/vocabulary.types';

import { getWordsForGame, saveQualityFeedback } from '../flashcards.actions';
import { CardSide, GameMode, QualityScore } from '../flashcards.const';

export const useFlashCardsGame = () => {
  const searchParams = useSearchParams();
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [needsReviewWords, setNeedsReviewWords] = useState<VocabularyItem[]>(
    [],
  );
  const [isCurrentFlipped, setIsCurrentFlipped] = useState(false);
  const [flippedWordIds, setFlippedWordIds] = useState<Set<string>>(new Set());
  const cardButtonRef = useRef<HTMLDivElement | null>(null);
  const switchTimeoutRef = useRef<number | null>(null);

  const mode = searchParams.get('mode') as GameMode;
  const limit = Number(searchParams.get('limit'));
  const cardSide = (searchParams.get('cardSide') as CardSide) || CardSide.Word;

  const focusCard = useCallback(() => {
    cardButtonRef.current?.focus();
  }, []);

  // Fetch words on mount
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

  const handleNextCard = useCallback(
    (qualityScore: QualityScore) => {
      const currentWord = words[currentCardIndex];

      if (!currentWord) return;

      // Optimistically update UI first
      if (qualityScore === QualityScore.Hard) {
        setNeedsReviewWords((prev) => [...prev, currentWord]);
      }

      const wasEverFlipped = flippedWordIds.has(currentWord.id);

      // For HARD and GOOD: if card was never flipped before, flip to reveal answer, then advance after delay
      if (
        (qualityScore === QualityScore.Hard ||
          qualityScore === QualityScore.Good) &&
        !wasEverFlipped &&
        !isCurrentFlipped
      ) {
        cardButtonRef.current?.click();
        setIsCurrentFlipped(true);
        setFlippedWordIds((prev) => new Set(prev).add(currentWord.id));
        const id = window.setTimeout(() => {
          if (currentCardIndex < words.length - 1) {
            setCurrentCardIndex((prev) => prev + 1);
            setIsCurrentFlipped(false);
            setTimeout(focusCard, 0);
          } else {
            setIsGameFinished(true);
          }
        }, 1400);
        switchTimeoutRef.current = id;
      } else {
        if (currentCardIndex < words.length - 1) {
          setCurrentCardIndex((prev) => prev + 1);
          setIsCurrentFlipped(false);
          setTimeout(focusCard, 0);
        } else {
          setIsGameFinished(true);
        }
      }

      // Save quality feedback in the background (non-blocking)
      saveQualityFeedback({ wordId: currentWord.id, qualityScore })
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
    [words, currentCardIndex, focusCard, flippedWordIds, isCurrentFlipped],
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
    needsReviewWords,
    isCurrentFlipped,
    cardSide,

    // Refs
    cardButtonRef,

    // Handlers
    handleNextCard,
    handleCardFlip,
    setIsCurrentFlipped,
  };
};
