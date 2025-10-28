'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Flex, Spinner, Text } from '@chakra-ui/react';

import { SidebarLayout } from '@/components/sidebar-layout';
import { toaster } from '@/components/toaster';
import { VocabularyItemModal } from '@/modules/vocabulary/components/vocabulary-item-modal';
import { VocabularyPageControls } from '@/modules/vocabulary/components/vocabulary-page-controls';
import { VocabularyPageHeader } from '@/modules/vocabulary/components/vocabulary-page-header';
import { VocabularyPagination } from '@/modules/vocabulary/components/vocabulary-pagination';
import { VocabularyTable } from '@/modules/vocabulary/components/vocabulary-table';
import {
  fetchUserMinimalVocabulary,
  fetchUserWordByNormalizedWordAndPos,
} from '@/modules/vocabulary/vocabulary.actions';
import { DEFAULT_PAGE_SIZE } from '@/modules/vocabulary/vocabulary.const';
import type {
  MinimalVocabularyWord,
  VocabularyItem,
} from '@/modules/vocabulary/vocabulary.types';

export const VocabularyPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<MinimalVocabularyWord[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [isLoadingWord, setIsLoadingWord] = useState(false);

  const totalPages = useMemo(() => {
    return total > 0 ? Math.ceil(total / pageSize) : 1;
  }, [total, pageSize]);

  const fetchWords = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const offset = page * pageSize;
      const result = await fetchUserMinimalVocabulary({
        limit: pageSize,
        offset,
      });

      if (result.success && result.data) {
        setItems(result.data.items);
        setTotal(result.data.total);
      } else {
        throw new Error(result.error || 'Failed to load words');
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load words';
      setError(message);
      toaster.create({ type: 'error', title: 'Error', description: message });
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(0);
  }, []);

  const handlePrevPage = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((p) => Math.min(totalPages - 1, p + 1));
  }, [totalPages]);

  const handleWordClick = useCallback(
    async (normalizedWord: string, partOfSpeech: string) => {
      setIsLoadingWord(true);
      try {
        const result = await fetchUserWordByNormalizedWordAndPos({
          normalizedWord,
          partOfSpeech,
        });

        if (result.success && result.data) {
          setSelectedWord(result.data);
          setIsModalOpen(true);
        } else {
          toaster.create({
            type: 'error',
            title: 'Error',
            description: result.error || 'Failed to load word details',
          });
        }
      } catch {
        toaster.create({
          type: 'error',
          title: 'Error',
          description: 'Failed to load word details',
        });
      } finally {
        setIsLoadingWord(false);
      }
    },
    [],
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedWord(null);
  }, []);

  const handleWordDeleted = useCallback(() => {
    setIsModalOpen(false);
    setSelectedWord(null);
    fetchWords();
  }, [fetchWords]);

  if (isLoading) {
    return (
      <SidebarLayout>
        <Flex align="center" justify="center" minH="60vh">
          <Spinner size="lg" colorPalette="blue" />
        </Flex>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout>
        <Flex align="center" justify="center" minH="60vh">
          <Text color="red.500">{error}</Text>
        </Flex>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Box p={{ base: 4, md: 8 }} maxW="1400px" mx="auto">
        <VocabularyPageHeader total={total} />

        <VocabularyPageControls
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />

        <VocabularyTable items={items} onWordClick={handleWordClick} />

        <VocabularyPagination
          page={page}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />

        {/* Loading overlay when fetching word details */}
        {isLoadingWord && (
          <Flex
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.300"
            align="center"
            justify="center"
            zIndex={9999}
          >
            <Spinner size="xl" colorPalette="blue" />
          </Flex>
        )}

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
