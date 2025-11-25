'use client';

import { useCallback, useEffect, useState } from 'react';
import { LuCheck, LuPlus } from 'react-icons/lu';

import { Button, Dialog, Flex, Portal, Spinner, Text } from '@chakra-ui/react';

import { toaster } from '@/components/toaster';

import {
  addItemToCollection,
  getCollectionsForItem,
  getUserCollections,
} from '../collections.actions';
import type { Collection, CollectionWithCount } from '../collections.types';
import { CollectionManagerDialog } from './collection-manager-dialog';

interface CollectionSelectionDialogProps {
  isOpen: boolean;
  vocabularyItemId: string | null;
  onClose: () => void;
}

export const CollectionSelectionDialog = ({
  isOpen,
  vocabularyItemId,
  onClose,
}: CollectionSelectionDialogProps) => {
  const [allCollections, setAllCollections] = useState<CollectionWithCount[]>(
    [],
  );
  const [itemCollections, setItemCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!vocabularyItemId) return;

    setIsLoading(true);
    try {
      const [allResult, itemResult] = await Promise.all([
        getUserCollections(),
        getCollectionsForItem({ vocabularyItemId }),
      ]);

      if (allResult.success && allResult.data) {
        setAllCollections(allResult.data);
      }

      if (itemResult.success && itemResult.data) {
        setItemCollections(itemResult.data);
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
  }, [vocabularyItemId]);

  useEffect(() => {
    if (isOpen && vocabularyItemId) {
      fetchData();
    }
  }, [isOpen, vocabularyItemId, fetchData]);

  const handleAddToCollection = async (collectionId: string) => {
    if (!vocabularyItemId) return;

    setActionInProgress(true);
    try {
      const result = await addItemToCollection({
        collectionId,
        vocabularyItemId,
      });

      if (result.success) {
        toaster.create({
          title: 'Success',
          description: 'Added to collection',
          type: 'success',
        });
        await fetchData();
      } else {
        toaster.create({
          title: 'Error',
          description: result.error || 'Failed to add to collection',
          type: 'error',
        });
      }
    } catch {
      toaster.create({
        title: 'Error',
        description: 'Failed to add to collection',
        type: 'error',
      });
    } finally {
      setActionInProgress(false);
    }
  };

  const isInCollection = (collectionId: string) => {
    return itemCollections.some((c) => c.id === collectionId);
  };

  const handleManageCollections = () => {
    setIsManageDialogOpen(true);
  };

  const handleManageDialogClose = () => {
    setIsManageDialogOpen(false);
    fetchData();
  };

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={onClose}>
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
                ) : allCollections.length === 0 ? (
                  <Flex direction="column" align="center" gap={4} py={6}>
                    <Text color="gray.500" textAlign="center">
                      You don&apos;t have any collections yet
                    </Text>
                    <Button
                      onClick={handleManageCollections}
                      colorScheme="blue"
                      size="sm"
                    >
                      <LuPlus />
                      Create Collection
                    </Button>
                  </Flex>
                ) : (
                  <Flex direction="column" gap={2}>
                    {allCollections.map((collection) => {
                      const inCollection = isInCollection(collection.id);
                      return (
                        <Button
                          key={collection.id}
                          onClick={() => handleAddToCollection(collection.id)}
                          disabled={actionInProgress || inCollection}
                          variant={inCollection ? 'subtle' : 'outline'}
                          justifyContent="space-between"
                          w="full"
                          h="auto"
                          py={3}
                          px={4}
                        >
                          <Flex direction="column" align="flex-start" gap={1}>
                            <Text fontWeight="medium" fontSize="sm">
                              {collection.name}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {collection.itemCount}{' '}
                              {collection.itemCount === 1 ? 'item' : 'items'}
                            </Text>
                          </Flex>
                          {inCollection && <LuCheck size={20} />}
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
                {allCollections.length > 0 && (
                  <Button
                    onClick={handleManageCollections}
                    variant="outline"
                    size="md"
                  >
                    Manage Collections
                  </Button>
                )}
                <Dialog.ActionTrigger asChild>
                  <Button onClick={onClose} size="md" flex="1">
                    Done
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <CollectionManagerDialog
        isOpen={isManageDialogOpen}
        onClose={handleManageDialogClose}
        onCollectionsChange={fetchData}
      />
    </>
  );
};
