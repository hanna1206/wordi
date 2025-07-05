import React from 'react';
import { LuBinary } from 'react-icons/lu';

import { HStack, Icon, Text, VStack } from '@chakra-ui/react';

import type { TranslationResult } from '@/modules/words/words.types';

interface VerbSectionsProps {
  translation: TranslationResult;
}

export const VerbSections: React.FC<VerbSectionsProps> = ({ translation }) => {
  const isVerb = translation.partOfSpeech?.includes('verb');

  if (!isVerb) {
    return null;
  }

  // Access properties safely with type guards
  const regular = 'regular' in translation ? translation.regular : undefined;
  const prepositions =
    'prepositions' in translation ? translation.prepositions : undefined;
  const conjugation =
    'conjugation' in translation ? translation.conjugation : undefined;

  return (
    <VStack align="start" gap={1}>
      <HStack align="center" color="gray.600">
        <Icon as={LuBinary} boxSize={4} />
        <Text fontWeight="semibold" fontSize="sm">
          Regularity
        </Text>
      </HStack>
      <Text pl={6} fontSize="md">
        {regular}
      </Text>
      <HStack align="center" color="gray.600">
        <Icon as={LuBinary} boxSize={4} />
        <Text fontWeight="semibold" fontSize="sm">
          Conjugation
        </Text>
      </HStack>
      <Text pl={6} fontSize="md">
        {conjugation}
      </Text>
      {/* TODO: restructure modal to have a separate section for prepositions */}
      <HStack align="center" color="gray.600">
        <Icon as={LuBinary} boxSize={4} />
        <Text fontWeight="semibold" fontSize="sm">
          Prepositions
        </Text>
      </HStack>
      <Text pl={6} fontSize="md">
        {prepositions &&
          prepositions.map((preposition) => (
            <Text key={preposition} fontSize="md" color="gray.700">
              • {preposition}
            </Text>
          ))}
      </Text>
    </VStack>
  );
};
