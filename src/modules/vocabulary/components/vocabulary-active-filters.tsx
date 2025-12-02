'use client';

import { memo } from 'react';
import { LuX } from 'react-icons/lu';

import { Flex, IconButton, Text } from '@chakra-ui/react';

import type { CollectionWithCount } from '@/modules/collection/collections.types';
import type { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import type {
  VisibilityFilter,
  VocabularyTypeFilter,
} from '@/modules/vocabulary/vocabulary.types';

type ActiveFilterChipProps = {
  label: string;
  value: string;
  onClear: () => void;
};

const ActiveFilterChip = memo<ActiveFilterChipProps>((props) => {
  const { label, value, onClear } = props;
  return (
    <Flex
      align="center"
      gap={2}
      px={3}
      py={1}
      borderRadius="full"
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
    >
      <Text fontSize="sm" color="gray.600">
        {label}
      </Text>
      <Text fontSize="sm" color="gray.300">
        |
      </Text>
      <Text fontSize="sm" fontWeight="semibold" color="gray.900">
        {value}
      </Text>
      <IconButton
        aria-label={`Remove ${label.toLowerCase()} filter`}
        variant="ghost"
        size="xs"
        minW="0"
        h="auto"
        color="gray.500"
        _hover={{ color: 'gray.700', bg: 'transparent' }}
        onClick={(event) => {
          event.stopPropagation();
          onClear();
        }}
      >
        <LuX />
      </IconButton>
    </Flex>
  );
});

ActiveFilterChip.displayName = 'ActiveFilterChip';

const formatPartOfSpeechLabel = (partOfSpeech: PartOfSpeech): string =>
  partOfSpeech
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const getCollectionName = (
  collections: CollectionWithCount[],
  collectionId: string,
): string =>
  collections.find((collection) => collection.id === collectionId)?.name ??
  'Collection';

const formatVisibilityFilter = (filter: VisibilityFilter): string => {
  switch (filter) {
    case 'any':
      return 'Any';
    case 'hidden-only':
      return 'Hidden only';
    case 'visible-only':
      return 'Visible only';
  }
};

const formatTypeFilter = (filter: VocabularyTypeFilter): string => {
  switch (filter) {
    case 'all':
      return 'All';
    case 'words-only':
      return 'Words only';
    case 'collocations-only':
      return 'Collocations only';
  }
};

type VocabularyActiveFiltersProps = {
  selectedPartsOfSpeech: PartOfSpeech[];
  selectedCollectionIds: string[];
  collections: CollectionWithCount[];
  visibilityFilter: VisibilityFilter;
  typeFilter: VocabularyTypeFilter;
  onRemovePartOfSpeech: (partOfSpeech: PartOfSpeech) => void;
  onRemoveCollection: (collectionId: string) => void;
  onResetVisibilityFilter: () => void;
  onResetTypeFilter: () => void;
};

export const VocabularyActiveFilters = memo<VocabularyActiveFiltersProps>(
  (props) => {
    const {
      selectedPartsOfSpeech,
      selectedCollectionIds,
      collections,
      visibilityFilter,
      typeFilter,
      onRemovePartOfSpeech,
      onRemoveCollection,
      onResetVisibilityFilter,
      onResetTypeFilter,
    } = props;
    const showVisibilityChip = visibilityFilter !== 'visible-only';
    const showTypeChip = typeFilter !== 'all';

    if (
      selectedPartsOfSpeech.length === 0 &&
      selectedCollectionIds.length === 0 &&
      !showVisibilityChip &&
      !showTypeChip
    ) {
      return null;
    }

    return (
      <Flex mt={2} mb={4} gap={2} flexWrap="wrap">
        {showVisibilityChip && (
          <ActiveFilterChip
            key="visibility"
            label="Visibility"
            value={formatVisibilityFilter(visibilityFilter)}
            onClear={onResetVisibilityFilter}
          />
        )}

        {showTypeChip && (
          <ActiveFilterChip
            key="type"
            label="Type"
            value={formatTypeFilter(typeFilter)}
            onClear={onResetTypeFilter}
          />
        )}

        {selectedPartsOfSpeech.map((partOfSpeech) => (
          <ActiveFilterChip
            key={`part-of-speech-${partOfSpeech}`}
            label="Part of speech"
            value={formatPartOfSpeechLabel(partOfSpeech)}
            onClear={() => onRemovePartOfSpeech(partOfSpeech)}
          />
        ))}

        {selectedCollectionIds.map((collectionId) => (
          <ActiveFilterChip
            key={`collection-${collectionId}`}
            label="Collection"
            value={getCollectionName(collections, collectionId)}
            onClear={() => onRemoveCollection(collectionId)}
          />
        ))}
      </Flex>
    );
  },
);

VocabularyActiveFilters.displayName = 'VocabularyActiveFilters';
