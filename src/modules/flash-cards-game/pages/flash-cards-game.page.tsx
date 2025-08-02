'use client';

import { useEffect, useState } from 'react';
import { FaBrain, FaRandom, FaRegClock } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';

import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  RadioGroup,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { GameModeCard } from '../components/game-mode-card';
import { getDueWordsCount } from '../flash-cards-game.actions';
import { CardSide, GameMode } from '../flash-cards-game.const';

const items = [
  { label: 'Show German Word', value: CardSide.Word },
  { label: 'Show Translation', value: CardSide.Translation },
];

export const FlashCardsGamePage = () => {
  const router = useRouter();
  const [cardSide, setCardSide] = useState<string | null>(CardSide.Word);
  const [dueCount, setDueCount] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDueWordsCount = async () => {
      try {
        const result = await getDueWordsCount();
        if (result.success && result.data) {
          setDueCount(result.data.dueCount);
          setTotalWords(result.data.totalWords);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch due words count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDueWordsCount();
  }, []);

  const handleStartGame = (mode: GameMode, limit: number) => {
    router.push(
      `/flash-cards-game/play?mode=${mode}&limit=${limit}&cardSide=${cardSide}`,
    );
  };

  return (
    <>
      <Box as="main" py={2}>
        <Box mx="auto" px={2}>
          <Box mb={8}>
            <Link href="/" passHref>
              <Button as="a" variant="ghost">
                <HStack>
                  <FaArrowLeft />
                  <Text>Back to Home</Text>
                </HStack>
              </Button>
            </Link>
          </Box>

          <Box w="full" maxW="2xl" mx="auto">
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
                {/* Daily Review - Priority mode */}
                <Box>
                  <GameModeCard
                    icon={FaBrain}
                    title={
                      <Flex align="center" gap={3}>
                        <Text>Daily Review</Text>
                        {!isLoading && (
                          <Badge
                            colorScheme={dueCount > 0 ? 'orange' : 'green'}
                            borderRadius="full"
                          >
                            {dueCount} due
                          </Badge>
                        )}
                      </Flex>
                    }
                    description={
                      dueCount > 0
                        ? `Review ${dueCount} words using spaced repetition algorithm.`
                        : totalWords > 0
                          ? "Great! No words due for review today. You're all caught up!"
                          : 'Start learning words to see them here for review.'
                    }
                    onClick={() =>
                      handleStartGame(
                        GameMode.DueReview,
                        dueCount > 0 ? dueCount : 10,
                      )
                    }
                    disabled={dueCount === 0}
                  />
                </Box>

                {/* Traditional modes */}
                <Box>
                  <Text
                    fontSize="sm"
                    color="gray.500"
                    mb={3}
                    textAlign="center"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Practice Modes
                  </Text>
                  <Flex direction="column" gap={3}>
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
                </Box>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  );
};
