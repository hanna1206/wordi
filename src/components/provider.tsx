'use client';

import type { ReactNode } from 'react';

import { ChakraProvider } from '@chakra-ui/react';

import { system } from '@/theme';

import { SidebarProvider } from '../contexts/sidebar-context';

interface ProviderProps {
  children: ReactNode;
}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <ChakraProvider value={system}>
      <SidebarProvider>{children}</SidebarProvider>
    </ChakraProvider>
  );
};
