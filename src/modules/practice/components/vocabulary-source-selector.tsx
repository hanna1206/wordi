'use client';

import type { IconType } from 'react-icons';
import {
  LuFolderOpen,
  LuInbox,
  LuSparkles,
  LuTrendingDown,
} from 'react-icons/lu';

import { Flex, Icon, RadioCard, Spinner, Text } from '@chakra-ui/react';

import type { CollectionWithCount } from '@/modules/collection/collections.types';

import type { VocabularySource } from '../practice.types';

interface VocabularySourceSelectorProps {
  selectedSource: VocabularySource | null;
  onSelect: (source: VocabularySource) => void;
  collections: CollectionWithCount[];
  isLoading: boolean;
}

interface DefaultSourceOption {
  type: 'worst-known' | 'new-words' | 'without-collection';
  icon: IconType;
  label: string;
  description: string;
}

const defaultSourceOptions: DefaultSourceOption[] = [
  {
    type: 'worst-known',
    icon: LuTrendingDown,
    label: '20 Worst Known Words',
    description: 'Practice words you struggle with most',
  },
  {
    type: 'new-words',
    icon: LuSparkles,
    label: '20 New Words',
    description: 'Recently added vocabulary items',
  },
  {
    type: 'without-collection',
    icon: LuInbox,
    label: 'Words Without Collection',
    description: 'Uncategorized vocabulary items',
  },
];

export function VocabularySourceSelector({
  selectedSource,
  onSelect,
  collections,
  isLoading,
}: VocabularySourceSelectorProps) {
  const handleSelect = (value: string) => {
    // Parse the value to determine if it's a default source or collection
    if (value.startsWith('collection-')) {
      const collectionId = value.replace('collection-', '');
      const collection = collections.find((c) => c.id === collectionId);
      if (collection) {
        onSelect({
          type: 'collection',
          id: collection.id,
          label: collection.name,
          count: collection.itemCount,
        });
      }
    } else {
      const defaultOption = defaultSourceOptions.find(
        (opt) => opt.type === value,
      );
      if (defaultOption) {
        onSelect({
          type: defaultOption.type,
          label: defaultOption.label,
        });
      }
    }
  };

  const getSelectedValue = (): string => {
    if (!selectedSource) return '';
    if (selectedSource.type === 'collection' && selectedSource.id) {
      return `collection-${selectedSource.id}`;
    }
    return selectedSource.type;
  };

  return (
    <Flex direction="column" gap={1.5}>
      <Text fontWeight="medium" fontSize="sm">
        Vocabulary Source
      </Text>

      {isLoading ? (
        <Flex justify="center" align="center" py={8}>
          <Spinner size="md" />
        </Flex>
      ) : (
        <RadioCard.Root
          value={getSelectedValue()}
          onValueChange={(e) => handleSelect(e.value ?? '')}
        >
          <Flex direction="column" gap={2}>
            {/* Default sources */}
            {defaultSourceOptions.map((option) => (
              <RadioCard.Item key={option.type} value={option.type} p={3}>
                <RadioCard.ItemHiddenInput />
                <Flex
                  justifyContent="flex-start"
                  gap={2.5}
                  w="full"
                  alignItems="center"
                >
                  {/* Icon container */}
                  <Flex
                    align="center"
                    justify="center"
                    boxSize={8}
                    borderRadius="full"
                    border="1px solid"
                    flexShrink={0}
                  >
                    <Icon as={option.icon} boxSize={4} />
                  </Flex>

                  {/* Content */}
                  <Flex direction="column" gap={0.5} flex={1} minW={0}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                      {option.label}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {option.description}
                    </Text>
                  </Flex>

                  <RadioCard.ItemIndicator />
                </Flex>
              </RadioCard.Item>
            ))}

            {/* User collections */}
            {collections.map((collection) => (
              <RadioCard.Item
                key={collection.id}
                value={`collection-${collection.id}`}
                p={3}
              >
                <RadioCard.ItemHiddenInput />
                <Flex
                  justifyContent="flex-start"
                  gap={2.5}
                  w="full"
                  alignItems="center"
                >
                  {/* Icon container */}
                  <Flex
                    align="center"
                    justify="center"
                    boxSize={8}
                    borderRadius="full"
                    border="1px solid"
                    flexShrink={0}
                  >
                    <Icon as={LuFolderOpen} boxSize={4} />
                  </Flex>

                  {/* Content */}
                  <Flex direction="column" gap={0.5} flex={1} minW={0}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                      {collection.name}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {collection.itemCount}{' '}
                      {collection.itemCount === 1 ? 'word' : 'words'}
                    </Text>
                  </Flex>

                  <RadioCard.ItemIndicator />
                </Flex>
              </RadioCard.Item>
            ))}
          </Flex>
        </RadioCard.Root>
      )}
    </Flex>
  );
}
