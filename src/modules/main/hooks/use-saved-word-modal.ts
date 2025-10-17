import { useState } from 'react';

import { toaster } from '@/components/toaster';
import type { VocabularyItem } from '@/modules/words-persistence/vocabulary.types';
import { deleteWord } from '@/modules/words-persistence/words-persistence.actions';

interface UseVocabularyItemModalProps {
  savedWord: VocabularyItem | null;
  onClose: () => void;
  onWordDeleted: () => void;
}

export const useVocabularyItemModal = ({
  savedWord,
  onClose,
  onWordDeleted,
}: UseVocabularyItemModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!savedWord) return;

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
        onWordDeleted();
        onClose();
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
