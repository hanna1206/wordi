import React from 'react';

import { HStack, Text, VStack } from '@chakra-ui/react';

import { SectionHeader } from './section-header';

interface TranslationSectionProps {
  icon: React.ElementType;
  title: string;
  items: string[];
  renderMode?: 'list' | 'tags' | 'quotes' | 'text';
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
      case 'tags':
        return (
          <HStack wrap="wrap" gap={2} pl={6}>
            {items.map((item) => (
              <Text
                key={item}
                fontSize="sm"
                px={2.5}
                py={1}
                borderRadius="md"
                bg="gray.100"
                color="gray.800"
                _dark={{ bg: 'gray.700', color: 'gray.200' }}
              >
                {item}
              </Text>
            ))}
          </HStack>
        );
      case 'quotes':
        return (
          <VStack align="start" pl={6} gap={1}>
            {items.map((item) => (
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
            {items.join(', ')}
          </Text>
        );
      case 'list':
      default:
        return (
          <VStack align="start" pl={6} gap={0}>
            {items.map((item) => (
              <Text key={item} fontSize="md" color="gray.700">
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
