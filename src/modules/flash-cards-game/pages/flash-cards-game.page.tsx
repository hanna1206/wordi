'use client';

import { useState } from 'react';
import { FaRandom, FaRegClock } from 'react-icons/fa';

import { Box, Flex, Heading, HStack, RadioGroup, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { GameModeCard } from '../components/game-mode-card';
import { CardSide, GameMode } from '../flash-cards-game.const';

const items = [
  { label: 'Show German Word', value: CardSide.Word },
  { label: 'Show Translation', value: CardSide.Translation },
];

export const FlashCardsGamePage = () => {
  const router = useRouter();
  const [cardSide, setCardSide] = useState<string | null>(CardSide.Word);

  const handleStartGame = (mode: GameMode, limit: number) => {
    router.push(
      `/flash-cards-game/play?mode=${mode}&limit=${limit}&cardSide=${cardSide}`,
    );
  };

  return (
    <Box w="full" maxW="2xl" mx="auto" py={10}>
      <Flex direction="column" gap={8}>
        <Flex direction="column" gap={2} textAlign="center">
          <Heading as="h1" size="xl">
            Flashcards Game
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Choose a mode to start practicing your words.
          </Text>
        </Flex>

        <Flex direction="column" gap={2}>
          <Heading as="h3" size="md" textAlign="center">
            Choose what to show on the front
          </Heading>
          <RadioGroup.Root
            value={cardSide}
            onValueChange={(e) => setCardSide(e.value)}
          >
            <HStack gap="6" justifyContent="center">
              {items.map((item) => (
                <RadioGroup.Item key={item.value} value={item.value}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                </RadioGroup.Item>
              ))}
            </HStack>
          </RadioGroup.Root>
        </Flex>

        <Flex direction="column" w="full" gap={4}>
          <GameModeCard
            icon={FaRegClock}
            title="Practice 10 Latest Words"
            description="Review the most recent words you've saved."
            onClick={() => handleStartGame(GameMode.Latest, 10)}
          />
          <GameModeCard
            icon={FaRegClock}
            title="Practice 20 Latest Words"
            description="A longer session with your newest words."
            onClick={() => handleStartGame(GameMode.Latest, 20)}
          />
          <GameModeCard
            icon={FaRandom}
            title="Practice 10 Random Words"
            description="Shuffle your saved words for a surprise review."
            onClick={() => handleStartGame(GameMode.Random, 10)}
          />
          <GameModeCard
            icon={FaRandom}
            title="Practice 20 Random Words"
            description="A bigger random set for a more robust practice."
            onClick={() => handleStartGame(GameMode.Random, 20)}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
