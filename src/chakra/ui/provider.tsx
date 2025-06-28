'use client';

import { ChakraProvider } from '@chakra-ui/react';
import type { ThemeProviderProps } from 'next-themes';

import { system } from '@/chakra/theme';

// import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import { ColorModeProvider } from './color-mode';

export const Provider = (props: ThemeProviderProps) => {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
};
