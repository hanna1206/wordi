'use client';

import { FiBook, FiClock, FiTarget, FiTrendingUp, FiX } from 'react-icons/fi';

import {
  Badge,
  Box,
  Button,
  Card,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  Grid,
  HStack,
  Separator,
  Text,
  VStack,
} from '@chakra-ui/react';

import {
  PART_OF_SPEECH_LABELS,
  WORD_STATUS_CONFIG,
} from '../words-management.const';
import type { WordWithProgress } from '../words-management.types';

interface WordDetailModalProps {
  word: WordWithProgress | null;
  isOpen: boolean;
  onClose: () => void;
  onArchive: (word: WordWithProgress) => void;
  onStatusChange: (
    word: WordWithProgress,
    newStatus: WordWithProgress['status'],
  ) => void;
}

export const WordDetailModal = ({
  word,
  isOpen,
  onClose,
  onArchive,
  onStatusChange,
}: WordDetailModalProps) => {
  if (!word) return null;

  const statusConfig = WORD_STATUS_CONFIG[word.status];
  const partOfSpeechLabel =
    PART_OF_SPEECH_LABELS[
      word.partOfSpeech as keyof typeof PART_OF_SPEECH_LABELS
    ] || word.partOfSpeech;

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <DialogBackdrop />
      <DialogContent maxWidth="800px" maxHeight="90vh">
        <DialogHeader>
          <HStack justify="space-between" width="100%">
            <VStack align="start" gap={1}>
              <Text fontSize="2xl" fontWeight="bold">
                {word.normalizedWord}
              </Text>
              <HStack gap={2}>
                <Badge colorPalette="gray" variant="subtle">
                  {partOfSpeechLabel}
                </Badge>
                <Badge colorPalette={statusConfig.color} variant="subtle">
                  {statusConfig.label}
                </Badge>
                {word.isArchived && (
                  <Badge colorPalette="orange" variant="subtle">
                    Archived
                  </Badge>
                )}
              </HStack>
            </VStack>
            <Button variant="ghost" onClick={onClose}>
              <FiX />
            </Button>
          </HStack>
        </DialogHeader>

        <DialogBody>
          <VStack align="stretch" gap={6}>
            {/* Translation Section */}
            <Card.Root>
              <Card.Body>
                <VStack align="stretch" gap={3}>
                  <Text fontSize="lg" fontWeight="semibold">
                    Translation
                  </Text>
                  <Text fontSize="xl" color="blue.600">
                    {word.mainTranslation}
                  </Text>
                  {word.additionalTranslations.length > 0 && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        Additional translations:
                      </Text>
                      <Text color="gray.700">
                        {word.additionalTranslations.join(', ')}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Example Sentences */}
            {word.exampleSentences.length > 0 && (
              <Card.Root>
                <Card.Body>
                  <VStack align="stretch" gap={3}>
                    <Text fontSize="lg" fontWeight="semibold">
                      Example Sentences
                    </Text>
                    {word.exampleSentences.map((sentence, index) => (
                      <Box key={index} p={3} bg="gray.50" borderRadius="md">
                        <Text>{sentence}</Text>
                      </Box>
                    ))}
                  </VStack>
                </Card.Body>
              </Card.Root>
            )}

            {/* Synonyms */}
            {word.synonyms.length > 0 && (
              <Card.Root>
                <Card.Body>
                  <VStack align="stretch" gap={3}>
                    <Text fontSize="lg" fontWeight="semibold">
                      Synonyms
                    </Text>
                    <Text>{word.synonyms.join(', ')}</Text>
                  </VStack>
                </Card.Body>
              </Card.Root>
            )}

            {/* Collocations */}
            {word.collocations.length > 0 && (
              <Card.Root>
                <Card.Body>
                  <VStack align="stretch" gap={3}>
                    <Text fontSize="lg" fontWeight="semibold">
                      Common Collocations
                    </Text>
                    <Grid
                      templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                      gap={3}
                    >
                      {word.collocations.map((collocation, index) => (
                        <Box key={index} p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="medium">
                            {collocation.collocation}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {collocation.translation}
                          </Text>
                        </Box>
                      ))}
                    </Grid>
                  </VStack>
                </Card.Body>
              </Card.Root>
            )}

            {/* Learning Progress */}
            <Card.Root>
              <Card.Body>
                <VStack align="stretch" gap={4}>
                  <Text fontSize="lg" fontWeight="semibold">
                    Learning Progress
                  </Text>

                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <VStack align="start" gap={2}>
                      <HStack gap={2}>
                        <FiTarget color="var(--chakra-colors-blue-500)" />
                        <Text fontWeight="medium">Success Rate</Text>
                      </HStack>
                      <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                        {word.successRate.toFixed(0)}%
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {word.correctReviews} of {word.totalReviews} reviews
                        correct
                      </Text>
                    </VStack>

                    <VStack align="start" gap={2}>
                      <HStack gap={2}>
                        <FiTrendingUp color="var(--chakra-colors-green-500)" />
                        <Text fontWeight="medium">Difficulty</Text>
                      </HStack>
                      <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color={
                          word.easinessFactor < 2
                            ? 'red.600'
                            : word.easinessFactor < 2.5
                              ? 'orange.600'
                              : 'green.600'
                        }
                      >
                        {word.easinessFactor.toFixed(2)}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Easiness factor
                      </Text>
                    </VStack>

                    <VStack align="start" gap={2}>
                      <HStack gap={2}>
                        <FiClock color="var(--chakra-colors-purple-500)" />
                        <Text fontWeight="medium">Review Interval</Text>
                      </HStack>
                      <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                        {word.intervalDays}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Days between reviews
                      </Text>
                    </VStack>

                    <VStack align="start" gap={2}>
                      <HStack gap={2}>
                        <FiBook color="var(--chakra-colors-orange-500)" />
                        <Text fontWeight="medium">Repetitions</Text>
                      </HStack>
                      <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                        {word.repetitionCount}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Total repetitions
                      </Text>
                    </VStack>
                  </Grid>

                  {word.nextReviewDate && (
                    <Box p={3} bg="blue.50" borderRadius="md">
                      <Text fontSize="sm" color="blue.700">
                        <strong>Next review:</strong>{' '}
                        {new Date(word.nextReviewDate).toLocaleDateString()}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </Card.Body>
            </Card.Root>

            <Separator />

            {/* Action Buttons */}
            <HStack justify="space-between">
              <HStack gap={2}>
                <Button
                  colorPalette={word.isArchived ? 'green' : 'orange'}
                  variant="outline"
                  onClick={() => onArchive(word)}
                >
                  {word.isArchived ? 'Unarchive' : 'Archive'}
                </Button>
              </HStack>

              <HStack gap={2}>
                {Object.entries(WORD_STATUS_CONFIG).map(([status, config]) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={word.status === status ? 'solid' : 'outline'}
                    colorPalette={config.color}
                    onClick={() =>
                      onStatusChange(word, status as WordWithProgress['status'])
                    }
                  >
                    {config.label}
                  </Button>
                ))}
              </HStack>
            </HStack>
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
