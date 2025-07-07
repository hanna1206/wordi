import React from 'react';

import { Box, HStack, VStack } from '@chakra-ui/react';

interface CardLayoutProps {
  children: React.ReactNode;
  genderColor?: string;
}

export const CardLayout: React.FC<CardLayoutProps> = ({
  children,
  genderColor,
}) => {
  return (
    <HStack align="stretch" gap={{ base: 3, md: 4 }}>
      {genderColor && (
        <Box
          w={{ base: '3px', md: '4px' }}
          bg={genderColor}
          borderRadius="full"
          flexShrink={0}
        />
      )}
      <VStack
        gap={{ base: 5, md: 6 }}
        py={{ base: 3, md: 4 }}
        align="stretch"
        w="full"
      >
        {children}
      </VStack>
    </HStack>
  );
};

export const CardDivider: React.FC = () => {
  return <Box h="1px" bg="gray.200" my={{ base: 3, md: 2 }} />;
};
