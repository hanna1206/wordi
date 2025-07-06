import React from 'react';

import { HStack, Text, VStack } from '@chakra-ui/react';

import type { Gender, ReflexiveVerb } from '@/modules/words/words.types';

interface WordHeaderProps {
  normalizedWord: string;
  mainTranslation: string;
  partOfSpeech?: string[];
  regularOtIregularVerb?: string; // For verb regular/irregular info
  gender?: Gender;
  isReflexiveVerb?: ReflexiveVerb;
  separablePrefix?: string | null;
}

export const WordHeader: React.FC<WordHeaderProps> = ({
  normalizedWord,
  mainTranslation,
  partOfSpeech,
  regularOtIregularVerb,
  isReflexiveVerb,
  separablePrefix,
}) => {
  const reflexivePronoun =
    isReflexiveVerb === 'reflexive'
      ? 'sich'
      : isReflexiveVerb === 'both'
        ? '(sich)'
        : '';
  const separablePrefixString = separablePrefix ? separablePrefix : '';
  const normalizedWordWithoutPrefix = normalizedWord.split(
    separablePrefixString,
  )[1];
  const normalizedWordWithPrefix = separablePrefix
    ? '[' + separablePrefixString + ']' + normalizedWordWithoutPrefix
    : normalizedWord;

  const normalizedWordWithReflexivePronounAndPrefix = reflexivePronoun
    ? reflexivePronoun + ' ' + normalizedWordWithPrefix
    : normalizedWordWithPrefix;

  return (
    <VStack gap={2} align="start">
      <HStack gap={2} align="baseline">
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          color="gray.800"
          fontWeight="semibold"
        >
          {normalizedWordWithReflexivePronounAndPrefix}
        </Text>
        {partOfSpeech && partOfSpeech.length > 0 && (
          <Text
            as="span"
            fontSize={{ base: 'sm', md: 'md' }}
            color="gray.500"
            fontStyle="italic"
          >
            {partOfSpeech.join(', ')}
            {regularOtIregularVerb && ` / ${regularOtIregularVerb}`}
          </Text>
        )}
      </HStack>
      <Text
        fontSize={{ base: 'xl', md: '2xl' }}
        fontWeight="bold"
        color="blue.600"
      >
        {mainTranslation}
      </Text>
    </VStack>
  );
};
