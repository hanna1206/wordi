'use client';

import { useState } from 'react';
import { LuArrowRight } from 'react-icons/lu';

import { Heading, HStack, IconButton, Input, VStack } from '@chakra-ui/react';

import { getWordFromCache } from '@/modules/word-persistence/word-persistence.actions';
import { ExampleWords } from '@/modules/words-generation/components/example-words';
import { GenerateWordModal } from '@/modules/words-generation/components/generate-word-modal';
import { translateWord } from '@/modules/words-generation/words-generation.actions';
import { PartOfSpeech } from '@/modules/words-generation/words-generation.const';
import type { TranslationResult } from '@/modules/words-generation/words-generation.types';

export const GenerateWordForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [word, setWord] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [translation, setTranslation] = useState<TranslationResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (wordToTranslate: string) => {
    if (!wordToTranslate.trim()) return;

    setWord(wordToTranslate);
    setIsOpen(true);
    setIsLoading(true);
    setTranslation(null);
    setError(null);

    try {
      // First check cache
      const wordToSearchInCache = wordToTranslate.trim().toLowerCase();
      const cacheResult = await getWordFromCache(wordToSearchInCache);

      if (cacheResult.success && cacheResult.data) {
        // Cache hit - convert cached data to TranslationResult format
        const cachedTranslation: TranslationResult = {
          normalizedWord: cacheResult.data.normalized_word,
          partOfSpeech: [cacheResult.data.part_of_speech as PartOfSpeech],
          ...cacheResult.data.common_data,
          ...cacheResult.data.part_specific_data,
        };
        setTranslation(cachedTranslation);
        return;
      }

      // Cache miss - proceed with LLM request
      const result = await translateWord(wordToTranslate.trim());
      if (result.success && result.data) {
        setTranslation(result.data);
      } else {
        setError(result.error || 'Failed to translate word');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      // eslint-disable-next-line no-console
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const wordValue = formData.get('word') as string;
    handleSubmit(wordValue);
  };

  const onClose = () => {
    setIsOpen(false);
    setWord('');
    setTranslation(null);
    setError(null);
  };

  return (
    <>
      <VStack gap={{ base: 6, md: 12 }} align="stretch" py={{ base: 4, md: 8 }}>
        {/* Main heading */}
        <VStack gap={3} textAlign="center">
          <Heading
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            fontWeight="500"
            color="gray.800"
            letterSpacing="-0.02em"
            _dark={{ color: 'gray.100' }}
          >
            What German word would you like to learn today?
          </Heading>
        </VStack>

        {/* Input form */}
        <form onSubmit={onFormSubmit}>
          <VStack gap={{ base: 3, md: 6 }}>
            <HStack
              w="full"
              maxW={{ base: '100%', md: '2xl' }}
              mx="auto"
              bg="white"
              border="1px"
              borderColor="gray.200"
              borderRadius={{ base: 'lg', md: '2xl' }}
              p={{ base: 1, md: 2 }}
              shadow="sm"
              transition="all 0.2s"
              _dark={{
                bg: 'gray.800',
                borderColor: 'gray.600',
              }}
              _hover={{
                shadow: 'md',
                borderColor: 'gray.300',
                _dark: { borderColor: 'gray.500' },
              }}
              _focusWithin={{
                shadow: 'lg',
                borderColor: 'blue.400',
              }}
              alignItems="center"
              flexDirection="row"
              gap={2}
            >
              <Input
                name="word"
                placeholder="Enter any German word..."
                size={{ base: 'md', md: 'lg' }}
                fontSize={{ base: 'md', md: 'lg' }}
                border="none"
                outline="none"
                px={{ base: 2, md: 4 }}
                py={{ base: 2, md: 3 }}
                required
                flex={1}
                _placeholder={{
                  color: 'gray.400',
                  _dark: { color: 'gray.500' },
                }}
                _focus={{ boxShadow: 'none' }}
                w="100%"
              />
              <IconButton
                type="submit"
                aria-label="Generate word card"
                color="white"
                borderRadius="xl"
                size={{ base: 'md', md: 'lg' }}
                transition="all 0.15s"
                _hover={{
                  transform: 'scale(1.05)',
                }}
                _active={{
                  transform: 'scale(0.95)',
                }}
                w={12}
                h={12}
              >
                <LuArrowRight />
              </IconButton>
            </HStack>

            {/* Example Words Component */}
            <ExampleWords onWordSelect={handleSubmit} />
          </VStack>
        </form>
      </VStack>

      <GenerateWordModal
        isOpen={isOpen}
        word={word}
        isLoading={isLoading}
        error={error}
        translation={translation}
        onClose={onClose}
        onRegenerate={handleSubmit}
      />
    </>
  );
};
