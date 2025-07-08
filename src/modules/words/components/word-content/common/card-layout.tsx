import React from 'react';

import { Box, VStack } from '@chakra-ui/react';

interface CardLayoutProps {
  children: React.ReactNode;
}

export const CardLayout: React.FC<CardLayoutProps> = ({ children }) => {
  return (
    <VStack
      gap={{ base: 5, md: 6 }}
      py={{ base: 3, md: 4 }}
      align="stretch"
      w="full"
    >
      {children}
    </VStack>
  );
};

export const CardDivider: React.FC = () => {
  return <Box h="1px" bg="gray.200" my={{ base: 3, md: 2 }} />;
};
