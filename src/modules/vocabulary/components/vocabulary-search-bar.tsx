'use client';

import { memo, useState } from 'react';
import {
  LuArrowDownNarrowWide,
  LuFolderCog,
  LuSlidersHorizontal,
  LuX,
} from 'react-icons/lu';

import { Badge, Button, Flex, Icon, Input, Menu, Text } from '@chakra-ui/react';

import type { CollectionWithCount } from '@/modules/collection/collections.types';
import type { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import type {
  ProgressAccuracyFilter,
  ProgressReviewFilter,
  ProgressStatusFilter,
  VisibilityFilter,
  VocabularySortOption,
  VocabularyTypeFilter,
} from '@/modules/vocabulary/vocabulary.types';

import { VocabularyFilterDialog } from './vocabulary-filter-dialog';

interface VocabularySearchBarProps {
  sortOption: VocabularySortOption;
  onSortSelect: (option: VocabularySortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  visibilityFilter: VisibilityFilter;
  selectedPartsOfSpeech: PartOfSpeech[];
  typeFilter: VocabularyTypeFilter;
  onFilterChange: (
    visibility: VisibilityFilter,
    partsOfSpeech: PartOfSpeech[],
    typeFilter: VocabularyTypeFilter,
    collectionIds: string[],
    progressStatusFilter: ProgressStatusFilter[],
    progressAccuracyFilter: ProgressAccuracyFilter,
    progressReviewFilter: ProgressReviewFilter,
  ) => void;
  hasActiveFilters: boolean;
  selectedCollectionIds: string[];
  onCollectionIdsChange?: (collectionIds: string[]) => void;
  onManageCollections?: () => void;
  collections: CollectionWithCount[];
  isLoadingCollections: boolean;
  progressStatusFilter: ProgressStatusFilter[];
  progressAccuracyFilter: ProgressAccuracyFilter;
  progressReviewFilter: ProgressReviewFilter;
}

export const VocabularySearchBar = memo<VocabularySearchBarProps>((props) => {
  const {
    sortOption,
    onSortSelect,
    searchQuery,
    onSearchChange,
    visibilityFilter,
    selectedPartsOfSpeech,
    typeFilter,
    onFilterChange,
    hasActiveFilters,
    selectedCollectionIds,
    onManageCollections,
    collections,
    isLoadingCollections,
    progressStatusFilter,
    progressAccuracyFilter,
    progressReviewFilter,
  } = props;
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  return (
    <>
      <Flex direction="row" gap={2} align="center" mb={6}>
        <Flex position="relative" flex="1">
          <Input
            placeholder="Search vocabulary"
            flex="1"
            size="lg"
            backgroundColor="white"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            pr={searchQuery ? 10 : undefined}
          />
          {searchQuery && (
            <Button
              position="absolute"
              right="2"
              top="50%"
              transform="translateY(-50%)"
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              minW="auto"
              h="auto"
              p={1}
            >
              <Icon as={LuX} fontSize="lg" />
            </Button>
          )}
        </Flex>

        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="outline" size="lg" aria-label="Sort">
              <Icon as={LuArrowDownNarrowWide} fontSize="md" />
              <Text display={{ base: 'none', md: 'block' }}>
                {sortOption.startsWith('Progress:')
                  ? sortOption.replace('Progress: ', '')
                  : sortOption}
              </Text>
            </Button>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item
                value="Alphabetical"
                onClick={() => onSortSelect('Alphabetical')}
              >
                Alphabetical
              </Menu.Item>
              <Menu.Item value="Latest" onClick={() => onSortSelect('Latest')}>
                Latest
              </Menu.Item>

              <Menu.Separator />

              <Menu.Item
                value="Progress: Status"
                onClick={() => onSortSelect('Progress: Status')}
              >
                Progress: Status
              </Menu.Item>
              <Menu.Item
                value="Progress: Next Review"
                onClick={() => onSortSelect('Progress: Next Review')}
              >
                Progress: Next Review
              </Menu.Item>
              <Menu.Item
                value="Progress: Accuracy"
                onClick={() => onSortSelect('Progress: Accuracy')}
              >
                Progress: Accuracy
              </Menu.Item>
              <Menu.Item
                value="Progress: Reviews"
                onClick={() => onSortSelect('Progress: Reviews')}
              >
                Progress: Reviews
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>

        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsFilterDialogOpen(true)}
          aria-label="Filter"
          position="relative"
        >
          <Icon as={LuSlidersHorizontal} fontSize="md" />
          <Text display={{ base: 'none', md: 'block' }}>Filter</Text>
          {hasActiveFilters && (
            <Badge
              position="absolute"
              top="-2"
              right="-2"
              borderRadius="full"
              minW="4"
              minH="4"
              w="4"
              h="4"
              p="0"
              display="flex"
              alignItems="center"
              justifyContent="center"
            />
          )}
        </Button>

        {onManageCollections && (
          <Button
            variant="outline"
            size="lg"
            onClick={onManageCollections}
            aria-label="Manage Collections"
          >
            <Icon as={LuFolderCog} fontSize="md" />
            <Text display={{ base: 'none', md: 'block' }}>Collections</Text>
          </Button>
        )}
      </Flex>

      <VocabularyFilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        visibilityFilter={visibilityFilter}
        selectedPartsOfSpeech={selectedPartsOfSpeech}
        typeFilter={typeFilter}
        selectedCollectionIds={selectedCollectionIds}
        collections={collections}
        isLoadingCollections={isLoadingCollections}
        progressStatusFilter={progressStatusFilter}
        progressAccuracyFilter={progressAccuracyFilter}
        progressReviewFilter={progressReviewFilter}
        onApply={(
          visibility,
          partsOfSpeech,
          type,
          collectionIds,
          progStatusFilter,
          progAccuracyFilter,
          progReviewFilter,
        ) => {
          onFilterChange(
            visibility,
            partsOfSpeech,
            type,
            collectionIds,
            progStatusFilter,
            progAccuracyFilter,
            progReviewFilter,
          );
        }}
      />
    </>
  );
});

VocabularySearchBar.displayName = 'VocabularySearchBar';
