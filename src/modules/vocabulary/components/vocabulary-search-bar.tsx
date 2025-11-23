'use client';

import { useState } from 'react';
import { LuArrowDownNarrowWide, LuSlidersHorizontal } from 'react-icons/lu';

import { Badge, Button, Flex, Icon, Input, Menu, Text } from '@chakra-ui/react';

import type { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import type {
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
  ) => void;
  hasActiveFilters: boolean;
}

export const VocabularySearchBar = ({
  sortOption,
  onSortSelect,
  searchQuery,
  onSearchChange,
  visibilityFilter,
  selectedPartsOfSpeech,
  typeFilter,
  onFilterChange,
  hasActiveFilters,
}: VocabularySearchBarProps) => {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const handleFilterApply = (
    visibility: VisibilityFilter,
    partsOfSpeech: PartOfSpeech[],
    type: VocabularyTypeFilter,
  ) => {
    onFilterChange(visibility, partsOfSpeech, type);
  };

  return (
    <>
      <Flex direction="row" gap={2} align="center" mb={6}>
        <Input
          placeholder="Search vocabulary"
          flex="1"
          size="lg"
          backgroundColor="white"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="outline" size="lg" aria-label="Sort">
              <Icon as={LuArrowDownNarrowWide} fontSize="md" />
              <Text display={{ base: 'none', md: 'block' }}>{sortOption}</Text>
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
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>

        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsFilterDialogOpen(true)}
          aria-label="Filter"
          position="relative"
          colorScheme={hasActiveFilters ? 'blue' : undefined}
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
              backgroundColor="blue.500"
            />
          )}
        </Button>
      </Flex>

      <VocabularyFilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        visibilityFilter={visibilityFilter}
        selectedPartsOfSpeech={selectedPartsOfSpeech}
        typeFilter={typeFilter}
        onApply={handleFilterApply}
      />
    </>
  );
};
