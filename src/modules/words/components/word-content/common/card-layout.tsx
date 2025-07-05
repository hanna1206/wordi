import React from 'react';

import { Box, VStack } from '@chakra-ui/react';

interface CardLayoutProps {
  children: React.ReactNode;
}

export const CardLayout: React.FC<CardLayoutProps> = ({ children }) => {
  return (
    <VStack gap={{ base: 4, md: 6 }} py={{ base: 2, md: 4 }} align="stretch">
      {children}
    </VStack>
  );
};

export const CardDivider: React.FC = () => {
  return <Box h="1px" bg="gray.200" my={2} />;
};
