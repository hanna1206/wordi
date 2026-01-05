'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getDueWordsCount } from '@/modules/flashcards/flashcards.actions';

interface DueWordsCountState {
  dueCount: number;
  totalWords: number;
  isDueCountLoading: boolean;
  lastFetchedAt: Date | null;
  dueCountError: string | null;
}

interface DueWordsCountActions {
  refetchDueCount: () => Promise<void>;
  adjustDueCount: (delta: number) => void;
}

interface DueWordsCountContextValue
  extends DueWordsCountState, DueWordsCountActions {}

const DueWordsCountContext = createContext<DueWordsCountContextValue | null>(
  null,
);

interface DueWordsCountProviderProps {
  children: ReactNode;
}

export const DueWordsCountProvider = ({
  children,
}: DueWordsCountProviderProps) => {
  const [state, setState] = useState<DueWordsCountState>({
    dueCount: 0,
    totalWords: 0,
    isDueCountLoading: true,
    lastFetchedAt: null,
    dueCountError: null,
  });

  const refetchDueCount = useCallback(async () => {
    try {
      const result = await getDueWordsCount({});

      if (result.success && result.data) {
        setState({
          dueCount: result.data.dueCount,
          totalWords: result.data.totalWords,
          isDueCountLoading: false,
          lastFetchedAt: new Date(),
          dueCountError: null,
        });
      } else {
        setState((prev) => ({
          ...prev,
          isDueCountLoading: false,
          dueCountError: result.error ?? 'Unknown error',
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        isDueCountLoading: false,
        dueCountError: 'Network error',
      }));
    }
  }, []);

  const adjustDueCount = useCallback((delta: number) => {
    setState((prev) => ({
      ...prev,
      dueCount: Math.max(0, prev.dueCount + delta),
    }));
  }, []);

  useEffect(() => {
    refetchDueCount();
  }, [refetchDueCount]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const lastFetch = state.lastFetchedAt?.getTime() ?? 0;
        const fiveMinutes = 5 * 60 * 1000;

        if (now - lastFetch > fiveMinutes) {
          refetchDueCount();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.lastFetchedAt, refetchDueCount]);

  const contextValue = useMemo(
    () => ({
      dueCount: state.dueCount,
      totalWords: state.totalWords,
      isDueCountLoading: state.isDueCountLoading,
      lastFetchedAt: state.lastFetchedAt,
      dueCountError: state.dueCountError,
      refetchDueCount,
      adjustDueCount,
    }),
    [
      state.dueCount,
      state.totalWords,
      state.isDueCountLoading,
      state.lastFetchedAt,
      state.dueCountError,
      refetchDueCount,
      adjustDueCount,
    ],
  );

  return (
    <DueWordsCountContext.Provider value={contextValue}>
      {children}
    </DueWordsCountContext.Provider>
  );
};

export const useDueWordsCount = () => {
  const context = useContext(DueWordsCountContext);

  if (!context) {
    throw new Error(
      'useDueWordsCount must be used within DueWordsCountProvider',
    );
  }

  return context;
};
