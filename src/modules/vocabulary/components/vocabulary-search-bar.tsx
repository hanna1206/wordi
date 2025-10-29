import { LuArrowDownNarrowWide } from 'react-icons/lu';

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
    <Flex
      direction={{ base: 'column', md: 'row' }}
      gap={4}
      mb={6}
      align={{ base: 'stretch', md: 'center' }}
    >
      <Input
        placeholder="Search vocabulary"
        flex="1"
        size="lg"
        backgroundColor="white"
      />

      <Flex gap={2} justify="flex-end" w={{ base: 'full', md: 'auto' }}>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              variant="outline"
              size="lg"
              w={{ base: 'full', md: 'auto' }}
              aria-label="Sort"
            >
              <Flex align="center" justify="space-between" w="full" gap={1}>
                <Icon as={LuArrowDownNarrowWide} fontSize="md" />
                <Text>{sortOption}</Text>
              </Flex>
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
        <Button variant="outline" size="lg" w={{ base: 'full', md: 'auto' }}>
          Filters
        </Button>
      </Flex>
    </Flex>
  );
};
