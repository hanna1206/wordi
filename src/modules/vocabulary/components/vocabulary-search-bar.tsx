import { LuArrowDownNarrowWide } from 'react-icons/lu';

// import { LuArrowDownNarrowWide, LuSlidersHorizontal } from 'react-icons/lu';
import {
  Button,
  Checkbox,
  Flex,
  Icon,
  Input,
  Menu,
  Text,
} from '@chakra-ui/react';

import type { VocabularySortOption } from '@/modules/vocabulary/vocabulary.types';

interface VocabularySearchBarProps {
  sortOption: VocabularySortOption;
  onSortSelect: (option: VocabularySortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showHidden: boolean;
  onShowHiddenChange: (checked: boolean) => void;
}

export const VocabularySearchBar = ({
  sortOption,
  onSortSelect,
  searchQuery,
  onSearchChange,
  showHidden,
  onShowHiddenChange,
}: VocabularySearchBarProps) => {
  return (
    <Flex direction="column" gap={3} mb={6}>
      <Flex direction="row" gap={2} align="center">
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
        {/* Temporarily comment out, as filters are not implemented yet */}
        {/* <Button variant="outline" size="lg">
          <Icon as={LuSlidersHorizontal} fontSize="md" />
          <Text display={{ base: 'none', md: 'block' }}>Filters</Text>
        </Button> */}
      </Flex>

      <Checkbox.Root
        checked={showHidden}
        onCheckedChange={(e) => onShowHiddenChange(!!e.checked)}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>Show Hidden Words</Checkbox.Label>
      </Checkbox.Root>
    </Flex>
  );
};
