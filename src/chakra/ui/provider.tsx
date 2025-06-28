'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import type { ThemeProviderProps } from 'next-themes';

// import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import { ColorModeProvider } from './color-mode';

export const Provider = (props: ThemeProviderProps) => {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
};
