'use client';

import { useState } from 'react';

import { Box, Text } from '@chakra-ui/react';

import { SavedWord } from '@/modules/words-persistence/words-persistence.types';

import { CardSide } from '../flash-cards-game.const';

type FlashCardProps = {
  word: SavedWord;
  cardSide: CardSide;
  allWordIds: string[];
};

export const FlashCard = ({ word, cardSide, allWordIds }: FlashCardProps) => {
  // Initialize flip states for all words with false as default
  const [flipStates, setFlipStates] = useState<Record<string, boolean>>(() =>
    allWordIds.reduce((acc, id) => ({ ...acc, [id]: false }), {}),
  );

  const isFlipped = flipStates[word.id] || false;

  const handleFlip = () => {
    setFlipStates((prev) => ({
      ...prev,
      [word.id]: !prev[word.id],
    }));
  };

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

  return (
    <Box
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
      transition="transform 0.6s"
      transformStyle="preserve-3d"
      transform={isFlipped ? 'rotateY(180deg)' : 'none'}
    >
      <Box
        position="absolute"
        w="full"
        h="full"
        backfaceVisibility="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* Front of the card */}
        <Text fontSize="4xl" fontWeight="bold">
          {frontContent}
        </Text>
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
      >
        {/* Back of the card */}
        <Box textAlign="center">
          <Text
            fontSize="4xl"
            fontWeight="bold"
            mb={hasAdditionalTranslations ? 4 : 0}
          >
            {backContent}
          </Text>
        </Box>

        {hasAdditionalTranslations && (
          <Box
            textAlign="center"
            borderTop="2px solid"
            borderColor="gray.200"
            pt={4}
            w="80%"
          >
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
              letterSpacing="wide"
              mb={3}
            >
              Also means
            </Text>
            <Text fontSize="lg" color="gray.700" lineHeight="relaxed">
              {additionalTranslations.join(' • ')}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
