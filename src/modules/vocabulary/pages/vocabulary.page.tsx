'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Spinner,
  Table,
  Text,
} from '@chakra-ui/react';

import { toaster } from '@/components/toaster';
import {
  fetchUserMinimalVocabulary,
  fetchUserWordByNormalizedWordAndPos,
} from '@/modules/vocabulary/vocabulary.actions';
import type {
  MinimalVocabularyWord,
  VocabularyItem,
} from '@/modules/vocabulary/vocabulary.types';

import { VocabularyItemModal } from '../components/vocabulary-item-modal';

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

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

  const onPrevPage = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const onNextPage = useCallback(() => {
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
      <Flex align="center" justify="center" minH="60vh">
        <Spinner size="lg" colorPalette="blue" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex align="center" justify="center" minH="60vh">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} maxW="1400px" mx="auto">
      {/* Page Header */}
      <Box mb={8}>
        <Flex align="center" justify="space-between" mb={2}>
          <Heading
            size="2xl"
            fontWeight="bold"
            bgGradient="to-r"
            gradientFrom="blue.500"
            gradientTo="purple.500"
            bgClip="text"
          >
            My Vocabulary
          </Heading>
          <Badge
            size="lg"
            colorPalette="purple"
            variant="solid"
            px={3}
            py={1}
            borderRadius="full"
          >
            {total} {total === 1 ? 'word' : 'words'}
          </Badge>
        </Flex>
        <Text color="fg.muted" fontSize="lg">
          Track and review all the words you&apos;ve learned
        </Text>
      </Box>

      {/* Controls Card */}
      <Card.Root mb={6} borderWidth="1px" shadow="sm">
        <Card.Body>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={4}
            align={{ base: 'stretch', md: 'center' }}
            justify="space-between"
          >
            {/* Items per page selector */}
            <Flex align="center" gap={3} flexWrap="wrap">
              <Text fontWeight="medium" color="fg.muted" whiteSpace="nowrap">
                Items per page:
              </Text>
              <HStack gap={2}>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <Button
                    key={size}
                    size="sm"
                    variant={pageSize === size ? 'solid' : 'outline'}
                    colorPalette={pageSize === size ? 'blue' : 'gray'}
                    onClick={() => {
                      setPageSize(size);
                      setPage(0);
                    }}
                    minW="50px"
                  >
                    {size}
                  </Button>
                ))}
              </HStack>
            </Flex>

            {/* Page info and navigation */}
            <Flex
              align="center"
              gap={4}
              justify={{ base: 'space-between', md: 'flex-end' }}
            >
              <Text
                fontWeight="medium"
                color="fg.muted"
                fontSize="sm"
                whiteSpace="nowrap"
              >
                Page {page + 1} of {totalPages}
              </Text>
              <HStack gap={2}>
                <Button
                  onClick={onPrevPage}
                  disabled={page === 0}
                  colorPalette="blue"
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={onNextPage}
                  disabled={page + 1 >= totalPages}
                  colorPalette="blue"
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </HStack>
            </Flex>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Table Card */}
      <Card.Root borderWidth="1px" shadow="sm" overflow="hidden">
        <Table.Root size="lg" variant="line" striped>
          <Table.Header bg="bg.muted">
            <Table.Row>
              <Table.ColumnHeader
                fontWeight="semibold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
                color="fg.muted"
              >
                Word
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontWeight="semibold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
                color="fg.muted"
              >
                Part of Speech
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontWeight="semibold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
                color="fg.muted"
              >
                Translation
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={3}>
                  <Flex justify="center" py={8}>
                    <Text color="fg.muted" fontSize="lg">
                      No words found. Start learning to build your vocabulary!
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              items.map((item) => (
                <Table.Row
                  key={`${item.normalizedWord}-${item.partOfSpeech}`}
                  onClick={() =>
                    handleWordClick(item.normalizedWord, item.partOfSpeech)
                  }
                  cursor="pointer"
                  _hover={{ bg: 'bg.muted' }}
                  transition="background 0.2s"
                >
                  <Table.Cell fontWeight="medium" fontSize="md">
                    {item.normalizedWord}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette="teal"
                      variant="subtle"
                      textTransform="capitalize"
                      size="sm"
                    >
                      {item.partOfSpeech}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell color="fg.muted">
                    {item.commonData?.mainTranslation || '-'}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Card.Root>

      {/* Bottom Pagination */}
      <Flex mt={6} justify="center">
        <HStack gap={2}>
          <Button
            onClick={onPrevPage}
            disabled={page === 0}
            colorPalette="blue"
            variant="ghost"
            size="sm"
          >
            ← Previous
          </Button>
          <Text fontSize="sm" color="fg.muted" px={4}>
            Page {page + 1} of {totalPages}
          </Text>
          <Button
            onClick={onNextPage}
            disabled={page + 1 >= totalPages}
            colorPalette="blue"
            variant="ghost"
            size="sm"
          >
            Next →
          </Button>
        </HStack>
      </Flex>

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

      {/* Word Details Modal */}
      <VocabularyItemModal
        isOpen={isModalOpen}
        savedWord={selectedWord}
        onClose={handleModalClose}
        onWordDeleted={handleWordDeleted}
      />
    </Box>
  );
};
