import { LuEyeOff } from 'react-icons/lu';

import {
  Badge,
  Box,
  Card,
  Flex,
  Icon,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react';

import { Tooltip } from '@/components/tooltip';

import type { MinimalVocabularyWord } from '../vocabulary.types';
import { VocabularyActionMenu } from './vocabulary-action-menu';

interface VocabularyTableProps {
  items: MinimalVocabularyWord[];
  onWordClick: (normalizedWord: string, partOfSpeech: string) => void;
  onToggleHidden: (wordId: string, isHidden: boolean) => void;
}

export const VocabularyTable = ({
  items,
  onWordClick,
  onToggleHidden,
}: VocabularyTableProps) => {
  return (
    <>
      {/* Mobile Card Layout */}
      <Box display={{ base: 'block', md: 'none' }}>
        {items.length === 0 ? (
          <Flex justify="center" py={6}>
            <Text color="fg.muted" fontSize="sm">
              No words found. Start learning to build your vocabulary!
            </Text>
          </Flex>
        ) : (
          <Stack gap={2}>
            {items.map((item) => (
              <Card.Root
                key={`${item.normalizedWord}-${item.partOfSpeech}`}
                borderWidth="1px"
                shadow="sm"
                cursor="pointer"
                transition="background 0.2s"
                onClick={() =>
                  onWordClick(item.normalizedWord, item.partOfSpeech)
                }
              >
                <Card.Body py={2} px={3}>
                  <Flex align="center" justify="space-between" mb={1}>
                    <Flex align="center" gap={1.5}>
                      <Text fontWeight="semibold" fontSize="md">
                        {item.normalizedWord}
                      </Text>
                      {item.isHidden && (
                        <Tooltip content="Hidden word">
                          <Icon as={LuEyeOff} color="fg.muted" fontSize="sm" />
                        </Tooltip>
                      )}
                      <Badge
                        colorPalette="teal"
                        variant="subtle"
                        textTransform="capitalize"
                        size="xs"
                      >
                        {item.partOfSpeech}
                      </Badge>
                    </Flex>
                    <VocabularyActionMenu
                      isHidden={item.isHidden}
                      onToggleHidden={() =>
                        onToggleHidden(item.id, !item.isHidden)
                      }
                    />
                  </Flex>
                  <Text color="fg.muted" fontSize="sm">
                    {item.commonData?.mainTranslation || '-'}
                  </Text>
                </Card.Body>
              </Card.Root>
            ))}
          </Stack>
        )}
      </Box>

      {/* Desktop Table Layout */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Card.Root borderWidth="1px" shadow="sm" overflow="hidden">
          <Table.Root size="sm" variant="outline">
            <Table.Header bg="bg.muted">
              <Table.Row>
                <Table.ColumnHeader
                  fontWeight="semibold"
                  fontSize="xs"
                  color="fg.muted"
                >
                  Word
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  fontWeight="semibold"
                  fontSize="xs"
                  color="fg.muted"
                >
                  Part of Speech
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  fontWeight="semibold"
                  fontSize="xs"
                  color="fg.muted"
                >
                  Translation
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  fontWeight="semibold"
                  fontSize="xs"
                  color="fg.muted"
                  width="60px"
                >
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={4}>
                    <Flex justify="center" py={6}>
                      <Text color="fg.muted" fontSize="sm">
                        No words found. Start learning to build your vocabulary!
                      </Text>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : (
                items.map((item) => (
                  <Table.Row
                    key={`${item.normalizedWord}-${item.partOfSpeech}`}
                    onClick={() =>
                      onWordClick(item.normalizedWord, item.partOfSpeech)
                    }
                    cursor="pointer"
                    transition="background 0.2s"
                  >
                    <Table.Cell fontWeight="medium" fontSize="sm">
                      <Flex align="center" gap={1.5}>
                        {item.normalizedWord}
                        {item.isHidden && (
                          <Tooltip content="Hidden word">
                            <Icon
                              as={LuEyeOff}
                              color="fg.muted"
                              fontSize="sm"
                            />
                          </Tooltip>
                        )}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorPalette="teal"
                        variant="subtle"
                        textTransform="capitalize"
                        size="xs"
                      >
                        {item.partOfSpeech}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell color="fg.muted" fontSize="sm">
                      {item.commonData?.mainTranslation || '-'}
                    </Table.Cell>
                    <Table.Cell>
                      <VocabularyActionMenu
                        isHidden={item.isHidden}
                        onToggleHidden={() =>
                          onToggleHidden(item.id, !item.isHidden)
                        }
                      />
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      </Box>
    </>
  );
};
