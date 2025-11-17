export const STORAGE_KEY = 'flashcards_due_meta_v1';

export interface DueCountCache {
  date: string;
  dueCount: number;
  totalWords: number;
}

export const getCachedDueCount = (): DueCountCache | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (
      typeof parsed.dueCount !== 'number' ||
      typeof parsed.totalWords !== 'number' ||
      typeof parsed.date !== 'string'
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const setCachedDueCount = (
  dueCount: number,
  totalWords: number,
): void => {
  try {
    const cache: DueCountCache = {
      date: new Date().toISOString(),
      dueCount,
      totalWords,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Silently fail if localStorage is unavailable
  }
};

export const isCacheValid = (cache: DueCountCache): boolean => {
  try {
    const cacheDate = new Date(cache.date);
    const today = new Date();

    return cacheDate.toDateString() === today.toDateString();
  } catch {
    return false;
  }
};

export const clearDueCountCache = (): void => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail if localStorage is unavailable
  }
};
