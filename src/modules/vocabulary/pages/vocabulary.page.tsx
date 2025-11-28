'use client';

import { useCallback, useEffect, useState } from 'react';

import { Box } from '@chakra-ui/react';

import { PageHeader } from '@/components/page-header';
import { toaster } from '@/components/toaster';
import { getUserCollections } from '@/modules/collection/collections.actions';
import type { CollectionWithCount } from '@/modules/collection/collections.types';
import { CollectionManagerDialog } from '@/modules/collection/components/collection-manager-dialog';
import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import { VocabularyItemModal } from '@/modules/vocabulary/components/vocabulary-item-modal';
import {
  VocabularyEndMessage,
  VocabularyError,
  VocabularyInitialLoader,
  VocabularyLoadMoreSpinner,
  VocabularyScrollSentinel,
  VocabularyWordLoadingOverlay,
} from '@/modules/vocabulary/components/vocabulary-loading-states';
import { VocabularySearchBar } from '@/modules/vocabulary/components/vocabulary-search-bar';
import { VocabularyTable } from '@/modules/vocabulary/components/vocabulary-table';
import { useInfiniteScroll } from '@/modules/vocabulary/hooks/use-infinite-scroll';
import { useVocabularyList } from '@/modules/vocabulary/hooks/use-vocabulary-list';
import { useVocabularyWordDetails } from '@/modules/vocabulary/hooks/use-vocabulary-word-details';
import type {
  VisibilityFilter,
  VocabularySortOption,
  VocabularyTypeFilter,
} from '@/modules/vocabulary/vocabulary.types';

import { areFiltersAtDefault } from '../utils/are-filters-at-default';
import { toggleWordHidden } from '../vocabulary.actions';

export const VocabularyPage = () => {
  const [sortOption, setSortOption] = useState<VocabularySortOption>('Latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>('visible-only');
  const [selectedPartsOfSpeech, setSelectedPartsOfSpeech] = useState<
    PartOfSpeech[]
  >([]);
  const [typeFilter, setTypeFilter] = useState<VocabularyTypeFilter>('all');
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>(
    [],
  );
  const [isCollectionManagerOpen, setIsCollectionManagerOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);

  const hasActiveFilters = !areFiltersAtDefault(
    visibilityFilter,
    selectedPartsOfSpeech,
  );

  const { isInitialLoading, isFetchingMore, error, items, hasMore, loadWords } =
    useVocabularyList(
      sortOption,
      searchQuery,
      visibilityFilter,
      selectedPartsOfSpeech,
      typeFilter,
      collectionId,
    );

  const {
    isModalOpen,
    selectedWord,
    isLoadingWord,
    handleWordClick,
    handleModalClose,
  } = useVocabularyWordDetails();

  const { sentinelRef } = useInfiniteScroll({
    isInitialLoading,
    onLoadMore: () => void loadWords(),
  });

  const handleWordDeleted = useCallback(() => {
    handleModalClose();
    void loadWords({ reset: true });
  }, [loadWords, handleModalClose]);

  const handleSortSelect = useCallback((option: VocabularySortOption) => {
    setSortOption(option);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback(
    (
      visibility: VisibilityFilter,
      partsOfSpeech: PartOfSpeech[],
      type: VocabularyTypeFilter,
    ) => {
      setVisibilityFilter(visibility);
      setSelectedPartsOfSpeech(partsOfSpeech);
      setTypeFilter(type);
    },
    [],
  );

  const handleCollectionChange = useCallback(
    (newCollectionId: string | null) => {
      setCollectionId(newCollectionId);
    },
    [],
  );

  const handleCollectionIdsChange = useCallback(
    (newCollectionIds: string[]) => {
      setSelectedCollectionIds(newCollectionIds);

      // Determine which single collection ID to use for the backend query
      if (newCollectionIds.length === 0) {
        // No collections selected - show all vocabulary items
        setCollectionId(null);
      } else {
        // Use the first selected collection ID for filtering
        setCollectionId(newCollectionIds[0]);
      }
    },
    [],
  );

  const handleOpenCollectionManager = useCallback(() => {
    setIsCollectionManagerOpen(true);
  }, []);

  const handleCloseCollectionManager = useCallback(() => {
    setIsCollectionManagerOpen(false);
  }, []);

  const fetchCollections = useCallback(async () => {
    setIsLoadingCollections(true);
    const result = await getUserCollections();

    if (result.success && result.data) {
      setCollections(result.data);
    } else {
      toaster.create({
        type: 'error',
        title: 'Failed to load collections',
        description: result.error,
      });
    }
    setIsLoadingCollections(false);
  }, []);

  const handleCollectionsChanged = useCallback(() => {
    // Refresh vocabulary list and collections when collections are modified
    void loadWords({ reset: true });
    void fetchCollections();
  }, [loadWords, fetchCollections]);

  // Load collections on mount
  useEffect(() => {
    void fetchCollections();
  }, [fetchCollections]);

  const handleToggleHidden = useCallback(
    async (wordId: string, isHidden: boolean) => {
      const result = await toggleWordHidden({ wordId, isHidden });
      if (result.success) {
        await loadWords({ reset: true });
      } else {
        toaster.create({
          type: 'error',
          title: 'Failed to update word',
          description: result.error,
        });
      }
    },
    [loadWords],
  );

  return (
    <Box p={{ base: 4, md: 8 }} maxW="1400px" mx="auto">
      <VocabularySearchBar
        sortOption={sortOption}
        onSortSelect={handleSortSelect}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        visibilityFilter={visibilityFilter}
        selectedPartsOfSpeech={selectedPartsOfSpeech}
        typeFilter={typeFilter}
        onFilterChange={handleFilterChange}
        hasActiveFilters={hasActiveFilters}
        selectedCollectionId={collectionId}
        selectedCollectionIds={selectedCollectionIds}
        onCollectionChange={handleCollectionChange}
        onCollectionIdsChange={handleCollectionIdsChange}
        onManageCollections={handleOpenCollectionManager}
        collections={collections}
        isLoadingCollections={isLoadingCollections}
      />

      <PageHeader title="Vocabulary" description="" />

      {isInitialLoading ? (
        <VocabularyInitialLoader />
      ) : error ? (
        <VocabularyError error={error} />
      ) : (
        <>
          <VocabularyTable
            items={items}
            onWordClick={handleWordClick}
            onToggleHidden={handleToggleHidden}
          />

          <VocabularyScrollSentinel sentinelRef={sentinelRef} />

          {isFetchingMore && <VocabularyLoadMoreSpinner />}

          {!isFetchingMore && !hasMore && items.length > 0 && (
            <VocabularyEndMessage />
          )}
        </>
      )}

      {isLoadingWord && <VocabularyWordLoadingOverlay />}

      <VocabularyItemModal
        isOpen={isModalOpen}
        savedWord={selectedWord}
        onClose={handleModalClose}
        onWordDeleted={handleWordDeleted}
      />

      <CollectionManagerDialog
        isOpen={isCollectionManagerOpen}
        onClose={handleCloseCollectionManager}
        onCollectionsChange={handleCollectionsChanged}
      />
    </Box>
  );
};
