'use client';

import { useCallback, useState } from 'react';

import { Box } from '@chakra-ui/react';

import { SidebarLayout } from '@/components/sidebar-layout';
import { VocabularyItemModal } from '@/modules/vocabulary/components/vocabulary-item-modal';
import {
  VocabularyEmptyState,
  VocabularyEndMessage,
  VocabularyError,
  VocabularyInitialLoader,
  VocabularyLoadMoreSpinner,
  VocabularyScrollSentinel,
  VocabularyWordLoadingOverlay,
} from '@/modules/vocabulary/components/vocabulary-loading-states';
import { VocabularyPageHeader } from '@/modules/vocabulary/components/vocabulary-page-header';
import { VocabularySearchBar } from '@/modules/vocabulary/components/vocabulary-search-bar';
import { VocabularyTable } from '@/modules/vocabulary/components/vocabulary-table';
import { useInfiniteScroll } from '@/modules/vocabulary/hooks/use-infinite-scroll';
import { useVocabularyList } from '@/modules/vocabulary/hooks/use-vocabulary-list';
import { useVocabularyWordDetails } from '@/modules/vocabulary/hooks/use-vocabulary-word-details';
import type { VocabularySortOption } from '@/modules/vocabulary/vocabulary.types';

export const VocabularyPage = () => {
  const [sortOption, setSortOption] = useState<VocabularySortOption>('Latest');

  const { isInitialLoading, isFetchingMore, error, items, hasMore, loadWords } =
    useVocabularyList(sortOption);

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

  if (isInitialLoading) {
    return (
      <SidebarLayout>
        <VocabularyInitialLoader />
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout>
        <VocabularyError error={error} />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Box p={{ base: 4, md: 8 }} maxW="1400px" mx="auto">
        <VocabularySearchBar
          sortOption={sortOption}
          onSortSelect={handleSortSelect}
        />

        <VocabularyPageHeader />

        <VocabularyTable items={items} onWordClick={handleWordClick} />

        {items.length === 0 && !hasMore && <VocabularyEmptyState />}

        <VocabularyScrollSentinel sentinelRef={sentinelRef} />

        {isFetchingMore && <VocabularyLoadMoreSpinner />}

        {!isFetchingMore && !hasMore && items.length > 0 && (
          <VocabularyEndMessage />
        )}

        {isLoadingWord && <VocabularyWordLoadingOverlay />}

        <VocabularyItemModal
          isOpen={isModalOpen}
          savedWord={selectedWord}
          onClose={handleModalClose}
          onWordDeleted={handleWordDeleted}
        />
      </Box>
    </SidebarLayout>
  );
};
