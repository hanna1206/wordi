import { useCallback, useEffect, useRef, useState } from 'react';

import { toaster } from '@/components/toaster';
import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import { fetchUserMinimalVocabulary } from '@/modules/vocabulary/vocabulary.actions';
import type {
  MinimalVocabularyWordWithProgress,
  ProgressAccuracyFilter,
  ProgressReviewFilter,
  ProgressStatusFilter,
  VisibilityFilter,
  VocabularySortOption,
  VocabularyTypeFilter,
} from '@/modules/vocabulary/vocabulary.types';

const DEFAULT_PAGE_SIZE = 30;
const DEBOUNCE_DELAY = 300;

export const useVocabularyList = (
  sortOption: VocabularySortOption,
  searchQuery?: string,
  visibilityFilter: VisibilityFilter = 'visible-only',
  selectedPartsOfSpeech: PartOfSpeech[] = [],
  typeFilter: VocabularyTypeFilter = 'all',
  collectionIds: string[] = [],
  progressStatusFilter: ProgressStatusFilter[] = [],
  progressAccuracyFilter: ProgressAccuracyFilter = 'all',
  progressReviewFilter: ProgressReviewFilter = 'all',
) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<MinimalVocabularyWordWithProgress[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const itemsCountRef = useRef(0);
  const isInitialLoadingRef = useRef(true);
  const isFetchingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadWords = useCallback(
    async ({ reset = false }: { reset?: boolean } = {}) => {
      if (
        !reset &&
        (isFetchingMoreRef.current ||
          isInitialLoadingRef.current ||
          !hasMoreRef.current)
      ) {
        return;
      }

      if (reset) {
        setError(null);
        setItems([]);
        setHasMore(true);
        setIsInitialLoading(true);
        isInitialLoadingRef.current = true;
        itemsCountRef.current = 0;
        hasMoreRef.current = true;
      } else {
        setIsFetchingMore(true);
        isFetchingMoreRef.current = true;
      }

      const offset = reset ? 0 : itemsCountRef.current;

      try {
        const result = await fetchUserMinimalVocabulary({
          limit: DEFAULT_PAGE_SIZE,
          offset,
          sort: sortOption,
          searchQuery: debouncedSearchQuery,
          visibilityFilter,
          partsOfSpeech: selectedPartsOfSpeech,
          typeFilter,
          collectionIds: collectionIds.length > 0 ? collectionIds : undefined,
          progressStatusFilter,
          progressAccuracyFilter,
          progressReviewFilter,
        });

        if (result.success && result.data) {
          const fetchedItems = result.data.items ?? [];
          itemsCountRef.current = reset
            ? fetchedItems.length
            : itemsCountRef.current + fetchedItems.length;
          setItems((prev) =>
            reset ? fetchedItems : [...prev, ...fetchedItems],
          );
          const canLoadMore = itemsCountRef.current < result.data.total;
          setHasMore(canLoadMore);
          hasMoreRef.current = canLoadMore;
        } else {
          throw new Error(result.error || 'Failed to load words');
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load words';
        if (reset) {
          setError(message);
        }
        toaster.create({
          type: 'error',
          title: 'Error',
          description: message,
        });
      } finally {
        if (reset) {
          setIsInitialLoading(false);
          isInitialLoadingRef.current = false;
        } else {
          setIsFetchingMore(false);
          isFetchingMoreRef.current = false;
        }
      }
    },
    [
      sortOption,
      debouncedSearchQuery,
      visibilityFilter,
      selectedPartsOfSpeech,
      typeFilter,
      collectionIds,
      progressStatusFilter,
      progressAccuracyFilter,
      progressReviewFilter,
    ],
  );

  useEffect(() => {
    loadWords({ reset: true });
  }, [loadWords]);

  return {
    isInitialLoading,
    isFetchingMore,
    error,
    items,
    hasMore,
    loadWords,
  };
};
