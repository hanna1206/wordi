'use client';

import { useEffect, useMemo, useState } from 'react';
import type { IconType } from 'react-icons';
import { FaBrain, FaRandom, FaRegClock } from 'react-icons/fa';

import {
  Badge,
  Button,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  Flex,
  Icon,
  Portal,
  RadioCard,
  SegmentGroup,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { getDueWordsCount } from '../flash-cards-game.actions';
import { CardSide, GameMode } from '../flash-cards-game.const';

interface GameModeOption {
  id: string;
  mode: GameMode;
  limit: number;
  icon: IconType;
  title: string;
  description: string;
  subtext?: string;
  disabled?: boolean;
  badge?: {
    text: string;
    colorScheme: string;
  };
}

interface FlashCardsSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlashCardsSettingsDialog = ({
  isOpen,
  onClose,
}: FlashCardsSettingsDialogProps) => {
  const router = useRouter();
  const [cardSide, setCardSide] = useState<string | null>(CardSide.Word);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [dueCount, setDueCount] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const gameModeOptions = useMemo<GameModeOption[]>(() => {
    const dailyReviewDescription =
      dueCount > 0
        ? `Review ${dueCount} words using spaced repetition algorithm.`
        : totalWords > 0
          ? "Great! No words due for review today. You're all caught up!"
          : 'Start learning words to see them here for review.';

    return [
      {
        id: 'daily-review',
        mode: GameMode.DueReview,
        limit: dueCount > 0 ? dueCount : 10,
        icon: FaBrain,
        title: 'Daily Review',
        description: dailyReviewDescription,
        subtext: 'Best for maintaining progress daily with spaced repetition.',
        disabled: dueCount === 0,
        badge: isLoading
          ? undefined
          : {
              text: `${dueCount} due`,
              colorScheme: dueCount > 0 ? 'orange' : 'green',
            },
      },
      {
        id: 'latest-10',
        mode: GameMode.Latest,
        limit: 10,
        icon: FaRegClock,
        title: 'Practice 10 Latest Words',
        description: "Review the most recent words you've saved.",
        subtext: 'A quick warm-up with your newest vocabulary.',
      },
      {
        id: 'latest-20',
        mode: GameMode.Latest,
        limit: 20,
        icon: FaRegClock,
        title: 'Practice 20 Latest Words',
        description: 'A longer session with your newest words.',
        subtext: 'Great when you just added many words.',
      },
      {
        id: 'random-10',
        mode: GameMode.Random,
        limit: 10,
        icon: FaRandom,
        title: 'Practice 10 Random Words',
        description: 'Shuffle your saved words for a surprise review.',
        subtext: 'Good for variety and effective spaced retrieval practice.',
      },
      {
        id: 'random-20',
        mode: GameMode.Random,
        limit: 20,
        icon: FaRandom,
        title: 'Practice 20 Random Words',
        description: 'A bigger random set for a more robust practice.',
        subtext: 'Use when you want a longer, mixed session.',
      },
    ];
  }, [dueCount, totalWords, isLoading]);

  const isSelectedModeDisabled = useMemo(() => {
    if (!selectedMode) return false;
    const selectedOption = gameModeOptions.find(
      (option) => option.id === selectedMode,
    );
    return selectedOption?.disabled ?? false;
  }, [selectedMode, gameModeOptions]);

  useEffect(() => {
    if (!isOpen) return;

    const STORAGE_KEY = 'flashcards_due_meta_v1';

    // Try to load from localStorage first
    try {
      const cachedRaw = window.localStorage.getItem(STORAGE_KEY);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        const isSameDay =
          new Date(cached.date).toDateString() === new Date().toDateString();
        if (isSameDay) {
          setDueCount(cached.dueCount);
          setTotalWords(cached.totalWords);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Silently fail if cache is corrupted
    }

    // Fetch fresh data if cache is stale or missing
    const fetchDueWordsCount = async () => {
      try {
        const result = await getDueWordsCount();
        if (result.success && result.data) {
          setDueCount(result.data.dueCount);
          setTotalWords(result.data.totalWords);

          // Cache the result
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              date: new Date().toISOString(),
              dueCount: result.data.dueCount,
              totalWords: result.data.totalWords,
            }),
          );
        }
      } catch {
        // Silently fail if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchDueWordsCount();
  }, [isOpen]);

  const handleOpenChange = (details: { open: boolean }) => {
    if (!details.open) {
      onClose();
      setSelectedMode(null);
    }
  };

  const handleStartGame = () => {
    if (!selectedMode) return;

    const selectedOption = gameModeOptions.find(
      (option) => option.id === selectedMode,
    );

    if (!selectedOption) return;

    // Close dialog first
    onClose();

    // Navigate to game
    router.push(
      `/flash-cards-game?mode=${selectedOption.mode}&limit=${selectedOption.limit}&cardSide=${cardSide}`,
    );
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={handleOpenChange}
      // size={{ base: 'full', md: 'md' }}
      size="md"
    >
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent
            w={{ base: '100vw', md: 'auto' }}
            h={{ base: '100vh', md: 'auto' }}
            maxH={{ base: '100vh', md: '85vh' }}
            m={{ base: 0, md: 'auto' }}
            borderRadius={{ base: 0, md: 'lg' }}
            overflowY="auto"
          >
            <DialogHeader>
              <DialogTitle>Flashcards Settings</DialogTitle>
              <DialogCloseTrigger />
            </DialogHeader>

            <DialogBody py={{ base: 6, md: 4 }}>
              <Flex direction="column" gap={{ base: 6, md: 4 }}>
                {/* Card Side Selector */}
                <Flex direction="column" gap={2}>
                  <Text fontWeight="medium" fontSize="sm">
                    Card Side
                  </Text>
                  <SegmentGroup.Root
                    value={cardSide}
                    onValueChange={(e) => setCardSide(e.value)}
                    size="md"
                  >
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Item value={CardSide.Word}>
                      <SegmentGroup.ItemText>
                        Show German Word
                      </SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                    <SegmentGroup.Item value={CardSide.Translation}>
                      <SegmentGroup.ItemText>
                        Show Translation
                      </SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                  </SegmentGroup.Root>
                </Flex>

                {/* Game Mode Options */}
                <Flex direction="column" gap={2}>
                  <Text fontWeight="medium" fontSize="sm">
                    Game Mode
                  </Text>
                  <RadioCard.Root
                    value={selectedMode}
                    onValueChange={(e) => setSelectedMode(e.value)}
                  >
                    <Flex direction="column" gap={3}>
                      {gameModeOptions.map((option) => (
                        <RadioCard.Item
                          key={option.id}
                          value={option.id}
                          disabled={option.disabled || isLoading}
                        >
                          <RadioCard.ItemHiddenInput />
                          <Flex align="flex-start" gap={3} w="full">
                            {/* Icon container */}
                            <Flex
                              align="center"
                              justify="center"
                              boxSize={10}
                              borderRadius="full"
                              bg={
                                option.disabled || isLoading
                                  ? 'gray.100'
                                  : 'blue.50'
                              }
                              border="1px solid"
                              borderColor={
                                option.disabled || isLoading
                                  ? 'gray.200'
                                  : 'blue.200'
                              }
                              flexShrink={0}
                            >
                              {isLoading && option.id === 'daily-review' ? (
                                <Spinner size="sm" color="blue.500" />
                              ) : (
                                <Icon
                                  as={option.icon}
                                  boxSize={5}
                                  color={
                                    option.disabled || isLoading
                                      ? 'gray.400'
                                      : 'blue.600'
                                  }
                                />
                              )}
                            </Flex>

                            {/* Content */}
                            <Flex direction="column" gap={1} flex={1} minW={0}>
                              <Flex align="center" gap={2} flexWrap="wrap">
                                <Text
                                  fontSize="md"
                                  fontWeight="bold"
                                  color={
                                    option.disabled || isLoading
                                      ? 'gray.500'
                                      : 'gray.900'
                                  }
                                >
                                  {option.title}
                                </Text>
                                {option.badge && !isLoading && (
                                  <Badge
                                    colorScheme={option.badge.colorScheme}
                                    borderRadius="full"
                                  >
                                    {option.badge.text}
                                  </Badge>
                                )}
                              </Flex>
                              <Text
                                fontSize="sm"
                                color={
                                  option.disabled || isLoading
                                    ? 'gray.400'
                                    : 'gray.700'
                                }
                              >
                                {option.description}
                              </Text>
                              {option.subtext && (
                                <Text fontSize="xs" color="gray.500">
                                  {option.subtext}
                                </Text>
                              )}
                            </Flex>

                            <RadioCard.ItemIndicator />
                          </Flex>
                        </RadioCard.Item>
                      ))}
                    </Flex>
                  </RadioCard.Root>
                </Flex>
              </Flex>
            </DialogBody>

            <DialogFooter>
              <Button
                size="lg"
                colorScheme="blue"
                w="full"
                onClick={handleStartGame}
                disabled={!selectedMode || isLoading || isSelectedModeDisabled}
              >
                Start Practice
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
};
