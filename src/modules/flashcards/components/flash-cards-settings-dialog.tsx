'use client';

import { useEffect, useMemo, useState } from 'react';
import type { IconType } from 'react-icons';
import { FaBrain, FaRandom, FaRegClock } from 'react-icons/fa';

import {
  Badge,
  Button,
  createListCollection,
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
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { getUserCollections } from '@/modules/collection/collections.actions';
import type { CollectionWithCount } from '@/modules/collection/collections.types';
import { useDueWordsCount } from '@/modules/flashcards/context/due-words-count-context';

import { getDueWordsCount } from '../flashcards.actions';
import { CardSide, GameMode } from '../flashcards.const';

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
  const { dueCount, totalWords, isDueCountLoading } = useDueWordsCount();
  const [cardSide, setCardSide] = useState<string | null>(CardSide.Word);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [collectionDueCount, setCollectionDueCount] = useState<number | null>(
    null,
  );
  const [isLoadingCollectionCount, setIsLoadingCollectionCount] =
    useState(false);

  // Load collections when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoadingCollections(true);
      getUserCollections()
        .then((result) => {
          if (result.success && result.data) {
            setCollections(result.data);
          }
        })
        .finally(() => {
          setIsLoadingCollections(false);
        });
    }
  }, [isOpen]);

  // Update due count when collection changes
  useEffect(() => {
    if (selectedCollectionId) {
      setIsLoadingCollectionCount(true);
      getDueWordsCount({ collectionId: selectedCollectionId })
        .then((result) => {
          if (result.success && result.data) {
            setCollectionDueCount(result.data.dueCount);
          }
        })
        .finally(() => {
          setIsLoadingCollectionCount(false);
        });
    } else {
      setCollectionDueCount(null);
    }
  }, [selectedCollectionId]);

  const effectiveDueCount =
    selectedCollectionId !== null ? (collectionDueCount ?? 0) : dueCount;
  const effectiveIsDueCountLoading =
    selectedCollectionId !== null
      ? isLoadingCollectionCount
      : isDueCountLoading;

  const gameModeOptions = useMemo<GameModeOption[]>(() => {
    const dailyReviewDescription =
      effectiveDueCount > 0
        ? `Review ${effectiveDueCount} words using spaced repetition algorithm.`
        : totalWords > 0
          ? "Great! No words due for review today. You're all caught up!"
          : 'Start learning words to see them here for review.';

    return [
      {
        id: 'daily-review',
        mode: GameMode.DueReview,
        limit: effectiveDueCount > 0 ? effectiveDueCount : 10,
        icon: FaBrain,
        title: 'Daily Review',
        description: dailyReviewDescription,
        disabled: effectiveDueCount === 0,
        badge: effectiveIsDueCountLoading
          ? undefined
          : {
              text: `${effectiveDueCount} due`,
              colorScheme: effectiveDueCount > 0 ? 'orange' : 'green',
            },
      },
      {
        id: 'latest-10',
        mode: GameMode.Latest,
        limit: 10,
        icon: FaRegClock,
        title: 'Practice 10 Latest Words',
        description: "Review the most recent words you've saved.",
      },
      {
        id: 'latest-20',
        mode: GameMode.Latest,
        limit: 20,
        icon: FaRegClock,
        title: 'Practice 20 Latest Words',
        description: 'A longer session with your newest words.',
      },
      {
        id: 'random-10',
        mode: GameMode.Random,
        limit: 10,
        icon: FaRandom,
        title: 'Practice 10 Random Words',
        description: 'Shuffle your saved words for a surprise review.',
      },
      {
        id: 'random-20',
        mode: GameMode.Random,
        limit: 20,
        icon: FaRandom,
        title: 'Practice 20 Random Words',
        description: 'A bigger random set for a more robust practice.',
      },
    ];
  }, [effectiveDueCount, totalWords, effectiveIsDueCountLoading]);

  const isSelectedModeDisabled = useMemo(() => {
    if (!selectedMode) return false;
    const selectedOption = gameModeOptions.find(
      (option) => option.id === selectedMode,
    );
    return selectedOption?.disabled ?? false;
  }, [selectedMode, gameModeOptions]);

  const handleOpenChange = (details: { open: boolean }) => {
    if (!details.open) {
      onClose();
      setSelectedMode(null);
      setIsStarting(false);
      setSelectedCollectionId(null);
      setCollectionDueCount(null);
    }
  };

  const handleStartGame = () => {
    if (!selectedMode) return;

    const selectedOption = gameModeOptions.find(
      (option) => option.id === selectedMode,
    );

    if (!selectedOption) return;

    // Show loading state
    setIsStarting(true);

    // Build URL with optional collectionId
    const params = new URLSearchParams({
      mode: selectedOption.mode,
      limit: selectedOption.limit.toString(),
      cardSide: cardSide || CardSide.Word,
    });

    if (selectedCollectionId) {
      params.set('collectionId', selectedCollectionId);
    }

    // Navigate to game
    router.push(`/flashcards?${params.toString()}`);
  };

  const collectionOptions = useMemo(() => {
    const items = [
      { label: 'All Collections', value: '' },
      ...collections.map((c) => ({
        label: `${c.name} (${c.itemCount})`,
        value: c.id,
      })),
    ];
    return createListCollection({ items });
  }, [collections]);

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={handleOpenChange}
      size={{ mdDown: 'full', md: 'lg' }}
    >
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent borderRadius={{ base: 0, md: 'lg' }} overflowY="auto">
            <DialogHeader>
              <DialogTitle>Flashcards Settings</DialogTitle>
              <DialogCloseTrigger />
            </DialogHeader>

            <DialogBody py={{ base: 4, md: 3 }}>
              <Flex direction="column" gap={{ base: 4, md: 3 }}>
                {/* Collection Filter */}
                <Flex direction="column" gap={1.5} alignItems="flex-start">
                  <Text fontWeight="medium" fontSize="sm">
                    Collection
                  </Text>
                  <SelectRoot
                    collection={collectionOptions}
                    value={selectedCollectionId ? [selectedCollectionId] : ['']}
                    onValueChange={(e) =>
                      setSelectedCollectionId(e.value[0] || null)
                    }
                    size="sm"
                    disabled={isLoadingCollections}
                    width="full"
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="All Collections" />
                    </SelectTrigger>
                    <SelectContent>
                      {collectionOptions.items.map((item) => (
                        <SelectItem key={item.value} item={item}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </Flex>

                {/* Card Side Selector */}
                <Flex direction="column" gap={1.5} alignItems="flex-start">
                  <Text fontWeight="medium" fontSize="sm">
                    Card Side
                  </Text>
                  <SegmentGroup.Root
                    value={cardSide}
                    onValueChange={(e) => setCardSide(e.value)}
                    size="sm"
                  >
                    <SegmentGroup.Indicator bg="white" />
                    <SegmentGroup.Item value={CardSide.Word}>
                      <SegmentGroup.ItemText>German Word</SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                    <SegmentGroup.Item value={CardSide.Translation}>
                      <SegmentGroup.ItemText>Translation</SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                  </SegmentGroup.Root>
                </Flex>

                {/* Game Mode Options */}
                <Flex direction="column" gap={1.5} mt={2}>
                  <Text fontWeight="medium" fontSize="sm">
                    Game Mode
                  </Text>
                  <RadioCard.Root
                    value={selectedMode}
                    onValueChange={(e) => setSelectedMode(e.value)}
                  >
                    <Flex direction="column" gap={2}>
                      {gameModeOptions.map((option) => (
                        <RadioCard.Item
                          key={option.id}
                          value={option.id}
                          disabled={option.disabled || isDueCountLoading}
                          p={3}
                        >
                          <RadioCard.ItemHiddenInput />
                          <Flex
                            justifyContent="flex-start"
                            gap={2.5}
                            w="full"
                            alignItems="center"
                          >
                            {/* Icon container */}
                            <Flex
                              align="center"
                              justify="center"
                              boxSize={8}
                              borderRadius="full"
                              border="1px solid"
                              flexShrink={0}
                            >
                              {isDueCountLoading &&
                              option.id === 'daily-review' ? (
                                <Spinner size="xs" />
                              ) : (
                                <Icon as={option.icon} boxSize={4} />
                              )}
                            </Flex>

                            {/* Content */}
                            <Flex
                              direction="column"
                              gap={0.5}
                              flex={1}
                              minW={0}
                            >
                              <Flex align="center" gap={2} flexWrap="wrap">
                                <Text
                                  fontSize="sm"
                                  fontWeight="semibold"
                                  color={
                                    option.disabled || isDueCountLoading
                                      ? 'gray.500'
                                      : 'gray.900'
                                  }
                                >
                                  {option.title}
                                </Text>
                                {option.badge && !isDueCountLoading && (
                                  <Badge
                                    colorScheme={option.badge.colorScheme}
                                    borderRadius="full"
                                    size="sm"
                                  >
                                    {option.badge.text}
                                  </Badge>
                                )}
                              </Flex>
                              <Text
                                fontSize="xs"
                                color={
                                  option.disabled || isDueCountLoading
                                    ? 'gray.400'
                                    : 'gray.600'
                                }
                              >
                                {option.description}
                              </Text>
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

            <DialogFooter pt={3} gap={2}>
              <Button size="md" flex={1} variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                size="md"
                flex={1}
                onClick={handleStartGame}
                disabled={
                  !selectedMode ||
                  effectiveIsDueCountLoading ||
                  isSelectedModeDisabled ||
                  isStarting
                }
                loading={isStarting}
              >
                {isStarting ? 'Loading...' : 'Start Practice'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
};
