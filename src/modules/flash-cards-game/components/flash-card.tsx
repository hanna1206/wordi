'use client';

import { useState } from 'react';

import { Box, Text } from '@chakra-ui/react';

import { SavedWord } from '@/modules/words-persistence/words-persistence.types';

type FlashCardProps = {
  word: SavedWord;
};

export const FlashCard = ({ word }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

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
      <Box position="absolute" w="full" h="full" backfaceVisibility="hidden">
        {/* Front of the card */}
        <Text fontSize="4xl" fontWeight="bold">
          {word.normalized_word}
        </Text>
      </Box>
      <Box
        position="absolute"
        w="full"
        h="full"
        backfaceVisibility="hidden"
        transform="rotateY(180deg)"
      >
        {/* Back of the card */}
        <Text fontSize="4xl" fontWeight="bold">
          {word.common_data.mainTranslation}
        </Text>
      </Box>
    </Box>
  );
};
