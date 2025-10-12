import { createClient } from '@/services/supabase/server';

import type { CommonWordData } from '../words-persistence/words-persistence.types';
import type {
  BulkActionPayload,
  WordsFilterOptions,
  WordsSortOptions,
  WordsStatistics,
  WordWithProgress,
} from './words-management.types';

// Ensure all words have progress records
export const ensureProgressRecordsExist = async (
  userId: string,
): Promise<void> => {
  const supabase = await createClient();

  // Get all user's words
  const { data: words, error: wordsError } = await supabase
    .from('words')
    .select('id')
    .eq('user_id', userId);

  if (wordsError) throw wordsError;
  if (!words || words.length === 0) return;

  // Get existing progress records
  const { data: existingProgress, error: progressError } = await supabase
    .from('user_word_progress')
    .select('word_id')
    .eq('user_id', userId);

  if (progressError) throw progressError;

  const existingWordIds = new Set(
    existingProgress?.map((p) => p.word_id) || [],
  );
  const wordsWithoutProgress = words.filter((w) => !existingWordIds.has(w.id));

  if (wordsWithoutProgress.length === 0) return;

  // Create progress records for words that don't have them
  const progressRecords = wordsWithoutProgress.map((word) => ({
    user_id: userId,
    word_id: word.id,
    status: 'new' as const,
  }));

  const { error: insertError } = await supabase
    .from('user_word_progress')
    .insert(progressRecords);

  if (insertError) throw insertError;
};

