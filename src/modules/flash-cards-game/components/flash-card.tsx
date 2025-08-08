'use client';

import { forwardRef, useCallback, useState } from 'react';

import { Box, Text } from '@chakra-ui/react';

import { SavedWord } from '@/modules/words-persistence/words-persistence.types';

import { CardSide } from '../flash-cards-game.const';

type FlashCardProps = {
  word: SavedWord;
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
      setFlipStates((prev) => {
        const next = !prev[word.id];
        const updated = { ...prev, [word.id]: next };
        if (onFlip) onFlip(word.id, next);
        return updated;
      });
      setHasFlippedAny(true);
    }, [onFlip, word.id]);

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
      <Box w="full" style={{ perspective: '1000px' }}>
        <Box
          role="button"
          tabIndex={-1}
          aria-label={ariaLabel}
          aria-pressed={isFlipped}
          key={word.id}
          w="full"
          h="300px"
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
          p={6}
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          cursor="pointer"
          onClick={handleFlip}
          border="1px solid"
          borderColor="gray.200"
          transition="transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease"
          transformStyle="preserve-3d"
          transform={isFlipped ? 'rotateY(180deg)' : 'none'}
          position="relative"
          willChange="transform"
          ref={ref}
          _focus={{ outline: 'none', boxShadow: 'none' }}
        >
          <Box
            position="absolute"
            w="full"
            h="full"
            backfaceVisibility="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={4}
            py={4}
          >
            {/* Front of the card */}
            <Box maxH="100%" overflowY="auto">
              <Text
                fontSize="clamp(24px, 8vw, 40px)"
                lineHeight="1.1"
                fontWeight="bold"
                wordBreak="break-word"
                hyphens="auto"
              >
                {frontContent}
              </Text>
            </Box>

            {!hasFlippedAny && !isFlipped && (
              <Box
                position="absolute"
                bottom={4}
                left="50%"
                transform="translateX(-50%)"
                px={3}
                py={1}
                borderRadius="full"
                bg="gray.800"
                color="white"
                fontSize="xs"
                opacity={0.85}
                pointerEvents="none"
              >
                Tap or press Space to flip
              </Box>
            )}
          </Box>
          <Box
            position="absolute"
            w="full"
            h="full"
            backfaceVisibility="hidden"
            transform="rotateY(180deg)"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={hasAdditionalTranslations ? 6 : 0}
            px={4}
            py={4}
          >
            {/* Back of the card */}
            <Box textAlign="center" maxH="50%" overflowY="auto">
              <Text
                fontSize="clamp(24px, 8vw, 40px)"
                lineHeight="1.1"
                fontWeight="bold"
                mb={hasAdditionalTranslations ? 4 : 0}
                wordBreak="break-word"
                hyphens="auto"
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
                pt={1}
              >
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
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
                      py={1}
                      borderRadius="full"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      color="gray.700"
                      fontSize="sm"
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
                  height="16px"
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
