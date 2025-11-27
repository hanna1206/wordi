'use client';

import { useEffect, useState } from 'react';
import { LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu';

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
  Input,
  Portal,
  Spinner,
  Text,
} from '@chakra-ui/react';

import { toaster } from '@/components/toaster';

import {
  createCollection,
  deleteCollection,
  getUserCollections,
  updateCollection,
} from '../collections.actions';
import type { CollectionWithCount } from '../collections.types';

interface CollectionManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCollectionsChange?: () => void;
}

export const CollectionManagerDialog = ({
  isOpen,
  onClose,
  onCollectionsChange,
}: CollectionManagerDialogProps) => {
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Fetch collections when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen]);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const result = await getUserCollections();
      if (result.success && result.data) {
        setCollections(result.data);
      } else {
        toaster.create({
          title: 'Error',
          description: result.error || 'Failed to load collections',
          type: 'error',
        });
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
  };

  const handleCreate = async () => {
    if (!newCollectionName.trim()) {
      toaster.create({
        title: 'Error',
        description: 'Collection name cannot be empty',
        type: 'error',
      });
      return;
    }

    setActionInProgress(true);
    try {
      const result = await createCollection({ name: newCollectionName.trim() });
      if (result.success) {
        toaster.create({
          title: 'Success',
          description: 'Collection created successfully',
          type: 'success',
        });
        setNewCollectionName('');
        setIsCreating(false);
        await fetchCollections();
        onCollectionsChange?.();
      } else {
        toaster.create({
          title: 'Error',
          description: result.error || 'Failed to create collection',
          type: 'error',
        });
      }
    } catch {
      toaster.create({
        title: 'Error',
        description: 'Failed to create collection',
        type: 'error',
      });
    } finally {
      setActionInProgress(false);
    }
  };

  const handleStartEdit = (collection: CollectionWithCount) => {
    setEditingId(collection.id);
    setEditingName(collection.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async (collectionId: string) => {
    if (!editingName.trim()) {
      toaster.create({
        title: 'Error',
        description: 'Collection name cannot be empty',
        type: 'error',
      });
      return;
    }

    setActionInProgress(true);
    try {
      const result = await updateCollection({
        collectionId,
        name: editingName.trim(),
      });
      if (result.success) {
        toaster.create({
          title: 'Success',
          description: 'Collection renamed successfully',
          type: 'success',
        });
        setEditingId(null);
        setEditingName('');
        await fetchCollections();
        onCollectionsChange?.();
      } else {
        toaster.create({
          title: 'Error',
          description: result.error || 'Failed to rename collection',
          type: 'error',
        });
      }
    } catch {
      toaster.create({
        title: 'Error',
        description: 'Failed to rename collection',
        type: 'error',
      });
    } finally {
      setActionInProgress(false);
    }
  };

  const handleDelete = async (collectionId: string) => {
    setActionInProgress(true);
    try {
      const result = await deleteCollection({ collectionId });
      if (result.success) {
        toaster.create({
          title: 'Success',
          description: 'Collection deleted successfully',
          type: 'success',
        });
        setDeletingId(null);
        await fetchCollections();
        onCollectionsChange?.();
      } else {
        toaster.create({
          title: 'Error',
          description: result.error || 'Failed to delete collection',
          type: 'error',
        });
      }
    } catch {
      toaster.create({
        title: 'Error',
        description: 'Failed to delete collection',
        type: 'error',
      });
    } finally {
      setActionInProgress(false);
    }
  };

  const handleClose = () => {
    setIsCreating(false);
    setNewCollectionName('');
    setEditingId(null);
    setEditingName('');
    setDeletingId(null);
    onClose();
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) {
          handleClose();
        }
      }}
      size={{ mdDown: 'full', md: 'lg' }}
    >
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent borderRadius={{ base: 0, md: 'lg' }} overflowY="auto">
            <DialogHeader>
              <DialogTitle>Manage Collections</DialogTitle>
              <DialogCloseTrigger />
            </DialogHeader>

            <DialogBody py={{ base: 4, md: 3 }}>
              {isLoading ? (
                <Flex justify="center" align="center" py={8}>
                  <Spinner size="lg" />
                </Flex>
              ) : (
                <Flex direction="column" gap={3}>
                  {/* Create new collection section */}
                  {isCreating ? (
                    <Flex
                      gap={2}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.50"
                    >
                      <Input
                        placeholder="Collection name"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCreate();
                          } else if (e.key === 'Escape') {
                            setIsCreating(false);
                            setNewCollectionName('');
                          }
                        }}
                        autoFocus
                        disabled={actionInProgress}
                        size="sm"
                      />
                      <Button
                        onClick={handleCreate}
                        disabled={actionInProgress}
                        size="sm"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setIsCreating(false);
                          setNewCollectionName('');
                        }}
                        disabled={actionInProgress}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </Flex>
                  ) : (
                    <Button
                      onClick={() => setIsCreating(true)}
                      variant="outline"
                      size="sm"
                      disabled={actionInProgress}
                    >
                      <LuPlus />
                      New Collection
                    </Button>
                  )}

                  {/* Collections list */}
                  {collections.length === 0 ? (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      py={8}
                      gap={2}
                    >
                      <Text color="gray.500" fontSize="sm">
                        No collections yet
                      </Text>
                      <Text color="gray.400" fontSize="xs">
                        Create your first collection to organize vocabulary
                      </Text>
                    </Flex>
                  ) : (
                    <Flex direction="column" gap={2}>
                      {collections.map((collection) => (
                        <Flex
                          key={collection.id}
                          p={3}
                          borderWidth="1px"
                          borderRadius="md"
                          align="center"
                          gap={2}
                          bg={deletingId === collection.id ? 'red.50' : 'white'}
                        >
                          {editingId === collection.id ? (
                            <>
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveEdit(collection.id);
                                  } else if (e.key === 'Escape') {
                                    handleCancelEdit();
                                  }
                                }}
                                autoFocus
                                disabled={actionInProgress}
                                size="sm"
                                flex={1}
                              />
                              <Button
                                onClick={() => handleSaveEdit(collection.id)}
                                disabled={actionInProgress}
                                size="sm"
                              >
                                Save
                              </Button>
                              <Button
                                onClick={handleCancelEdit}
                                disabled={actionInProgress}
                                variant="outline"
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </>
                          ) : deletingId === collection.id ? (
                            <>
                              <Flex direction="column" flex={1}>
                                <Text fontWeight="medium" fontSize="sm">
                                  Delete &quot;{collection.name}&quot;?
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  This will remove the collection but keep all
                                  vocabulary items
                                </Text>
                              </Flex>
                              <Button
                                onClick={() => handleDelete(collection.id)}
                                disabled={actionInProgress}
                                size="sm"
                                colorScheme="red"
                              >
                                Delete
                              </Button>
                              <Button
                                onClick={() => setDeletingId(null)}
                                disabled={actionInProgress}
                                variant="outline"
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Flex direction="column" flex={1}>
                                <Text fontWeight="medium" fontSize="sm">
                                  {collection.name}
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  {collection.itemCount}{' '}
                                  {collection.itemCount === 1
                                    ? 'item'
                                    : 'items'}
                                </Text>
                              </Flex>
                              <Button
                                onClick={() => handleStartEdit(collection)}
                                disabled={actionInProgress}
                                variant="ghost"
                                size="sm"
                              >
                                <LuPencil />
                              </Button>
                              <Button
                                onClick={() => setDeletingId(collection.id)}
                                disabled={actionInProgress}
                                variant="ghost"
                                size="sm"
                                colorScheme="red"
                              >
                                <LuTrash2 />
                              </Button>
                            </>
                          )}
                        </Flex>
                      ))}
                    </Flex>
                  )}
                </Flex>
              )}
            </DialogBody>

            <DialogFooter pt={3}>
              <Button onClick={handleClose} size="md">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
};
