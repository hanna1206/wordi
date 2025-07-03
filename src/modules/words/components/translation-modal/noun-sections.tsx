import React from 'react';
import { LuBinary } from 'react-icons/lu';

import { HStack, Icon, Text, VStack } from '@chakra-ui/react';

import type { TranslationResult } from '@/modules/words/words.types';

interface NounSectionsProps {
  translation: TranslationResult;
}

export const NounSections: React.FC<NounSectionsProps> = ({ translation }) => {
  const isNoun = translation.partOfSpeech?.includes('noun');
  const hasPluralForm = 'pluralForm' in translation && translation.pluralForm;

  if (!isNoun || !hasPluralForm) {
    return null;
  }

  return (
    <VStack align="start" gap={1}>
      <HStack align="center" color="gray.600">
        <Icon as={LuBinary} boxSize={4} />
        <Text fontWeight="semibold" fontSize="sm">
          Plural
        </Text>
      </HStack>
      <Text pl={6} fontSize="md">
        {translation.pluralForm || 'N/A'}
      </Text>
    </VStack>
  );
};
