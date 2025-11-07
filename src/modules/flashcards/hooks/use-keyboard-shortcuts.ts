'use client';

import { useEffect } from 'react';

import { QualityScore } from '../flashcards.const';

interface UseKeyboardShortcutsProps {
  isLoading: boolean;
  error: string | null;
  isGameFinished: boolean;
  wordsLength: number;
  onCardFlip: () => void;
  onQualitySelect: (score: QualityScore) => void;
}

export const useKeyboardShortcuts = ({
  isLoading,
  error,
  isGameFinished,
  wordsLength,
  onCardFlip,
  onQualitySelect,
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    if (isLoading || error || isGameFinished || wordsLength === 0) return;

    const isTypingInField = (el: Element | null) => {
      if (!el) return false;
      const tag = el.tagName.toLowerCase();
      const editable = (el as HTMLElement).isContentEditable;
      return (
        editable || tag === 'input' || tag === 'textarea' || tag === 'select'
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingInField(document.activeElement)) return;

      // Flip with Space/Enter/Arrows Up/Down
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        onCardFlip();
        return;
      }

      // Numeric ratings
      if (e.code === 'Digit1' || e.code === 'Numpad1') {
        e.preventDefault();
        onQualitySelect(QualityScore.Hard);
        return;
      }
      if (e.code === 'Digit2' || e.code === 'Numpad2') {
        e.preventDefault();
        onQualitySelect(QualityScore.Good);
        return;
      }
      if (e.code === 'Digit3' || e.code === 'Numpad3') {
        e.preventDefault();
        onQualitySelect(QualityScore.Easy);
        return;
      }

      // ArrowRight advances with Good by default
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onQualitySelect(QualityScore.Good);
        return;
      }
    };

    window.addEventListener('keydown', onKeyDown as EventListener);
    return () =>
      window.removeEventListener('keydown', onKeyDown as EventListener);
  }, [
    isLoading,
    error,
    isGameFinished,
    wordsLength,
    onCardFlip,
    onQualitySelect,
  ]);
};
