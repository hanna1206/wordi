'use client';

import { useEffect, useState } from 'react';

import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  Flex,
  Portal,
} from '@chakra-ui/react';

import { getUserCollections } from '@/modules/collection/collections.actions';
import type { CollectionWithCount } from '@/modules/collection/collections.types';

import { ExerciseType } from '../practice.const';
import type { VocabularySource } from '../practice.types';
import { ExerciseTypeSelector } from './exercise-type-selector';
import { VocabularySourceSelector } from './vocabulary-source-selector';

interface PracticeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PracticeDialog({ isOpen, onClose }: PracticeDialogProps) {
  const [selectedExerciseType, setSelectedExerciseType] =
    useState<ExerciseType | null>(null);
  const [selectedSource, setSelectedSource] = useState<VocabularySource | null>(
    null,
  );
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);

  // Load collections when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoadingCollections(true);
      getUserCollections()
        .then((result) => {
          if (result.success && result.data) {
            setCollections(result.data);
          }
        })
        .finally(() => {
          setIsLoadingCollections(false);
        });
    }
  }, [isOpen]);

  const handleOpenChange = (details: { open: boolean }) => {
    if (!details.open) {
      onClose();
      // Reset state on close
      setSelectedExerciseType(null);
      setSelectedSource(null);
    }
  };

  const handlePractice = () => {
    if (!selectedExerciseType || !selectedSource) return;

    // TODO: Navigate to practice page with configuration
    // This will be implemented when exercise mechanics are added
    // For now, just close the dialog
    onClose();
  };

  const isPracticeButtonEnabled =
    selectedExerciseType !== null && selectedSource !== null;

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={handleOpenChange}
      size={{ mdDown: 'full', md: 'lg' }}
    >
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent borderRadius={{ base: 0, md: 'lg' }} overflowY="auto">
            <DialogHeader>
              <DialogTitle>Practice Settings</DialogTitle>
              <DialogCloseTrigger />
            </DialogHeader>

            <DialogBody py={{ base: 4, md: 3 }}>
              <Flex direction="column" gap={{ base: 4, md: 3 }}>
                {/* Exercise Type Section */}
                <ExerciseTypeSelector
                  selectedType={selectedExerciseType}
                  onSelect={setSelectedExerciseType}
                />

                {/* Vocabulary Source Section */}
                <VocabularySourceSelector
                  selectedSource={selectedSource}
                  onSelect={setSelectedSource}
                  collections={collections}
                  isLoading={isLoadingCollections}
                />
              </Flex>
            </DialogBody>

            <DialogFooter pt={3} gap={2}>
              <Button size="md" flex={1} variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                size="md"
                flex={1}
                onClick={handlePractice}
                disabled={!isPracticeButtonEnabled}
              >
                Practice
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
}
