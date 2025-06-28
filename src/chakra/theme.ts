import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: {
          value: 'Inter, sans-serif',
        },
      },
      radii: {
        md: { value: '0.5rem' },
        sm: { value: '0.375rem' },
      },
    },
    semanticTokens: {
      colors: {
        primary: { value: '{colors.blue.700}' },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
