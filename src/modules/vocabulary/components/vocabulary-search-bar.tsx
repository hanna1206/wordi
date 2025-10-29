import { LuArrowDownNarrowWide, LuSlidersHorizontal } from 'react-icons/lu';

import { Button, Flex, Icon, Input, Menu, Text } from '@chakra-ui/react';

import type { VocabularySortOption } from '@/modules/vocabulary/vocabulary.types';

interface VocabularySearchBarProps {
  sortOption: VocabularySortOption;
  onSortSelect: (option: VocabularySortOption) => void;
}

export const VocabularySearchBar = ({
  sortOption,
  onSortSelect,
}: VocabularySearchBarProps) => {
  return (
    <Flex direction="row" gap={2} mb={6} align="center">
      <Input
        placeholder="Search vocabulary"
        flex="1"
        size="lg"
        backgroundColor="white"
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

      <Button variant="outline" size="lg">
        <Icon as={LuSlidersHorizontal} fontSize="md" />
        <Text display={{ base: 'none', md: 'block' }}>Filters</Text>
      </Button>
    </Flex>
  );
};
