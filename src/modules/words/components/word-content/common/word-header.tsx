import React from 'react';
import { LuRefreshCw } from 'react-icons/lu';

import { HStack, IconButton, Text, VStack } from '@chakra-ui/react';

import type {
  Gender,
  PartOfSpeech,
  ReflexiveVerb,
  Regularity,
} from '@/modules/words/words.const';

interface WordHeaderProps {
  normalizedWord: string;
  mainTranslation: string;
  partOfSpeech?: PartOfSpeech[];
  regularOrIrregularVerb?: Regularity; // For verb regular/irregular info
  gender?: Gender;
  isReflexiveVerb?: ReflexiveVerb;
  separablePrefix?: string | null;
  onRegenerate?: () => void;
}

export const WordHeader: React.FC<WordHeaderProps> = ({
  normalizedWord,
  mainTranslation,
  partOfSpeech,
  regularOrIrregularVerb,
  isReflexiveVerb,
  separablePrefix,
  onRegenerate,
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
    <HStack w="100%" align="start" justify="space-between">
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
              {regularOrIrregularVerb && ` / ${regularOrIrregularVerb}`}
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
      {onRegenerate && (
        <IconButton
          aria-label="Regenerate word"
          onClick={onRegenerate}
          variant="ghost"
          size="sm"
        >
          <LuRefreshCw />
        </IconButton>
      )}
    </HStack>
  );
};