// Fetch all words with progress data for the user
export const getUserWordsWithProgress = async (
  filters?: WordsFilterOptions,
  sort?: WordsSortOptions,
): Promise<WordWithProgress[]> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Ensure all words have progress records
  await ensureProgressRecordsExist(user.id);

  // Build the query
  let query = supabase
    .from('words')
    .select(
      `
        *,
        user_word_progress!inner(*)
      `,
    )
    .eq('user_id', user.id);

  // Apply filters
  if (filters) {
    if (filters.searchTerm) {
      query = query.or(
        `normalized_word.ilike.%${filters.searchTerm}%,common_data->main_translation.ilike.%${filters.searchTerm}%`,
      );
    }

    if (filters.status && filters.status.length > 0) {
      query = query.in('user_word_progress.status', filters.status);
    }

    if (filters.partOfSpeech && filters.partOfSpeech.length > 0) {
      query = query.in('part_of_speech', filters.partOfSpeech);
    }

    if (filters.isArchived !== undefined) {
      query = query.eq('user_word_progress.is_archived', filters.isArchived);
    }

    if (filters.overdue) {
      query = query.lt(
        'user_word_progress.next_review_date',
        new Date().toISOString(),
      );
    }
  }

  // Apply sorting
  if (sort) {
    // For joined table columns, we need to use a different approach
    // We'll sort by the main table columns and handle progress columns differently
    switch (sort.field) {
      case 'normalizedWord':
        query = query.order('normalized_word', {
          ascending: sort.direction === 'asc',
        });
        break;
      case 'partOfSpeech':
        query = query.order('part_of_speech', {
          ascending: sort.direction === 'asc',
        });
        break;
      case 'createdAt':
        query = query.order('created_at', {
          ascending: sort.direction === 'asc',
        });
        break;
      case 'updatedAt':
        query = query.order('updated_at', {
          ascending: sort.direction === 'asc',
        });
        break;
      case 'id':
        query = query.order('id', { ascending: sort.direction === 'asc' });
        break;
      // For progress-related fields, we'll sort in memory after fetching
      // since Supabase doesn't easily support ordering by joined table columns
      default:
        // Default sort by created_at if field is not supported
        query = query.order('created_at', {
          ascending: sort.direction === 'asc',
        });
        break;
    }
  }

  const { data, error } = await query;

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching words with progress:', error);
    throw error;
  }
  if (!data) return [];

  // Transform the data to match WordWithProgress interface
  const transformedData = data.map((word) => {
    const progress = word.user_word_progress[0];
    const commonData = word.common_data as CommonWordData;

    return {
      // Word data
      id: word.id,
      userId: word.user_id,
      normalizedWord: word.normalized_word,
      partOfSpeech: word.part_of_speech,
      commonData: word.common_data,
      partSpecificData: word.part_specific_data || {},
      createdAt: word.created_at,
      updatedAt: word.updated_at,
      targetLanguage: word.target_language,

      // Flattened common data for easier access
      mainTranslation: commonData.mainTranslation,
      additionalTranslations: commonData.additionalTranslations || [],
      exampleSentences: commonData.exampleSentences || [],
      synonyms: commonData.synonyms || [],
      collocations: commonData.collocations || [],

      // Progress data
      progressId: progress.id,
      easinessFactor: progress.easiness_factor,
      intervalDays: progress.interval_days,
      repetitionCount: progress.repetition_count,
      nextReviewDate: progress.next_review_date,
      lastReviewedAt: progress.last_reviewed_at,
      totalReviews: progress.total_reviews,
      correctReviews: progress.correct_reviews,
      consecutiveCorrect: progress.consecutive_correct,
      status: progress.status,
      isArchived: progress.is_archived,
      successRate:
        progress.total_reviews > 0
          ? (progress.correct_reviews / progress.total_reviews) * 100
          : 0,
    };
  });

  // Handle in-memory sorting for progress fields
  if (
    sort &&
    [
      'nextReviewDate',
      'status',
      'successRate',
      'easinessFactor',
      'totalReviews',
      'isArchived',
    ].includes(sort.field)
  ) {
    transformedData.sort((a, b) => {
      let aValue = a[sort.field];
      let bValue = b[sort.field];

      // Handle date comparison
      if (sort.field === 'nextReviewDate') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      // Handle boolean comparison
      if (typeof aValue === 'boolean') {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      }

      if (sort.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  return transformedData;
};

// Update archive status for a single word
export const updateWordArchiveStatus = async (
  progressId: string,
  isArchived: boolean,
): Promise<void> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from('user_word_progress')
    .update({ is_archived: isArchived, updated_at: new Date().toISOString() })
    .eq('id', progressId);

  if (error) throw error;
};

// Update status for a single word
export const updateWordStatus = async (
  progressId: string,
  status: WordWithProgress['status'],
): Promise<void> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from('user_word_progress')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', progressId);

  if (error) throw error;
};

// Perform bulk actions on multiple words
export const performBulkAction = async (
  payload: BulkActionPayload,
): Promise<void> => {
  const supabase = await createClient();

  switch (payload.action) {
    case 'archive':
      await supabase
        .from('user_word_progress')
        .update({ is_archived: true, updated_at: new Date().toISOString() })
        .in('word_id', payload.wordIds);
      break;

    case 'unarchive':
      await supabase
        .from('user_word_progress')
        .update({ is_archived: false, updated_at: new Date().toISOString() })
        .in('word_id', payload.wordIds);
      break;

    case 'changeStatus':
      if (payload.data?.newStatus) {
        await supabase
          .from('user_word_progress')
          .update({
            status: payload.data.newStatus,
            updated_at: new Date().toISOString(),
          })
          .in('word_id', payload.wordIds);
      }
      break;

    case 'delete':
      // First delete progress records
      await supabase
        .from('user_word_progress')
        .delete()
        .in('word_id', payload.wordIds);

      // Then delete the words themselves
      await supabase.from('words').delete().in('id', payload.wordIds);
      break;
  }
};

// Get statistics for the dashboard
export const getWordsStatistics = async (): Promise<WordsStatistics> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get all progress records for statistics
  const { data: progressData, error } = await supabase
    .from('user_word_progress')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;
  if (!progressData) {
    return {
      totalWords: 0,
      wordsByStatus: {
        new: 0,
        learning: 0,
        review: 0,
        graduated: 0,
        lapsed: 0,
      },
      overallSuccessRate: 0,
      wordsDueTodayCount: 0,
      currentStreak: 0,
      longestStreak: 0,
      recentActivity: [],
    };
  }

  // Calculate statistics
  const wordsByStatus = progressData.reduce(
    (acc, progress) => {
      acc[progress.status as WordWithProgress['status']]++;
      return acc;
    },
    {
      new: 0,
      learning: 0,
      review: 0,
      graduated: 0,
      lapsed: 0,
    },
  );

  const totalReviews = progressData.reduce(
    (sum, p) => sum + p.total_reviews,
    0,
  );
  const correctReviews = progressData.reduce(
    (sum, p) => sum + p.correct_reviews,
    0,
  );
  const overallSuccessRate =
    totalReviews > 0 ? (correctReviews / totalReviews) * 100 : 0;

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const wordsDueTodayCount = progressData.filter(
    (p) => new Date(p.next_review_date) <= today && !p.is_archived,
  ).length;

  return {
    totalWords: progressData.length,
    wordsByStatus,
    overallSuccessRate,
    wordsDueTodayCount,
    currentStreak: 0, // TODO: Implement streak calculation
    longestStreak: 0, // TODO: Implement streak calculation
    recentActivity: [], // TODO: Implement recent activity
  };
};
