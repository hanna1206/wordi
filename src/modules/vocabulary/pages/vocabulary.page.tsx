'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LuArrowDownNarrowWide } from 'react-icons/lu';

import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Menu,
  Spinner,
  Text,
} from '@chakra-ui/react';

import { SidebarLayout } from '@/components/sidebar-layout';
import { toaster } from '@/components/toaster';
import { VocabularyItemModal } from '@/modules/vocabulary/components/vocabulary-item-modal';
import { VocabularyPageHeader } from '@/modules/vocabulary/components/vocabulary-page-header';
import { VocabularyTable } from '@/modules/vocabulary/components/vocabulary-table';
import {
  fetchUserMinimalVocabulary,
  fetchUserWordByNormalizedWordAndPos,
} from '@/modules/vocabulary/vocabulary.actions';
import type {
  MinimalVocabularyWord,
  VocabularyItem,
  VocabularySortOption,
} from '@/modules/vocabulary/vocabulary.types';

const DEFAULT_PAGE_SIZE = 20;

export const VocabularyPage = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<MinimalVocabularyWord[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [isLoadingWord, setIsLoadingWord] = useState(false);
  const [sortOption, setSortOption] = useState<VocabularySortOption>('Latest');

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const itemsCountRef = useRef(0);
  const isInitialLoadingRef = useRef(true);
  const isFetchingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);

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
          if (!reset && fetchedItems.length === 0) {
            toaster.create({
              type: 'info',
              title: 'Info',
              description: 'Новых слов не найдено',
            });
          }
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
    [sortOption],
  );

  useEffect(() => {
    loadWords({ reset: true });
  }, [loadWords]);

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
          void loadWords();
        }
      },
      { root: scrollContainer, rootMargin: '200px' },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [isInitialLoading, loadWords]);

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
    void loadWords({ reset: true });
  }, [loadWords]);

  const handleSortSelect = useCallback((option: 'Latest' | 'Alphabetical') => {
    setSortOption(option);
  }, []);

  if (isInitialLoading) {
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
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={4}
          mb={6}
          align={{ base: 'stretch', md: 'center' }}
        >
          <Input
            placeholder="Search vocabulary"
            flex="1"
            size="lg"
            backgroundColor="white"
          />

          <Flex gap={2} justify="flex-end" w={{ base: 'full', md: 'auto' }}>
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  w={{ base: 'full', md: 'auto' }}
                  aria-label="Sort"
                >
                  <Flex align="center" justify="space-between" w="full" gap={1}>
                    <Icon as={LuArrowDownNarrowWide} fontSize="md" />
                    <Text>{sortOption}</Text>
                  </Flex>
                </Button>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item
                    value="Alphabetical"
                    onClick={() => handleSortSelect('Alphabetical')}
                  >
                    Alphabetical
                  </Menu.Item>
                  <Menu.Item
                    value="Latest"
                    onClick={() => handleSortSelect('Latest')}
                  >
                    Latest
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
            <Button
              variant="outline"
              size="lg"
              w={{ base: 'full', md: 'auto' }}
            >
              Filters
            </Button>
          </Flex>
        </Flex>

        <VocabularyPageHeader />

        <VocabularyTable items={items} onWordClick={handleWordClick} />

        {items.length === 0 && !hasMore && (
          <Flex align="center" justify="center" py={8}>
            <Text color="fg.muted">Пока что слов нет.</Text>
          </Flex>
        )}

        <Box ref={sentinelRef} w="full" h="1px" border={'2px solid black'} />

        {isFetchingMore && (
          <Flex justify="center" py={4}>
            <Spinner size="md" colorPalette="blue" />
          </Flex>
        )}

        {!isFetchingMore && !hasMore && items.length > 0 && (
          <Flex justify="center" py={4}>
            <Text fontSize="sm" color="fg.muted">
              You have reached the end of your vocabulary.
            </Text>
          </Flex>
        )}

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
