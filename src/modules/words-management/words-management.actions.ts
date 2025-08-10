'use server';

import { WordsManagementService } from './words-management.service';
import type {
  BulkActionPayload,
  WordsFilterOptions,
  WordsSortOptions,
  WordsStatistics,
  WordWithProgress,
} from './words-management.types';

export const getUserWordsWithProgress = async (
  filters?: WordsFilterOptions,
  sort?: WordsSortOptions,
): Promise<WordWithProgress[]> => {
  try {
    return await WordsManagementService.getUserWordsWithProgress(filters, sort);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching words with progress:', error);
    throw new Error('Failed to fetch words');
  }
};

export const updateWordArchiveStatus = async (
  progressId: string,
  isArchived: boolean,
): Promise<void> => {
  try {
    await WordsManagementService.updateWordArchiveStatus(
      progressId,
      isArchived,
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating archive status:', error);
    throw new Error('Failed to update archive status');
  }
};

export const updateWordStatus = async (
  progressId: string,
  status: WordWithProgress['status'],
): Promise<void> => {
  try {
    await WordsManagementService.updateWordStatus(progressId, status);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating word status:', error);
    throw new Error('Failed to update word status');
  }
};

export const performBulkAction = async (
  payload: BulkActionPayload,
): Promise<void> => {
  try {
    await WordsManagementService.performBulkAction(payload);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error performing bulk action:', error);
    throw new Error('Failed to perform bulk action');
  }
};

export const getWordsStatistics = async (): Promise<WordsStatistics> => {
  try {
    return await WordsManagementService.getWordsStatistics();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching words statistics:', error);
    throw new Error('Failed to fetch statistics');
  }
};
