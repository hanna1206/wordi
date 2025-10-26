'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Box,
  Button,
  Flex,
  HStack,
  Spinner,
  Table,
  Text,
} from '@chakra-ui/react';

import { toaster } from '@/components/toaster';
import { fetchUserMinimalVocabulary } from '@/modules/vocabulary/vocabulary.actions';
import type { MinimalVocabularyWord } from '@/modules/vocabulary/vocabulary.types';

const DEFAULT_PAGE_SIZE = 20;

export const VocabularyPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<MinimalVocabularyWord[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);

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

  if (isLoading) {
    return (
      <Flex align="center" justify="center" minH="60vh">
        <Spinner size="lg" />
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
    <Box p={4}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Word</Table.ColumnHeader>
            <Table.ColumnHeader>Part of speech</Table.ColumnHeader>
            <Table.ColumnHeader>Main translation</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={`${item.normalizedWord}-${item.partOfSpeech}`}>
              <Table.Cell>{item.normalizedWord}</Table.Cell>
              <Table.Cell style={{ textTransform: 'capitalize' }}>
                {item.partOfSpeech}
              </Table.Cell>
              <Table.Cell>{item.commonData?.mainTranslation}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex mt={4} align="center" justify="space-between">
        <HStack>
          <Button onClick={onPrevPage} disabled={page === 0}>
            Prev
          </Button>
          <Button onClick={onNextPage} disabled={page + 1 >= totalPages}>
            Next
          </Button>
        </HStack>
        <Text>
          Page {page + 1} of {totalPages} • {total} items
        </Text>
        <HStack>
          <Button
            variant={pageSize === 10 ? 'solid' : 'subtle'}
            onClick={() => {
              setPageSize(10);
              setPage(0);
            }}
          >
            10
          </Button>
          <Button
            variant={pageSize === 20 ? 'solid' : 'subtle'}
            onClick={() => {
              setPageSize(20);
              setPage(0);
            }}
          >
            20
          </Button>
          <Button
            variant={pageSize === 50 ? 'solid' : 'subtle'}
            onClick={() => {
              setPageSize(50);
              setPage(0);
            }}
          >
            50
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};
