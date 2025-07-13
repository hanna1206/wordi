'use client';

import React, { useEffect, useState } from 'react';
import {
  LuBook,
  LuCoffee,
  LuGraduationCap,
  LuHeart,
  LuMusic,
  LuSparkles,
  LuStar,
  LuSun,
} from 'react-icons/lu';

import { Button, HStack, Text, VStack } from '@chakra-ui/react';

interface ExampleWordsProps {
  onWordSelect: (word: string) => void;
}

interface WordSet {
  noun: { word: string; icon: React.ElementType };
  verb: { word: string; icon: React.ElementType };
  adjective: { word: string; icon: React.ElementType };
}

const WORD_SETS: WordSet[] = [
  {
    noun: { word: 'das Buch', icon: LuBook },
    verb: { word: 'lernen', icon: LuGraduationCap },
    adjective: { word: 'wunderbar', icon: LuSparkles },
  },
  {
    noun: { word: 'das Haus', icon: LuBook },
    verb: { word: 'lieben', icon: LuHeart },
    adjective: { word: 'schön', icon: LuSun },
  },
  {
    noun: { word: 'der Kaffee', icon: LuCoffee },
    verb: { word: 'trinken', icon: LuCoffee },
    adjective: { word: 'heiß', icon: LuSun },
  },
  {
    noun: { word: 'die Musik', icon: LuMusic },
    verb: { word: 'hören', icon: LuMusic },
    adjective: { word: 'laut', icon: LuSparkles },
  },
  {
    noun: { word: 'der Stern', icon: LuStar },
    verb: { word: 'scheinen', icon: LuStar },
    adjective: { word: 'hell', icon: LuSun },
  },
  {
    noun: { word: 'die Blume', icon: LuSparkles },
    verb: { word: 'wachsen', icon: LuSparkles },
    adjective: { word: 'bunt', icon: LuSparkles },
  },
  {
    noun: { word: 'das Auto', icon: LuBook },
    verb: { word: 'fahren', icon: LuSparkles },
    adjective: { word: 'schnell', icon: LuSparkles },
  },
  {
    noun: { word: 'das Lächeln', icon: LuHeart },
    verb: { word: 'lächeln', icon: LuHeart },
    adjective: { word: 'freundlich', icon: LuHeart },
  },
];

export const ExampleWords: React.FC<ExampleWordsProps> = ({ onWordSelect }) => {
  const [selectedSet, setSelectedSet] = useState<WordSet>(WORD_SETS[0]); // Default to first set
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const randomIndex = Math.floor(Math.random() * WORD_SETS.length);
    setSelectedSet(WORD_SETS[randomIndex]);
  }, []);

  const exampleWords = [
    selectedSet.noun,
    selectedSet.verb,
    selectedSet.adjective,
  ];

  // Don't render the random selection until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  return (
    <VStack gap={{ base: 2, md: 4 }} mt={4}>
      <Text
        fontSize={{ base: 'xs', md: 'sm' }}
        color="gray.500"
        fontWeight="medium"
      >
        Try these
      </Text>
      <HStack gap={{ base: 1, md: 3 }} flexWrap="wrap" justify="center">
        {exampleWords.map(({ word, icon: Icon }) => (
          <Button
            key={word}
            type="button"
            onClick={() => onWordSelect(word)}
            variant="subtle"
            size={{ base: 'xs', md: 'md' }}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Icon size={14} />
            {word}
          </Button>
        ))}
      </HStack>
    </VStack>
  );
};
