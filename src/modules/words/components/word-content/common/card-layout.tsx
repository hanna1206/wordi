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
    <HStack align="stretch" gap={4}>
      {genderColor && (
        <Box w="4px" bg={genderColor} borderRadius="full" flexShrink={0} />
      )}
      <VStack
        gap={{ base: 4, md: 6 }}
        py={{ base: 2, md: 4 }}
        align="stretch"
        w="full"
      >
        {children}
      </VStack>
    </HStack>
  );
};

export const CardDivider: React.FC = () => {
  return <Box h="1px" bg="gray.200" my={2} />;
};
