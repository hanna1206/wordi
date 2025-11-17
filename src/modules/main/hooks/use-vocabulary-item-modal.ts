import { useState } from 'react';

import { toaster } from '@/components/toaster';
import { useDueWordsCount } from '@/modules/flashcards/context/due-words-count-context';
import { deleteWord } from '@/modules/vocabulary/vocabulary.actions';
import type { VocabularyItem } from '@/modules/vocabulary/vocabulary.types';

interface UseVocabularyItemModalProps {
  savedWord: VocabularyItem | null;
  onClose: () => void;
  onWordDeleted?: () => void;
  allowDelete?: boolean;
}

export const useVocabularyItemModal = ({
  savedWord,
  onClose,
  onWordDeleted,
  allowDelete = true,
}: UseVocabularyItemModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { refetchDueCount } = useDueWordsCount();
  const handleWordDeleted = onWordDeleted ?? (() => undefined);

  const handleDeleteClick = () => {
    if (!allowDelete) return;
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!savedWord || !allowDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteWord({ wordId: savedWord.id });

      if (result.success) {
        toaster.create({
          title: 'Word deleted',
          description: 'The word has been removed from your saved words.',
          type: 'success',
          duration: 3000,
        });
        handleWordDeleted();
        onClose();
        refetchDueCount();
      } else {
        toaster.create({
          title: 'Error',
          description: result.error || 'Failed to delete word',
          type: 'error',
          duration: 5000,
        });
      }
    } catch {
      toaster.create({
        title: 'Error',
        description: 'Failed to delete word',
        type: 'error',
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!allowDelete) return;
    setShowDeleteConfirm(false);
  };

  // Wrap onClose to reset confirmation state when modal closes
  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  return {
    isDeleting,
    showDeleteConfirm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleClose,
  };
};
