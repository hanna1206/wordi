'use client';

import { useEffect, useState } from 'react';
import { FaBrain, FaRandom, FaRegClock } from 'react-icons/fa';

import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  RadioGroup,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { PageHeader } from '@/components/page-header';
import { SidebarLayout } from '@/components/sidebar-layout';

import { GameModeCard } from '../components/game-mode-card';
import { getDueWordsCount } from '../flash-cards-game.actions';
import { CardSide, GameMode } from '../flash-cards-game.const';

const STORAGE_KEY = 'flashcards_due_meta_v1';

const CARD_SIDE_OPTIONS = [
  { label: 'Show German Word', value: CardSide.Word },
  { label: 'Show Translation', value: CardSide.Translation },
];

export const FlashCardsGameSettingsPage = () => {
  const router = useRouter();
  const [cardSide, setCardSide] = useState<string | null>(CardSide.Word);
  const [dueCount, setDueCount] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const cachedRaw = window.localStorage.getItem(STORAGE_KEY);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw) as {
          date: string;
          dueCount: number;
          totalWords: number;
        };
        const isSameDay =
          new Date(cached.date).toDateString() === new Date().toDateString();
        if (isSameDay) {
          setDueCount(cached.dueCount);
          setTotalWords(cached.totalWords);
          setIsLoading(false);
        }
      }
    } catch {}

    const fetchDueWordsCount = async () => {
      try {
        const result = await getDueWordsCount();
        if (result.success && result.data) {
          setDueCount(result.data.dueCount);
          setTotalWords(result.data.totalWords);

          try {
            window.localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({
                date: new Date().toISOString(),
                dueCount: result.data.dueCount,
                totalWords: result.data.totalWords,
              }),
            );
          } catch {}
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
    <SidebarLayout>
      <Box as="main" p={8}>
        <PageHeader
          title="Flashcards Game"
          description="Practice smarter with daily review or quick modes."
        />
        <Box mx="auto" px={4} maxW="3xl">
          <Box w="full" mx="auto">
            <Flex direction="column" gap={10}>
              <Flex direction="column" gap={2}>
                <Heading as="h3" size="md" textAlign="center">
                  Choose what to show on the front
                </Heading>
                <RadioGroup.Root
                  value={cardSide}
                  onValueChange={(e) => setCardSide(e.value)}
                >
                  <HStack
                    gap="6"
                    justifyContent="center"
                    bg="white"
                    px={4}
                    py={3}
                    borderRadius="xl"
                    borderWidth={1}
                    borderColor="gray.200"
                  >
                    {CARD_SIDE_OPTIONS.map((item) => (
                      <RadioGroup.Item key={item.value} value={item.value}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    ))}
                  </HStack>
                </RadioGroup.Root>
              </Flex>

              <Flex direction="column" w="full" gap={6}>
                {/* Daily Review - Priority mode */}
                <Box>
                  <GameModeCard
                    icon={FaBrain}
                    title={
                      <Flex align="center" gap={3}>
                        <Text>Daily Review</Text>
                        {isLoading ? (
                          <HStack color="gray.500" fontSize="sm">
                            <Spinner size="sm" />
                            <Text>Checking due words...</Text>
                          </HStack>
                        ) : (
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
                    subtext="Best for maintaining progress daily with spaced repetition."
                    onClick={() =>
                      handleStartGame(
                        GameMode.DueReview,
                        dueCount > 0 ? dueCount : 10,
                      )
                    }
                    disabled={dueCount === 0}
                    isLoading={isLoading}
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
                  <Flex
                    direction={{ base: 'column', md: 'row' }}
                    gap={4}
                    align="stretch"
                    flexWrap="wrap"
                  >
                    <Box flex={{ md: 1 }} minW={{ md: 'calc(50% - 8px)' }}>
                      <GameModeCard
                        icon={FaRegClock}
                        title="Practice 10 Latest Words"
                        description="Review the most recent words you've saved."
                        subtext="A quick warm-up with your newest vocabulary."
                        onClick={() => handleStartGame(GameMode.Latest, 10)}
                      />
                    </Box>
                    <Box flex={{ md: 1 }} minW={{ md: 'calc(50% - 8px)' }}>
                      <GameModeCard
                        icon={FaRegClock}
                        title="Practice 20 Latest Words"
                        description="A longer session with your newest words."
                        subtext="Great when you just added many words."
                        onClick={() => handleStartGame(GameMode.Latest, 20)}
                      />
                    </Box>
                    <Box flex={{ md: 1 }} minW={{ md: 'calc(50% - 8px)' }}>
                      <GameModeCard
                        icon={FaRandom}
                        title="Practice 10 Random Words"
                        description="Shuffle your saved words for a surprise review."
                        subtext="Good for variety and effective spaced retrieval practice."
                        onClick={() => handleStartGame(GameMode.Random, 10)}
                      />
                    </Box>
                    <Box flex={{ md: 1 }} minW={{ md: 'calc(50% - 8px)' }}>
                      <GameModeCard
                        icon={FaRandom}
                        title="Practice 20 Random Words"
                        description="A bigger random set for a more robust practice."
                        subtext="Use when you want a longer, mixed session."
                        onClick={() => handleStartGame(GameMode.Random, 20)}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Box>
    </SidebarLayout>
  );
};
