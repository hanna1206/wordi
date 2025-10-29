import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
  isInitialLoading: boolean;
  onLoadMore: () => void;
}

export const useInfiniteScroll = ({
  isInitialLoading,
  onLoadMore,
}: UseInfiniteScrollProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInitialLoading) {
      return;
    }

    const sentinel = sentinelRef.current;
    const scrollContainer = sentinel?.closest<HTMLElement>(
      '[data-scroll-container="true"]',
    );

    if (!sentinel || !scrollContainer) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { root: scrollContainer, rootMargin: '200px' },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [isInitialLoading, onLoadMore]);

  return { sentinelRef };
};
