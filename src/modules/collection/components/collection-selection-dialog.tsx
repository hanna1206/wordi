'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { LuCheck } from 'react-icons/lu';

import { Button, Dialog, Flex, Portal, Spinner, Text } from '@chakra-ui/react';

import { toaster } from '@/components/toaster';

import {
  addItemToCollection,
  getCollectionsForItem,
  getUserCollections,
  removeItemFromCollection,
} from '../collections.actions';
import type { Collection, CollectionWithCount } from '../collections.types';

interface CollectionSelectionDialogProps {
  isOpen: boolean;
  vocabularyItemId: string | null;
  onClose: () => void;
  collections?: CollectionWithCount[];
}

export const CollectionSelectionDialog = ({
  isOpen,
  vocabularyItemId,
  onClose,
  collections,
}: CollectionSelectionDialogProps) => {
  const [fallbackCollections, setFallbackCollections] = useState<
    CollectionWithCount[]
  >([]);
  const [itemCollections, setItemCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSelections, setIsSavingSelections] = useState(false);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>(
    [],
  );

  const resolvedCollections = useMemo(
    () => collections ?? fallbackCollections,
    [collections, fallbackCollections],
  );

  const fetchCollections = useCallback(async () => {
    if (collections) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await getUserCollections();
      if (result.success && result.data) {
        setFallbackCollections(result.data);
      }
    } catch {
      toaster.create({
        title: 'Error',
        description: 'Failed to load collections',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [collections]);

  const fetchItemCollections = useCallback(async () => {
    if (!vocabularyItemId) return;

    try {
      const result = await getCollectionsForItem({ vocabularyItemId });
      if (result.success && result.data) {
        setItemCollections(result.data);
        setSelectedCollectionIds(
          result.data.map((collection) => collection.id),
        );
      } else {
        setItemCollections([]);
        setSelectedCollectionIds([]);
      }
    } catch {
      toaster.create({
        title: 'Error',
        description: 'Failed to load collections for item',
        type: 'error',
      });
    }
  }, [vocabularyItemId]);

  useEffect(() => {
    if (isOpen && vocabularyItemId) {
      void fetchCollections();
      void fetchItemCollections();
    }
  }, [fetchCollections, fetchItemCollections, isOpen, vocabularyItemId]);

  const toggleCollectionSelection = (collectionId: string) => {
    setSelectedCollectionIds((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId],
    );
  };

  const handleSaveSelections = async () => {
    if (!vocabularyItemId) return;

    const currentIds = itemCollections.map((collection) => collection.id);
    const toAdd = selectedCollectionIds.filter(
      (collectionId) => !currentIds.includes(collectionId),
    );
    const toRemove = currentIds.filter(
      (collectionId) => !selectedCollectionIds.includes(collectionId),
    );

    if (toAdd.length === 0 && toRemove.length === 0) {
      setSelectedCollectionIds([]);
      onClose();
      return;
    }

    setIsSavingSelections(true);
    try {
      for (const collectionId of toAdd) {
        const result = await addItemToCollection({
          collectionId,
          vocabularyItemId,
        });

        if (!result.success) {
          throw new Error(result.error || 'Failed to add to collection');
        }
      }

      for (const collectionId of toRemove) {
        const result = await removeItemFromCollection({
          collectionId,
          vocabularyItemId,
        });

        if (!result.success) {
          throw new Error(result.error || 'Failed to remove from collection');
        }
      }

      setItemCollections(
        resolvedCollections.filter((collection) =>
          selectedCollectionIds.includes(collection.id),
        ),
      );

      setSelectedCollectionIds([]);
      onClose();
    } catch (error) {
      toaster.create({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update collections',
        type: 'error',
      });
    } finally {
      setIsSavingSelections(false);
    }
  };

  const handleClose = () => {
    setSelectedCollectionIds([]);
    onClose();
  };

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={handleClose}>
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.600" />
          <Dialog.Positioner
            position="fixed"
            inset={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
          >
            <Dialog.Content
              maxW={{ base: '90vw', md: 'md' }}
              w="full"
              shadow="lg"
            >
              <Dialog.Header>
                <Dialog.Title>Add to Collection</Dialog.Title>
                <Dialog.CloseTrigger />
              </Dialog.Header>

              <Dialog.Body p={6}>
                {isLoading ? (
                  <Flex justify="center" py={8}>
                    <Spinner size="lg" />
                  </Flex>
                ) : resolvedCollections.length === 0 ? (
                  <Flex direction="column" align="center" gap={4} py={6}>
                    <Text color="gray.500" textAlign="center">
                      You don&apos;t have any collections yet. Create one via
                      Vocabulary page
                    </Text>
                  </Flex>
                ) : (
                  <Flex direction="column" gap={2}>
                    {resolvedCollections.map((collection) => {
                      const isSelected = selectedCollectionIds.includes(
                        collection.id,
                      );
                      return (
                        <Button
                          key={collection.id}
                          onClick={() =>
                            toggleCollectionSelection(collection.id)
                          }
                          disabled={isSavingSelections || isLoading}
                          variant={isSelected ? 'solid' : 'outline'}
                          colorScheme={isSelected ? 'blue' : 'gray'}
                          justifyContent="space-between"
                          w="full"
                          h="auto"
                          py={3}
                          px={4}
                        >
                          <Text fontWeight="medium" fontSize="sm">
                            {collection.name}
                          </Text>
                          {isSelected && <LuCheck size={20} />}
                        </Button>
                      );
                    })}
                  </Flex>
                )}
              </Dialog.Body>

              <Dialog.Footer
                borderTopWidth="1px"
                borderColor="gray.100"
                display="flex"
                gap={3}
              >
                <Button
                  size="md"
                  flex="1"
                  onClick={handleSaveSelections}
                  loading={isSavingSelections}
                  disabled={
                    isSavingSelections || isLoading || !vocabularyItemId
                  }
                >
                  Done
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
