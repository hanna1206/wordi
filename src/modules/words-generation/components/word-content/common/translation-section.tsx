import React from 'react';

import { Box, Grid, HStack, Text, VStack } from '@chakra-ui/react';

import { SectionHeader } from './section-header';

interface TranslationSectionProps {
  icon: React.ElementType;
  title: string;
  items: string[] | Record<string, string | number>[];
  renderMode?: 'list' | 'tags' | 'quotes' | 'text' | 'table';
  show?: boolean;
}

export const TranslationSection: React.FC<TranslationSectionProps> = ({
  icon,
  title,
  items,
  renderMode = 'list',
  show = true,
}) => {
  if (!show || items.length === 0) {
    return null;
  }

  const renderContent = () => {
    switch (renderMode) {
      case 'table':
        const tableItems = items as Record<string, string | number>[];
        if (tableItems.length === 0) return null;

        // Get column headers from the first object's keys
        const headers = Object.keys(tableItems[0]);

        return (
          <Box pl={6}>
            <VStack gap={1} align="stretch">
              {tableItems.map((item, index) => (
                <Grid
                  key={index}
                  templateColumns={`repeat(${headers.length}, 1fr)`}
                  gap={4}
                  py={2}
                  px={3}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  {headers.map((header) => (
                    <Text key={header} fontSize="sm" color="gray.700">
                      {item[header]}
                    </Text>
                  ))}
                </Grid>
              ))}
            </VStack>
          </Box>
        );
      case 'tags':
        return (
          <HStack wrap="wrap" gap={2} pl={6}>
            {(items as string[]).map((item, index) => (
              <Text
                key={item + index}
                fontSize="sm"
                px={2.5}
                py={1}
                borderRadius="md"
                bg="gray.100"
                color="gray.800"
              >
                {item}
              </Text>
            ))}
          </HStack>
        );
      case 'quotes':
        return (
          <VStack align="start" pl={6} gap={1}>
            {(items as string[]).map((item) => (
              <Text
                key={item}
                fontSize="sm"
                color="gray.600"
                fontStyle="italic"
              >
                &quot;{item}&quot;
              </Text>
            ))}
          </VStack>
        );
      case 'text':
        return (
          <Text pl={6} fontSize="md">
            {(items as string[]).join(', ')}
          </Text>
        );
      case 'list':
      default:
        return (
          <VStack align="start" pl={6} gap={0}>
            {(items as string[]).map((item, index) => (
              <Text key={item + index} fontSize="md" color="gray.700">
                • {item}
              </Text>
            ))}
          </VStack>
        );
    }
  };

  return (
    <VStack align="start" gap={renderMode === 'tags' ? 2 : 1}>
      <SectionHeader icon={icon} title={title} />
      {renderContent()}
    </VStack>
  );
};
