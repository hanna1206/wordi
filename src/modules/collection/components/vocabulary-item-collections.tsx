'use client';

import { useCallback, useEffect, useState } from 'react';
import { LuCheck, LuPlus, LuX } from 'react-icons/lu';

import {
  Badge,
  Button,
  Flex,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Spinner,
  Text,
} from '@chakra-ui/react';

import { toaster } from '@/components/toaster';

import {
  addItemToCollection,
  getCollectionsForItem,
  getUserCollections,
  removeItemFromCollection,
} from '../collections.actions';
import type { Collection, CollectionWithCount } from '../collections.types';

interface VocabularyItemCollectionsProps {
  vocabularyItemId: string;
}

export const VocabularyItemCollections = ({
  vocabularyItemId,
}: VocabularyItemCollectionsProps) => {
  const [allCollections, setAllCollections] = useState<CollectionWithCount[]>(
    [],
  );
  const [itemCollections, setItemCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);

  const fetchData = useCallback(async () => {
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
    fetchData();
  }, [fetchData]);

  const handleAddToCollection = async (collectionId: string) => {
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

  const handleRemoveFromCollection = async (collectionId: string) => {
    setActionInProgress(true);
    try {
      const result = await removeItemFromCollection({
        collectionId,
        vocabularyItemId,
      });

      if (result.success) {
        toaster.create({
          title: 'Success',
          description: 'Removed from collection',
          type: 'success',
        });
        await fetchData();
      } else {
        toaster.create({
          title: 'Error',
          description: result.error || 'Failed to remove from collection',
          type: 'error',
        });
      }
    } catch {
      toaster.create({
        title: 'Error',
        description: 'Failed to remove from collection',
        type: 'error',
      });
    } finally {
      setActionInProgress(false);
    }
  };

  const isInCollection = (collectionId: string) => {
    return itemCollections.some((c) => c.id === collectionId);
  };

  if (isLoading) {
    return (
      <Flex direction="column" gap={2}>
        <Text fontSize="sm" fontWeight="medium" color="gray.700">
          Collections
        </Text>
        <Flex justify="center" py={2}>
          <Spinner size="sm" />
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap={2}>
      <Text fontSize="sm" fontWeight="medium" color="gray.700">
        Collections
      </Text>

      {/* Display collection badges with add button */}
      <Flex gap={2} flexWrap="wrap" align="center">
        {itemCollections.map((collection) => (
          <Badge
            key={collection.id}
            colorScheme="blue"
            variant="subtle"
            display="flex"
            alignItems="center"
            gap={1}
            px={2}
            py={1}
            borderRadius="md"
          >
            <Text fontSize="xs">{collection.name}</Text>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => handleRemoveFromCollection(collection.id)}
              disabled={actionInProgress}
              p={0}
              minW="auto"
              h="auto"
              _hover={{ bg: 'transparent' }}
            >
              <LuX size={12} />
            </Button>
          </Badge>
        ))}

        {allCollections.length > 0 && (
          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                size="xs"
                variant="outline"
                disabled={actionInProgress}
                colorScheme="blue"
                p={1}
                minW="auto"
                h="auto"
              >
                <LuPlus size={14} />
              </Button>
            </MenuTrigger>
            <MenuPositioner>
              <MenuContent>
                {allCollections.map((collection) => {
                  const inCollection = isInCollection(collection.id);
                  return (
                    <MenuItem
                      key={collection.id}
                      value={collection.id}
                      onClick={() => {
                        if (inCollection) {
                          handleRemoveFromCollection(collection.id);
                        } else {
                          handleAddToCollection(collection.id);
                        }
                      }}
                      disabled={actionInProgress}
                    >
                      <Flex align="center" justify="space-between" w="full">
                        <Text fontSize="sm">{collection.name}</Text>
                        {inCollection && <LuCheck color="green" size={16} />}
                      </Flex>
                    </MenuItem>
                  );
                })}
              </MenuContent>
            </MenuPositioner>
          </MenuRoot>
        )}

        {itemCollections.length === 0 && allCollections.length === 0 && (
          <Text fontSize="xs" color="gray.400" fontStyle="italic">
            Create collections to organize your vocabulary
          </Text>
        )}

        {itemCollections.length === 0 && allCollections.length > 0 && (
          <Text fontSize="xs" color="gray.500">
            Not in any collection
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
