'use client';

import { useState } from 'react';

import {
  Badge,
  Button,
  CheckboxCard,
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
  Grid,
  Portal,
  SegmentGroup,
  Spinner,
  Text,
} from '@chakra-ui/react';

import type { CollectionWithCount } from '@/modules/collection/collections.types';
import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import type {
  VisibilityFilter,
  VocabularyTypeFilter,
} from '@/modules/vocabulary/vocabulary.types';
import { ALL_PARTS_OF_SPEECH } from '@/modules/vocabulary/vocabulary.types';

interface VocabularyFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  visibilityFilter: VisibilityFilter;
  selectedPartsOfSpeech: PartOfSpeech[];
  typeFilter: VocabularyTypeFilter;
  selectedCollectionIds: string[];
  collections: CollectionWithCount[];
  isLoadingCollections: boolean;
  onApply: (
    visibility: VisibilityFilter,
    partsOfSpeech: PartOfSpeech[],
    typeFilter: VocabularyTypeFilter,
    collectionIds: string[],
  ) => void;
}

export const VocabularyFilterDialog = ({
  isOpen,
  onClose,
  visibilityFilter,
  selectedPartsOfSpeech,
  typeFilter,
  selectedCollectionIds,
  collections,
  isLoadingCollections,
  onApply,
}: VocabularyFilterDialogProps) => {
  const [localVisibilityFilter, setLocalVisibilityFilter] =
    useState<VisibilityFilter>(visibilityFilter);
  const [localSelectedPartsOfSpeech, setLocalSelectedPartsOfSpeech] = useState<
    PartOfSpeech[]
  >(selectedPartsOfSpeech);
  const [localTypeFilter, setLocalTypeFilter] =
    useState<VocabularyTypeFilter>(typeFilter);
  const [localSelectedCollectionIds, setLocalSelectedCollectionIds] = useState<
    string[]
  >(selectedCollectionIds);

  // No auto-initialization - start with empty selection (show all items)

  // Reset local state when dialog opens
  const handleOpenChange = (details: { open: boolean }) => {
    if (details.open) {
      setLocalVisibilityFilter(visibilityFilter);
      setLocalSelectedPartsOfSpeech(selectedPartsOfSpeech);
      setLocalTypeFilter(typeFilter);
      setLocalSelectedCollectionIds(selectedCollectionIds);
    } else {
      onClose();
    }
  };

  const handleApply = () => {
    onApply(
      localVisibilityFilter,
      localSelectedPartsOfSpeech,
      localTypeFilter,
      localSelectedCollectionIds,
    );
    onClose();
  };

  const handleCollectionToggle = (collectionId: string) => {
    setLocalSelectedCollectionIds((prev) => {
      if (prev.includes(collectionId)) {
        return prev.filter((id) => id !== collectionId);
      } else {
        return [...prev, collectionId];
      }
    });
  };

  const handleCancel = () => {
    onClose();
  };

  const handlePartOfSpeechToggle = (partOfSpeech: PartOfSpeech) => {
    setLocalSelectedPartsOfSpeech((prev) => {
      if (prev.includes(partOfSpeech)) {
        // Remove if already selected
        return prev.filter((pos) => pos !== partOfSpeech);
      } else {
        // Add if not selected
        return [...prev, partOfSpeech];
      }
    });
  };

  // Helper to format part of speech labels
  const formatPartOfSpeechLabel = (partOfSpeech: PartOfSpeech): string => {
    // Capitalize first letter of each word
    return partOfSpeech
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={handleOpenChange}
      size={{ mdDown: 'full', md: 'md' }}
    >
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent borderRadius={{ base: 0, md: 'lg' }} overflowY="auto">
            <DialogHeader>
              <DialogTitle>Filter Vocabulary</DialogTitle>
              <DialogCloseTrigger />
            </DialogHeader>

            <DialogBody py={{ base: 4, md: 3 }}>
              <Flex direction="column" gap={{ base: 4, md: 3 }}>
                {/* Collection Filter Section */}
                <Flex direction="column" gap={2}>
                  <Text fontWeight="medium" fontSize="sm">
                    Collection
                  </Text>
                  {isLoadingCollections ? (
                    <Flex justify="center" py={2}>
                      <Spinner size="sm" />
                    </Flex>
                  ) : (
                    <Grid
                      templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }}
                      gap={2}
                    >
                      {collections.map((collection) => (
                        <CheckboxCard.Root
                          key={collection.id}
                          checked={localSelectedCollectionIds.includes(
                            collection.id,
                          )}
                          onCheckedChange={() =>
                            handleCollectionToggle(collection.id)
                          }
                        >
                          <CheckboxCard.HiddenInput />
                          <CheckboxCard.Control>
                            <Flex
                              direction="row"
                              alignItems="center"
                              gap={2}
                              w="full"
                            >
                              <Text fontSize="sm" fontWeight="medium">
                                {collection.name}
                              </Text>
                              <Badge
                                colorScheme="gray"
                                variant="subtle"
                                fontSize="xs"
                              >
                                {collection.itemCount}
                              </Badge>
                            </Flex>
                            <CheckboxCard.Indicator />
                          </CheckboxCard.Control>
                        </CheckboxCard.Root>
                      ))}
                    </Grid>
                  )}
                </Flex>

                {/* Type Filter Section */}
                <Flex direction="column" gap={1.5} alignItems="flex-start">
                  <Text fontWeight="medium" fontSize="sm">
                    Type
                  </Text>
                  <SegmentGroup.Root
                    value={localTypeFilter}
                    onValueChange={(e) =>
                      setLocalTypeFilter(e.value as VocabularyTypeFilter)
                    }
                    size="sm"
                  >
                    <SegmentGroup.Indicator bg="white" />
                    <SegmentGroup.Item value="all">
                      <SegmentGroup.ItemText>All</SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                    <SegmentGroup.Item value="words-only">
                      <SegmentGroup.ItemText>Words Only</SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                    <SegmentGroup.Item value="collocations-only">
                      <SegmentGroup.ItemText>
                        Collocations Only
                      </SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                  </SegmentGroup.Root>
                </Flex>

                {/* Visibility Filter Section */}
                <Flex direction="column" gap={1.5} alignItems="flex-start">
                  <Text fontWeight="medium" fontSize="sm">
                    Visibility
                  </Text>
                  <SegmentGroup.Root
                    value={localVisibilityFilter}
                    onValueChange={(e) =>
                      setLocalVisibilityFilter(e.value as VisibilityFilter)
                    }
                    size="sm"
                  >
                    <SegmentGroup.Indicator bg="white" />
                    <SegmentGroup.Item value="any">
                      <SegmentGroup.ItemText>Any</SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                    <SegmentGroup.Item value="hidden-only">
                      <SegmentGroup.ItemText>Hidden only</SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                    <SegmentGroup.Item value="visible-only">
                      <SegmentGroup.ItemText>
                        Visible only
                      </SegmentGroup.ItemText>
                      <SegmentGroup.ItemHiddenInput />
                    </SegmentGroup.Item>
                  </SegmentGroup.Root>
                </Flex>

                {/* Part of Speech Filter Section */}
                <Flex direction="column" gap={1.5} mt={2}>
                  <Text fontWeight="medium" fontSize="sm">
                    Part of Speech
                  </Text>
                  <Grid
                    templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }}
                    gap={2}
                  >
                    {ALL_PARTS_OF_SPEECH.map((partOfSpeech) => (
                      <CheckboxCard.Root
                        key={partOfSpeech}
                        checked={localSelectedPartsOfSpeech.includes(
                          partOfSpeech,
                        )}
                        onCheckedChange={() =>
                          handlePartOfSpeechToggle(partOfSpeech)
                        }
                      >
                        <CheckboxCard.HiddenInput />
                        <CheckboxCard.Control>
                          <Flex
                            direction="column"
                            alignItems="flex-start"
                            gap={0.5}
                            w="full"
                          >
                            <Text fontSize="sm" fontWeight="medium">
                              {formatPartOfSpeechLabel(partOfSpeech)}
                            </Text>
                          </Flex>
                          <CheckboxCard.Indicator />
                        </CheckboxCard.Control>
                      </CheckboxCard.Root>
                    ))}
                  </Grid>
                </Flex>
              </Flex>
            </DialogBody>

            <DialogFooter pt={3} gap={2}>
              <Button variant="outline" onClick={handleCancel} size="md">
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleApply} size="md">
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
};
