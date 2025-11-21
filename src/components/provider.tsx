'use client';

import type { ReactNode } from 'react';

import { ChakraProvider } from '@chakra-ui/react';

import { system } from '@/theme';

interface ProviderProps {
  children: ReactNode;
}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
};
