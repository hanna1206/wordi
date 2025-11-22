'use client';

import { useCallback, useState } from 'react';

import { Box } from '@chakra-ui/react';

import { PageHeader } from '@/components/page-header';
import { toaster } from '@/components/toaster';
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
} from '@/modules/vocabulary/vocabulary.types';
import {
  ALL_PARTS_OF_SPEECH,
  areFiltersAtDefault,
} from '@/modules/vocabulary/vocabulary.types';

import { toggleWordHidden } from '../vocabulary.actions';

export const VocabularyPage = () => {
  const [sortOption, setSortOption] = useState<VocabularySortOption>('Latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>('visible-only');
  const [selectedPartsOfSpeech, setSelectedPartsOfSpeech] =
    useState<PartOfSpeech[]>(ALL_PARTS_OF_SPEECH);

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
    (visibility: VisibilityFilter, partsOfSpeech: PartOfSpeech[]) => {
      setVisibilityFilter(visibility);
      setSelectedPartsOfSpeech(partsOfSpeech);
    },
    [],
  );

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
        onFilterChange={handleFilterChange}
        hasActiveFilters={hasActiveFilters}
      />

      <PageHeader
        title="Vocabulary"
        description="Track and review all the words you've learned"
      />

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
    </Box>
  );
};
