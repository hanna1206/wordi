import React from 'react';

import { HStack, Icon, Text } from '@chakra-ui/react';

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
}) => {
  return (
    <HStack align="center" color="gray.600">
      <Icon as={icon} boxSize={4} />
      <Text fontWeight="semibold" fontSize="sm">
        {title}
      </Text>
    </HStack>
  );
};
