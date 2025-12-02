'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuArrowRight } from 'react-icons/lu';

import {
  Heading,
  HStack,
  IconButton,
  Input,
  Switch,
  VStack,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { toaster } from '@/components/toaster';
import type { CollectionWithCount } from '@/modules/collection/collections.types';
import { CollectionSelectionDialog } from '@/modules/collection/components/collection-selection-dialog';
import type { GenerateLinguisticItemModalProps } from '@/modules/linguistics/components/generate-linguistic-item-modal';
import { TranslationSelectionDialog } from '@/modules/linguistics/components/translation-selection-dialog';
import {
  detectLanguageAndTranslate,
  generateLinguisticItem,
} from '@/modules/linguistics/linguistics.actions';
import type {
  LanguageDetectionResult,
  LinguisticCollocationItem,
  LinguisticWordItem,
} from '@/modules/linguistics/linguistics.types';

const GenerateLinguisticItemModal = dynamic<GenerateLinguisticItemModalProps>(
  () =>
    import(
      '@/modules/linguistics/components/generate-linguistic-item-modal'
    ).then((mod) => mod.GenerateLinguisticItemModal),
  {
    ssr: false,
    loading: () => null,
  },
);

interface FormData {
  word: string;
}

type PendingSaveToast = {
  title: string;
  description: string;
};

interface GenerateLinguisticItemFormProps {
  collections: CollectionWithCount[];
}

export const GenerateLinguisticItemForm = ({
  collections,
}: GenerateLinguisticItemFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [word, setWord] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linguisticItem, setLinguisticItem] = useState<
    LinguisticWordItem | LinguisticCollocationItem | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [savedVocabularyItemId, setSavedVocabularyItemId] = useState<
    string | null
  >(null);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [pendingSaveToast, setPendingSaveToast] =
    useState<PendingSaveToast | null>(null);

  // Translation dialog state
  const [translationDialogOpen, setTranslationDialogOpen] = useState(false);
  const [detectionResult, setDetectionResult] =
    useState<LanguageDetectionResult | null>(null);
  const [detectionLoading, setDetectionLoading] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [originalInput, setOriginalInput] = useState('');
  const [detectLanguage, setDetectLanguage] = useState(false);

  // Request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
  } = useForm<FormData>();

  const handleSubmit = async (wordToTranslate: string) => {
    if (!wordToTranslate.trim()) return;
    if (isLoading || detectionLoading) return;

    const trimmedInput = wordToTranslate.trim();

    // If language detection is disabled, proceed directly to linguistic generation
    if (!detectLanguage) {
      await proceedWithLinguisticGeneration(trimmedInput);
      return;
    }

    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setOriginalInput(trimmedInput);
    setDetectionLoading(true);
    setDetectionError(null);

    try {
      // First, detect language and get translations
      const detectionResult = await detectLanguageAndTranslate(trimmedInput);

      // Check if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      if (detectionResult.success && detectionResult.data) {
        setDetectionResult(detectionResult.data);

        // If German detected, proceed directly to linguistic generation
        if (detectionResult.data.isTargetLanguage) {
          setDetectionLoading(false);
          await proceedWithLinguisticGeneration(trimmedInput);
        } else {
          // Non-German detected, show translation dialog
          setDetectionLoading(false);
          setTranslationDialogOpen(true);
        }
      } else {
        setDetectionError(detectionResult.error || 'Failed to detect language');
        setDetectionLoading(false);
        setTranslationDialogOpen(true);
      }
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      setDetectionError('An unexpected error occurred');
      // eslint-disable-next-line no-console
      console.error('Language detection error:', err);
      setDetectionLoading(false);
      setTranslationDialogOpen(true);
    }
  };

  const proceedWithLinguisticGeneration = async (germanWord: string) => {
    setWord(germanWord);
    setIsOpen(true);
    setIsLoading(true);
    setLinguisticItem(null);
    setError(null);

    try {
      const result = await generateLinguisticItem(germanWord);
      if (result.success && result.data) {
        setLinguisticItem(result.data);
        reset();
      } else {
        setError(result.error || 'Failed to translate word');
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

  const handleTranslationSelection = async (selectedTranslation: string) => {
    setTranslationDialogOpen(false);
    await proceedWithLinguisticGeneration(selectedTranslation);
  };

  const handleTranslationDialogClose = () => {
    setTranslationDialogOpen(false);
    setDetectionResult(null);
    setDetectionError(null);
    setDetectionLoading(false);
    setOriginalInput('');
  };

  const handleTranslationRetry = async () => {
    if (originalInput) {
      setTranslationDialogOpen(false);
      await handleSubmit(originalInput);
    }
  };

  const onFormSubmit = (data: FormData) => {
    handleSubmit(data.word);
  };

  const onClose = () => {
    setIsOpen(false);
    setWord('');
    setLinguisticItem(null);
    setError(null);
  };

  const handleSavedForLearning: GenerateLinguisticItemModalProps['onSavedForLearning'] =
    ({ vocabularyItemId, type }) => {
      setSavedVocabularyItemId(vocabularyItemId);
      setPendingSaveToast({
        title: type === 'collocation' ? 'Collocation saved!' : 'Word saved!',
        description:
          type === 'collocation'
            ? 'Collocation has been saved for learning'
            : 'Word has been saved for learning',
      });
      setIsCollectionDialogOpen(true);
    };

  const handleCollectionDialogClose = () => {
    if (pendingSaveToast) {
      toaster.create({
        ...pendingSaveToast,
        type: 'success',
        duration: 3000,
      });
      setPendingSaveToast(null);
    }
    setIsCollectionDialogOpen(false);
    setSavedVocabularyItemId(null);
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
            What word would you like to learn today?
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
              }}
              alignItems="center"
              flexDirection="row"
              gap={2}
              bg="white"
            >
              <Input
                {...register('word', { required: true })}
                placeholder="Enter any word..."
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
                disabled={isLoading || detectionLoading}
                loading={isLoading || detectionLoading}
              >
                <LuArrowRight />
              </IconButton>
            </HStack>
            {/* Language detection toggle */}
            <HStack
              w="full"
              maxW={{ base: '100%', md: '2xl' }}
              mx="auto"
              justify="flex-start"
              px={{ base: 1, md: 0 }}
            >
              <Switch.Root
                size="sm"
                checked={detectLanguage}
                onCheckedChange={(e) => setDetectLanguage(e.checked)}
              >
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Label fontSize="xs">Enable translation</Switch.Label>
              </Switch.Root>
            </HStack>
          </VStack>
        </form>
      </VStack>

      {(isOpen || isLoading || linguisticItem || error) && (
        <GenerateLinguisticItemModal
          isOpen={isOpen}
          word={word}
          isLoading={isLoading}
          error={error}
          linguisticItem={linguisticItem}
          onClose={onClose}
          onRegenerate={handleSubmit}
          onSavedForLearning={handleSavedForLearning}
          collections={collections}
        />
      )}

      <CollectionSelectionDialog
        isOpen={isCollectionDialogOpen}
        vocabularyItemId={savedVocabularyItemId}
        onClose={handleCollectionDialogClose}
        collections={collections}
      />

      <TranslationSelectionDialog
        isOpen={translationDialogOpen}
        originalInput={originalInput}
        detectedLanguage={detectionResult?.detectedLanguage || 'Unknown'}
        translations={detectionResult?.translations || []}
        isLoading={detectionLoading}
        error={detectionError}
        onSelectTranslation={handleTranslationSelection}
        onClose={handleTranslationDialogClose}
        onRetry={handleTranslationRetry}
      />
    </>
  );
};
