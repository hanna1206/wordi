'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  Box,
  Button,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

import { GradientBackground } from '@/components/gradient-background';
import { toaster } from '@/components/toaster';

import { ExportModal } from '../components/export-modal';
import { WordDetailModal } from '../components/word-detail-modal';
import { WordsStatisticsComponent } from '../components/words-statistics';
import { WordsTable } from '../components/words-table';
import { WordsTableToolbar } from '../components/words-table-toolbar';
import {
  getUserWordsWithProgress,
  getWordsStatistics,
  performBulkAction,
  updateWordArchiveStatus,
  updateWordStatus,
} from '../words-management.actions';
import type {
  WordsFilterOptions,
  WordsSortOptions,
  WordsStatistics,
  WordWithProgress,
} from '../words-management.types';

export const WordsPage = () => {
  // Check if running on localhost
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  const [words, setWords] = useState<WordWithProgress[]>([]);
  const [statistics, setStatistics] = useState<WordsStatistics | null>(null);
  const [selectedWords, setSelectedWords] = useState<WordWithProgress[]>([]);
  const [filters, setFilters] = useState<WordsFilterOptions>({});
  const [sort] = useState<WordsSortOptions>({
    field: 'nextReviewDate',
    direction: 'asc',
  });
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedWord, setSelectedWord] = useState<WordWithProgress | null>(
    null,
  );
  const [isWordDetailOpen, setIsWordDetailOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Load words and statistics
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [wordsData, statsData] = await Promise.all([
        getUserWordsWithProgress(filters, sort),
        getWordsStatistics(),
      ]);
      setWords(wordsData);
      setStatistics(statsData);
    } catch {
      toaster.create({
        title: 'Error loading words',
        description: 'Failed to load your word collection. Please try again.',
        type: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    if (isLocalhost) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [loadData, isLocalhost]);

  // Handle word actions
  const handleViewWord = useCallback((word: WordWithProgress) => {
    setSelectedWord(word);
    setIsWordDetailOpen(true);
  }, []);

  const handleArchiveWord = useCallback(
    async (word: WordWithProgress) => {
      try {
        await updateWordArchiveStatus(word.progressId, !word.isArchived);
        toaster.create({
          title: word.isArchived ? 'Word unarchived' : 'Word archived',
          type: 'success',
          duration: 3000,
        });
        loadData();
      } catch {
        toaster.create({
          title: 'Error updating word',
          description: 'Failed to update archive status. Please try again.',
          type: 'error',
          duration: 5000,
        });
      }
    },
    [loadData],
  );

  // Handle bulk actions
  const handleBulkArchive = useCallback(async () => {
    try {
      await performBulkAction({
        action: 'archive',
        wordIds: selectedWords.map((w) => w.id),
      });
      toaster.create({
        title: `${selectedWords.length} words archived`,
        type: 'success',
        duration: 3000,
      });
      setSelectedWords([]);
      loadData();
    } catch {
      toaster.create({
        title: 'Error archiving words',
        description: 'Failed to archive selected words. Please try again.',
        type: 'error',
        duration: 5000,
      });
    }
  }, [selectedWords, loadData]);

  const handleBulkUnarchive = useCallback(async () => {
    try {
      await performBulkAction({
        action: 'unarchive',
        wordIds: selectedWords.map((w) => w.id),
      });
      toaster.create({
        title: `${selectedWords.length} words unarchived`,
        type: 'success',
        duration: 3000,
      });
      setSelectedWords([]);
      loadData();
    } catch {
      toaster.create({
        title: 'Error unarchiving words',
        description: 'Failed to unarchive selected words. Please try again.',
        type: 'error',
        duration: 5000,
      });
    }
  }, [selectedWords, loadData]);

  const handleBulkDelete = useCallback(async () => {
    // TODO: Add confirmation dialog
    try {
      await performBulkAction({
        action: 'delete',
        wordIds: selectedWords.map((w) => w.id),
      });
      toaster.create({
        title: `${selectedWords.length} words deleted`,
        type: 'success',
        duration: 3000,
      });
      setSelectedWords([]);
      loadData();
    } catch {
      toaster.create({
        title: 'Error deleting words',
        description: 'Failed to delete selected words. Please try again.',
        type: 'error',
        duration: 5000,
      });
    }
  }, [selectedWords, loadData]);

  const handleBulkExport = useCallback(() => {
    setIsExportModalOpen(true);
  }, []);

  // Handle word detail modal actions
  const handleWordStatusChange = useCallback(
    async (word: WordWithProgress, newStatus: WordWithProgress['status']) => {
      try {
        await updateWordStatus(word.progressId, newStatus);
        toaster.create({
          title: 'Status updated',
          description: `Word status changed to ${newStatus}`,
          type: 'success',
          duration: 3000,
        });
        loadData();
      } catch {
        toaster.create({
          title: 'Error updating status',
          description: 'Failed to update word status. Please try again.',
          type: 'error',
          duration: 5000,
        });
      }
    },
    [loadData],
  );

  if (loading) {
    return (
      <GradientBackground variant="primary">
        <Container maxW="container.xl" py={10}>
          <VStack gap={8}>
            <Spinner size="xl" />
            <Text>Loading your word collection...</Text>
          </VStack>
        </Container>
      </GradientBackground>
    );
  }

  // Show simple disclaimer for non-localhost environments
  if (!isLocalhost) {
    return (
      <GradientBackground variant="primary">
        <Container maxW="container.xl" py={10}>
          <VStack align="stretch" gap={6}>
            <Heading size="xl">My Words</Heading>

            <Box
              bg="white"
              borderRadius="lg"
              p={8}
              shadow="sm"
              textAlign="center"
            >
              <VStack gap={4}>
                <Text fontSize="lg" fontWeight="semibold">
                  Words Management Feature
                </Text>
                <Text color="gray.600">
                  This feature is currently under development and only available
                  in the development environment. Stay tuned for the full
                  release!
                </Text>
                <Button
                  colorPalette="blue"
                  size="lg"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </GradientBackground>
    );
  }

  // Show full words management interface for localhost
  return (
    <GradientBackground variant="primary">
      <Container maxW="container.xl" py={10}>
        <VStack align="stretch" gap={6}>
          <Heading size="xl">My Words</Heading>

          {statistics && <WordsStatisticsComponent statistics={statistics} />}

          <Box bg="white" borderRadius="lg" p={6} shadow="sm">
            <WordsTableToolbar
              selectedWords={selectedWords}
              filters={filters}
              onFiltersChange={setFilters}
              onBulkArchive={handleBulkArchive}
              onBulkUnarchive={handleBulkUnarchive}
              onBulkDelete={handleBulkDelete}
              onBulkExport={handleBulkExport}
              onRefresh={loadData}
            />

            <WordsTable
              words={words}
              onViewWord={handleViewWord}
              onArchiveWord={handleArchiveWord}
              onSelectionChanged={setSelectedWords}
            />
          </Box>
        </VStack>
      </Container>

      {/* Modals */}
      <WordDetailModal
        word={selectedWord}
        isOpen={isWordDetailOpen}
        onClose={() => setIsWordDetailOpen(false)}
        onArchive={handleArchiveWord}
        onStatusChange={handleWordStatusChange}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        words={words}
        selectedWords={selectedWords}
      />
    </GradientBackground>
  );
};
