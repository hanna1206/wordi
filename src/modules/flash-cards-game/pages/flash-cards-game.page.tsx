'use client';

import { FaRandom, FaRegClock } from 'react-icons/fa';

import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { GameModeCard } from '../components/game-mode-card';

export const FlashCardsGamePage = () => {
  const router = useRouter();

  const handleStartGame = (mode: string, limit: number) => {
    router.push(`/flash-cards-game/play?mode=${mode}&limit=${limit}`);
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

        <Flex direction="column" w="full" gap={4}>
          <GameModeCard
            icon={FaRegClock}
            title="Practice 10 Latest Words"
            description="Review the most recent words you've saved."
            onClick={() => handleStartGame('latest', 10)}
          />
          <GameModeCard
            icon={FaRegClock}
            title="Practice 20 Latest Words"
            description="A longer session with your newest words."
            onClick={() => handleStartGame('latest', 20)}
          />
          <GameModeCard
            icon={FaRandom}
            title="Practice 10 Random Words"
            description="Shuffle your saved words for a surprise review."
            onClick={() => handleStartGame('random', 10)}
          />
          <GameModeCard
            icon={FaRandom}
            title="Practice 20 Random Words"
            description="A bigger random set for a more robust practice."
            onClick={() => handleStartGame('random', 20)}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
