'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuArrowRight } from 'react-icons/lu';

import { Heading, HStack, IconButton, Input, VStack } from '@chakra-ui/react';

import { ExampleWords } from '@/modules/linguistics/components/example-words';
import { GenerateLinguisticItemModal } from '@/modules/linguistics/components/generate-linguistic-item-modal';
import { generateLinguisticItem } from '@/modules/linguistics/linguistics.actions';
import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import type { LinguisticItem } from '@/modules/linguistics/linguistics.types';
import { getWordFromCache } from '@/modules/vocabulary/vocabulary.actions';

interface FormData {
  word: string;
}

interface GenerateLinguisticItemFormProps {
  onWordSaved: () => void;
}

export const GenerateLinguisticItemForm = ({
  onWordSaved,
}: GenerateLinguisticItemFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [word, setWord] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linguisticItem, setLinguisticItem] = useState<LinguisticItem | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    setValue,
  } = useForm<FormData>();

  const handleSubmit = async (wordToTranslate: string) => {
    if (!wordToTranslate.trim()) return;

    setWord(wordToTranslate);
    setIsOpen(true);
    setIsLoading(true);
    setLinguisticItem(null);
    setError(null);

    try {
      // First check cache
      const wordToSearchInCache = wordToTranslate.trim().toLowerCase();
      const cacheResult = await getWordFromCache(wordToSearchInCache);

      if (cacheResult.success && cacheResult.data) {
        // Cache hit - convert cached data to TranslationResult format
        const cachedTranslation: LinguisticItem = {
          normalizedWord: cacheResult.data.normalizedWord,
          partOfSpeech: [cacheResult.data.partOfSpeech as PartOfSpeech],
          ...cacheResult.data.commonData,
          ...cacheResult.data.partSpecificData,
        };
        setLinguisticItem(cachedTranslation);
        // Clear form only on successful cache hit
        reset();
        return;
      }

      // Cache miss - proceed with LLM request
      const result = await generateLinguisticItem(wordToTranslate.trim());
      if (result.success && result.data) {
        setLinguisticItem(result.data);
        // Clear form only on successful translation
        reset();
      } else {
        setError(result.error || 'Failed to translate word');
        // Don't clear form on error so user can retry
      }
    } catch (err) {
      setError('An unexpected error occurred');
      // eslint-disable-next-line no-console
      console.error('Translation error:', err);
      // Don't clear form on error so user can retry
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit = (data: FormData) => {
    handleSubmit(data.word);
  };

  const handleExampleWordSelect = (wordToSelect: string) => {
    setValue('word', wordToSelect);
    handleSubmit(wordToSelect);
  };

  const onClose = () => {
    setIsOpen(false);
    setWord('');
    setLinguisticItem(null);
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
          >
            What German word would you like to learn today?
          </Heading>
        </VStack>

        {/* Input form */}
        <form onSubmit={handleFormSubmit(onFormSubmit)}>
          <VStack gap={{ base: 3, md: 6 }}>
            <HStack
              w="full"
              maxW={{ base: '100%', md: '2xl' }}
              mx="auto"
              border="1px"
              borderColor="gray.200"
              borderRadius={{ base: 'lg', md: '2xl' }}
              p={{ base: 1, md: 2 }}
              shadow="sm"
              transition="all 0.2s"
              _hover={{
                shadow: 'md',
                borderColor: 'gray.300',
              }}
              _focusWithin={{
                shadow: 'lg',
                borderColor: 'blue.400',
              }}
              alignItems="center"
              flexDirection="row"
              gap={2}
              bg="white"
            >
              <Input
                {...register('word', { required: true })}
                placeholder="Enter any German word..."
                size={{ base: 'md', md: 'lg' }}
                fontSize={{ base: 'md', md: 'lg' }}
                border="none"
                outline="none"
                px={{ base: 2, md: 4 }}
                py={{ base: 2, md: 3 }}
                flex={1}
                _placeholder={{
                  color: 'gray.400',
                }}
                _focus={{ boxShadow: 'none' }}
                w="100%"
                bg="white"
              />
              <IconButton
                type="submit"
                aria-label="Generate word card"
                color="white"
                borderRadius="xl"
                size={{ base: 'md', md: 'lg' }}
                transition="all 0.15s"
                _hover={{ transform: 'scale(1.05)' }}
                _active={{ transform: 'scale(0.95)' }}
                w={12}
                h={12}
              >
                <LuArrowRight />
              </IconButton>
            </HStack>

            {/* Example Words Component */}
            <ExampleWords onWordSelect={handleExampleWordSelect} />
          </VStack>
        </form>
      </VStack>

      <GenerateLinguisticItemModal
        isOpen={isOpen}
        word={word}
        isLoading={isLoading}
        error={error}
        linguisticItem={linguisticItem}
        onClose={onClose}
        onRegenerate={handleSubmit}
        onWordSaved={onWordSaved}
      />
    </>
  );
};
