'use client';

import { useState } from 'react';

import { Box, Text } from '@chakra-ui/react';

import { SavedWord } from '@/modules/words-persistence/words-persistence.types';

import { CardSide } from '../flash-cards-game.const';

type FlashCardProps = {
  word: SavedWord;
  cardSide: CardSide;
};

export const FlashCard = ({ word, cardSide }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const frontContent =
    cardSide === CardSide.Word
      ? word.normalized_word
      : word.common_data.mainTranslation;

  const backContent =
    cardSide === CardSide.Word
      ? word.common_data.mainTranslation
      : word.normalized_word;

  return (
    <Box
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
        alignItems="center"
        justifyContent="center"
      >
        {/* Back of the card */}
        <Text fontSize="4xl" fontWeight="bold">
          {backContent}
        </Text>
      </Box>
    </Box>
  );
};
