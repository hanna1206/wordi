'use client';

import { forwardRef, useCallback, useState } from 'react';

import { Box, Text } from '@chakra-ui/react';

import { VocabularyItem } from '@/modules/vocabulary/vocabulary.types';

import { CardSide } from '../flashcards.const';

type FlashCardProps = {
  word: VocabularyItem;
  cardSide: CardSide;
  allWordIds: string[];
  onFlip?: (wordId: string, isFlipped: boolean) => void;
};

export const FlashCard = forwardRef<HTMLDivElement, FlashCardProps>(
  ({ word, cardSide, allWordIds, onFlip }, ref) => {
    // Initialize flip states for all words with false as default
    const [flipStates, setFlipStates] = useState<Record<string, boolean>>(() =>
      allWordIds.reduce((acc, id) => ({ ...acc, [id]: false }), {}),
    );
    const [hasFlippedAny, setHasFlippedAny] = useState(false);

    const isFlipped = flipStates[word.id] || false;

    const handleFlip = useCallback(() => {
      const next = !isFlipped;
      setFlipStates((prev) => ({ ...prev, [word.id]: next }));
      setHasFlippedAny(true);
      if (onFlip) onFlip(word.id, next);
    }, [isFlipped, onFlip, word.id]);

    const frontContent =
      cardSide === CardSide.Word
        ? word.normalizedWord
        : word.commonData.mainTranslation;

    const backContent =
      cardSide === CardSide.Word
        ? word.commonData.mainTranslation
        : word.normalizedWord;

    const additionalTranslations = word.commonData.additionalTranslations || [];
    const hasAdditionalTranslations = additionalTranslations.length > 0;

    const ariaLabel = `Flashcard. ${isFlipped ? 'Back' : 'Front'} side showing. Press to flip`;

    return (
      <Box
        w="full"
        style={{
          perspective: '1200px',
          WebkitPerspective: '1200px',
          MozPerspective: '1200px',
        }}
      >
        <Box
          role="button"
          tabIndex={-1}
          aria-label={ariaLabel}
          aria-pressed={isFlipped}
          key={word.id}
          w="full"
          h="320px"
          bg="transparent"
          borderRadius="2xl"
          boxShadow="0 8px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 10px -5px rgba(0, 0, 0, 0.04)"
          p={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          cursor="pointer"
          onClick={handleFlip}
          border="1px solid"
          borderColor="transparent"
          transition="transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 0.3s ease"
          transformStyle="preserve-3d"
          transform={isFlipped ? 'rotateY(180deg)' : 'none'}
          position="relative"
          willChange="transform"
          style={{
            WebkitTransformStyle: 'preserve-3d',
            MozTransformStyle: 'preserve-3d',
            WebkitPerspective: '1200px',
            MozPerspective: '1200px',
          }}
          ref={ref}
          _hover={{
            boxShadow:
              '0 15px 35px -10px rgba(0, 0, 0, 0.1), 0 8px 15px -5px rgba(0, 0, 0, 0.05)',
            transform: isFlipped
              ? 'rotateY(180deg) scale(1.03)'
              : 'scale(1.03)',
          }}
          _active={{
            transform: isFlipped
              ? 'rotateY(180deg) scale(0.99)'
              : 'scale(0.99)',
            boxShadow:
              '0 5px 15px -3px rgba(0, 0, 0, 0.08), 0 3px 6px -2px rgba(0, 0, 0, 0.04)',
          }}
          _focus={{
            outline: 'none',
          }}
        >
          <Box
            position="absolute"
            inset={0}
            w="full"
            h="full"
            backfaceVisibility="hidden"
            display={isFlipped ? 'none' : 'flex'}
            alignItems="center"
            justifyContent="center"
            px={6}
            py={6}
            borderRadius="2xl"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            overflow="hidden"
            style={{
              WebkitBackfaceVisibility: 'hidden',
              MozBackfaceVisibility: 'hidden',
            }}
          >
            {/* Front of the card */}
            <Box maxH="100%" overflowY="auto" zIndex={1}>
              <Text
                fontSize="clamp(28px, 8vw, 44px)"
                lineHeight="1.2"
                fontWeight="bold"
                color="gray.800"
                wordBreak="break-word"
                hyphens="auto"
                letterSpacing="-0.02em"
              >
                {frontContent}
              </Text>
            </Box>

            {!hasFlippedAny && !isFlipped && (
              <Box
                position="absolute"
                bottom={5}
                left="50%"
                transform="translateX(-50%)"
                px={3}
                py={1.5}
                borderRadius="full"
                bg="rgba(0,0,0,0.04)"
                color="gray.600"
                fontSize="xs"
                fontWeight="medium"
                pointerEvents="none"
                display="flex"
                alignItems="center"
                gap={1.5}
              >
                <Text display={{ base: 'inline', lg: 'none' }}>
                  Tap to flip
                </Text>
                <Text display={{ base: 'none', lg: 'inline' }}>
                  Press Space to flip
                </Text>
              </Box>
            )}
          </Box>
          <Box
            position="absolute"
            inset={0}
            w="full"
            h="full"
            backfaceVisibility="hidden"
            transform="rotateY(180deg)"
            display={isFlipped ? 'flex' : 'none'}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={hasAdditionalTranslations ? 4 : 0}
            px={6}
            py={6}
            borderRadius="2xl"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            overflow="hidden"
            style={{
              WebkitBackfaceVisibility: 'hidden',
              MozBackfaceVisibility: 'hidden',
            }}
          >
            {/* Back of the card */}
            <Box textAlign="center" maxH="50%" overflowY="auto" zIndex={1}>
              <Text
                fontSize="clamp(28px, 8vw, 44px)"
                lineHeight="1.2"
                fontWeight="bold"
                color="gray.800"
                mb={hasAdditionalTranslations ? 4 : 0}
                wordBreak="break-word"
                hyphens="auto"
                letterSpacing="-0.02em"
              >
                {backContent}
              </Text>
            </Box>

            {hasAdditionalTranslations && (
              <Box
                position="relative"
                w="90%"
                maxH="40%"
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
                <Box
                  display="flex"
                  flexWrap="wrap"
                  gap={2}
                  justifyContent="center"
                >
                  {additionalTranslations.map((t) => (
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
                  bgGradient="linear(to-t, white, transparent)"
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  },
);

FlashCard.displayName = 'FlashCard';
