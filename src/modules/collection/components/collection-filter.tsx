'use client';

import { useEffect, useState } from 'react';
import { LuFolderOpen } from 'react-icons/lu';

import { Button, Icon, Menu, Text } from '@chakra-ui/react';

import { toaster } from '@/components/toaster';

import { getUserCollections } from '../collections.actions';
import type { CollectionWithCount } from '../collections.types';

interface CollectionFilterProps {
  selectedCollectionId: string | null;
  onCollectionChange: (collectionId: string | null) => void;
}

export const CollectionFilter = ({
  selectedCollectionId,
  onCollectionChange,
}: CollectionFilterProps) => {
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch collections on mount
  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      const result = await getUserCollections();

      if (result.success && result.data) {
        setCollections(result.data);
      } else {
        toaster.create({
          type: 'error',
          title: 'Failed to load collections',
          description: result.error,
        });
      }
      setIsLoading(false);
    };

    void fetchCollections();
  }, []);

  // Get display label for selected collection
  const getSelectedLabel = () => {
    if (!selectedCollectionId) {
      return 'All';
    }
    const collection = collections.find((c) => c.id === selectedCollectionId);
    return collection ? collection.name : 'All';
  };

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          variant="outline"
          size="lg"
          aria-label="Filter by collection"
          disabled={isLoading}
        >
          <Icon as={LuFolderOpen} fontSize="md" />
          <Text display={{ base: 'none', md: 'block' }}>
            {getSelectedLabel()}
          </Text>
        </Button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item
            value="all"
            onClick={() => onCollectionChange(null)}
            fontWeight={!selectedCollectionId ? 'semibold' : 'normal'}
          >
            All
          </Menu.Item>
          {collections.map((collection) => (
            <Menu.Item
              key={collection.id}
              value={collection.id}
              onClick={() => onCollectionChange(collection.id)}
              fontWeight={
                selectedCollectionId === collection.id ? 'semibold' : 'normal'
              }
            >
              {collection.name}
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
};
