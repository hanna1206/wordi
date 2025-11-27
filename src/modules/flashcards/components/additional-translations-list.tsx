'use client';

import { Box, Text } from '@chakra-ui/react';

type AdditionalTranslationsProps = {
  translations: string[];
  maxHeight?: string;
};

export const AdditionalTranslationsList = ({
  translations,
  maxHeight,
}: AdditionalTranslationsProps) => (
  <Box
    position="relative"
    w="90%"
    maxH={maxHeight ?? '40%'}
    overflowY="auto"
    pt={2}
    zIndex={1}
  >
    <Text
      fontSize="xs"
      fontWeight="medium"
      color="gray.500"
      textTransform="uppercase"
      letterSpacing="wider"
      mb={3}
      textAlign="center"
    >
      Also means
    </Text>
    <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
      {translations.map((t) => (
        <Box
          key={t}
          px={3}
          py={1.5}
          borderRadius="lg"
          bg="gray.100"
          border="1px solid"
          borderColor="gray.200"
          color="gray.700"
          fontSize="sm"
          fontWeight="medium"
          lineHeight={1}
        >
          {t}
        </Box>
      ))}
    </Box>
    <Box
      position="absolute"
      pointerEvents="none"
      bottom={0}
      left={0}
      right={0}
      height="20px"
    />
  </Box>
);
