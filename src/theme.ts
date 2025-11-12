import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: { value: 'var(--font-open-sans), sans-serif' },
        heading: { value: 'var(--font-sofia-sans-condensed), sans-serif' },
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
  globalCss: {
    html: {
      colorPalette: 'blue',
    },
    body: {
      fontFamily: 'var(--font-open-sans), sans-serif',
    },
    h1: {
      fontFamily: 'var(--font-sofia-sans-condensed), sans-serif',
    },
    h2: {
      fontFamily: 'var(--font-sofia-sans-condensed), sans-serif',
    },
    h3: {
      fontFamily: 'var(--font-sofia-sans-condensed), sans-serif',
    },
    h4: {
      fontFamily: 'var(--font-sofia-sans-condensed), sans-serif',
    },
    h5: {
      fontFamily: 'var(--font-sofia-sans-condensed), sans-serif',
    },
    h6: {
      fontFamily: 'var(--font-sofia-sans-condensed), sans-serif',
    },
  },
});

export const system = createSystem(defaultConfig, config);
