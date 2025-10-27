import { Badge, Card, Flex, Table, Text } from '@chakra-ui/react';

import type { MinimalVocabularyWord } from '../vocabulary.types';

interface VocabularyTableProps {
  items: MinimalVocabularyWord[];
  onWordClick: (normalizedWord: string, partOfSpeech: string) => void;
}

export const VocabularyTable = ({
  items,
  onWordClick,
}: VocabularyTableProps) => {
  return (
    <Card.Root borderWidth="1px" shadow="sm" overflow="hidden">
      <Table.Root size="lg" variant="line" striped>
        <Table.Header bg="bg.muted">
          <Table.Row>
            <Table.ColumnHeader
              fontWeight="semibold"
              fontSize="sm"
              textTransform="uppercase"
              letterSpacing="wide"
              color="fg.muted"
            >
              Word
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontWeight="semibold"
              fontSize="sm"
              textTransform="uppercase"
              letterSpacing="wide"
              color="fg.muted"
            >
              Part of Speech
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontWeight="semibold"
              fontSize="sm"
              textTransform="uppercase"
              letterSpacing="wide"
              color="fg.muted"
            >
              Translation
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={3}>
                <Flex justify="center" py={8}>
                  <Text color="fg.muted" fontSize="lg">
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
                _hover={{ bg: 'bg.muted' }}
                transition="background 0.2s"
              >
                <Table.Cell fontWeight="medium" fontSize="md">
                  {item.normalizedWord}
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    colorPalette="teal"
                    variant="subtle"
                    textTransform="capitalize"
                    size="sm"
                  >
                    {item.partOfSpeech}
                  </Badge>
                </Table.Cell>
                <Table.Cell color="fg.muted">
                  {item.commonData?.mainTranslation || '-'}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Card.Root>
  );
};
