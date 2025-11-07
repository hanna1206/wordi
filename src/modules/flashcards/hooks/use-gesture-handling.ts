'use client';

import { useCallback, useRef } from 'react';

import { QualityScore } from '../flashcards.const';

interface UseGestureHandlingProps {
  onCardFlip: () => void;
  onQualitySelect: (score: QualityScore) => void;
}

export const useGestureHandling = ({
  onCardFlip,
  onQualitySelect,
}: UseGestureHandlingProps) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTarget = useRef<HTMLElement | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchStartTarget.current = (e.target as HTMLElement) || null;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      // Ignore if started on a button (prevent accidental triggers)
      const startEl = touchStartTarget.current;
      if (startEl && startEl.closest('button')) return;

      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX.current;
      const dy = t.clientY - touchStartY.current;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const THRESHOLD = 60;

      if (absX < THRESHOLD && absY < THRESHOLD) return;

      if (absX > absY) {
        // Horizontal swipe
        if (dx > 0) {
          // Right -> Easy
          onQualitySelect(QualityScore.Easy);
        } else {
          // Left -> Hard
          onQualitySelect(QualityScore.Hard);
        }
      } else {
        // Vertical swipe -> flip
        onCardFlip();
      }
    },
    [onCardFlip, onQualitySelect],
  );

  return {
    onTouchStart,
    onTouchEnd,
  };
};
