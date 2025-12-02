import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
  isInitialLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const useInfiniteScroll = ({
  isInitialLoading,
  isFetchingMore,
  hasMore,
  onLoadMore,
}: UseInfiniteScrollProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (isInitialLoading || !hasMore) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        // Trigger load when sentinel is visible and not already loading
        if (entry.isIntersecting && !isFetchingMore && !loadingRef.current) {
          loadingRef.current = true;
          onLoadMore();

          // Reset after a delay to allow the next batch
          setTimeout(() => {
            loadingRef.current = false;
          }, 500);
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin: '400px', // Trigger earlier (400px before reaching sentinel)
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [isInitialLoading, isFetchingMore, hasMore, onLoadMore]);

  return { sentinelRef };
};
