import React from 'react';

import { Box, VStack } from '@chakra-ui/react';

import type { TranslationResult } from '@/modules/words/words.types';

import { AdditionalSections } from './additional-sections';
import { MainWordBlock } from './main-word-block';
import { NounSections } from './noun-sections';

interface TranslationContentProps {
  translation: TranslationResult;
}

export const TranslationContent: React.FC<TranslationContentProps> = ({
  translation,
}) => {
  return (
    <VStack gap={{ base: 4, md: 6 }} py={{ base: 2, md: 4 }} align="stretch">
      {/* Main Block */}
      <MainWordBlock translation={translation} />

      {/* Noun-specific sections */}
      <NounSections translation={translation} />

      {/* Divider */}
      <Box h="1px" bg="gray.200" my={2} />

      {/* Additional sections */}
      <AdditionalSections translation={translation} />
    </VStack>
  );
};
