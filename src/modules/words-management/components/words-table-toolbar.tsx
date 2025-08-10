'use client';

import { useState } from 'react';
import {
  FiArchive,
  FiChevronDown,
  FiDownload,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi';

import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  Text,
} from '@chakra-ui/react';

import { FILTER_PRESETS, WORD_STATUS_CONFIG } from '../words-management.const';
import type {
  WordsFilterOptions,
  WordWithProgress,
} from '../words-management.types';

interface WordsTableToolbarProps {
  selectedWords: WordWithProgress[];
  filters: WordsFilterOptions;
  onFiltersChange: (filters: WordsFilterOptions) => void;
  onBulkArchive: () => void;
  onBulkUnarchive: () => void;
  onBulkDelete: () => void;
  onBulkExport: () => void;
  onRefresh: () => void;
}

export const WordsTableToolbar = ({
  selectedWords,
  filters,
  onFiltersChange,
  onBulkArchive,
  onBulkUnarchive,
  onBulkDelete,
  //   onBulkExport,
  onRefresh,
}: WordsTableToolbarProps) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      onFiltersChange({ ...filters, searchTerm: value });
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handlePresetFilter = (preset: keyof typeof FILTER_PRESETS) => {
    onFiltersChange(FILTER_PRESETS[preset].filters);
  };

  const hasSelectedWords = selectedWords.length > 0;
  const selectedCount = selectedWords.length;

  return (
    <Box mb={4}>
      {/* Main toolbar */}
      <HStack justify="space-between" mb={3}>
        <HStack gap={3}>
          {/* Search */}
          <Box position="relative" minWidth="300px">
            <Input
              placeholder="Search words or translations..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              paddingLeft="40px"
            />
            <Box
              position="absolute"
              left="12px"
              top="50%"
              transform="translateY(-50%)"
              color="gray.500"
            >
              <FiSearch />
            </Box>
          </Box>

          {/* Filter presets */}
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="outline">
                <FiFilter />
                Quick Filters
                <FiChevronDown />
              </Button>
            </MenuTrigger>
            <MenuContent>
              {Object.entries(FILTER_PRESETS).map(([key, preset]) => (
                <MenuItem
                  key={key}
                  value={key}
                  onClick={() =>
                    handlePresetFilter(key as keyof typeof FILTER_PRESETS)
                  }
                >
                  {preset.name}
                </MenuItem>
              ))}
            </MenuContent>
          </MenuRoot>

          {/* Refresh button */}
          <IconButton
            aria-label="Refresh"
            variant="outline"
            onClick={onRefresh}
          >
            <FiRefreshCw />
          </IconButton>
        </HStack>

        {/* Actions */}
        <HStack gap={2}>
          <Button colorPalette="blue" variant="outline">
            {/* <Button colorPalette="blue" variant="outline" onClick={onBulkExport}> */}
            <FiDownload />
            Export
          </Button>
        </HStack>
      </HStack>

      {/* Active filters display */}
      {filters.status && filters.status.length > 0 && (
        <HStack gap={2} mb={3}>
          <Text fontSize="sm" color="gray.600">
            Active filters:
          </Text>
          {filters.status.map((status) => (
            <Badge
              key={status}
              colorPalette={WORD_STATUS_CONFIG[status].color}
              variant="subtle"
            >
              {WORD_STATUS_CONFIG[status].label}
            </Badge>
          ))}
          <Button size="xs" variant="ghost" onClick={() => onFiltersChange({})}>
            Clear all
          </Button>
        </HStack>
      )}

      {/* Bulk actions bar */}
      {hasSelectedWords && (
        <Box
          bg="blue.50"
          p={3}
          borderRadius="md"
          borderWidth="1px"
          borderColor="blue.200"
        >
          <HStack justify="space-between">
            <Text fontSize="sm" fontWeight="medium">
              {selectedCount} word{selectedCount > 1 ? 's' : ''} selected
            </Text>
            <HStack gap={2}>
              <Button size="sm" variant="outline" onClick={onBulkArchive}>
                <FiArchive />
                Archive
              </Button>
              <Button size="sm" variant="outline" onClick={onBulkUnarchive}>
                <FiArchive />
                Unarchive
              </Button>
              <Button
                size="sm"
                variant="outline"
                colorPalette="red"
                onClick={onBulkDelete}
              >
                <FiTrash2 />
                Delete
              </Button>
            </HStack>
          </HStack>
        </Box>
      )}
    </Box>
  );
};
