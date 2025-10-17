'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { toaster } from '@/components/toaster';
import { VocabularyItem } from '@/modules/words-persistence/vocabulary.types';

import {
  getWordsForGame,
  saveQualityFeedback,
} from '../flash-cards-game.actions';
import { CardSide, GameMode, QualityScore } from '../flash-cards-game.const';

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

  // First-time helper toast
  useEffect(() => {
    const STORAGE_KEY = 'flashcards_helper_v1';
    if (typeof window === 'undefined') return;
    try {
      const shown = window.localStorage.getItem(STORAGE_KEY);
      if (shown) return;

      const isDesktop = window.innerWidth >= 992;
      const description = isDesktop
        ? 'Flip: Space / Enter / ↑ / ↓ • Rate: 1=Hard, 2=Good, 3=Easy • Next: →'
        : 'Swipe up/down to flip • Swipe left = Hard • Swipe right = Easy';

      toaster.create({
        title: 'Tips',
        description,
        type: 'info',
        duration: 6000,
        closable: true,
      });
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {}
  }, []);

  const handleNextCard = useCallback(
    (qualityScore: QualityScore) => {
      const currentWord = words[currentCardIndex];

      if (!currentWord) return;

      // Optimistically update UI first
      if (qualityScore === QualityScore.Hard) {
        setNeedsReviewWords((prev) => [...prev, currentWord]);
      }

      // For HARD: if card isn't flipped, flip to reveal answer, then advance after delay
      if (qualityScore === QualityScore.Hard && !isCurrentFlipped) {
        cardButtonRef.current?.click();
        setIsCurrentFlipped(true);
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
    [words, currentCardIndex, focusCard, isCurrentFlipped],
  );

  const handleCardFlip = useCallback(() => {
    cardButtonRef.current?.click();
    setIsCurrentFlipped((v) => !v);
  }, []);

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
