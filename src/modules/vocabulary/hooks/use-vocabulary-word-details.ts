import { useCallback, useState } from 'react';

import { toaster } from '@/components/toaster';
import { fetchUserWordByNormalizedWordAndPos } from '@/modules/vocabulary/vocabulary.actions';
import type { VocabularyItem } from '@/modules/vocabulary/vocabulary.types';

export const useVocabularyWordDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [isLoadingWord, setIsLoadingWord] = useState(false);

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

  return {
    isModalOpen,
    selectedWord,
    isLoadingWord,
    handleWordClick,
    handleModalClose,
  };
};
