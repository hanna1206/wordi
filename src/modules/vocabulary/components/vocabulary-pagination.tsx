import { Button, Flex, HStack, Text } from '@chakra-ui/react';

interface VocabularyPaginationProps {
  page: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const VocabularyPagination = ({
  page,
  totalPages,
  onPrevPage,
  onNextPage,
}: VocabularyPaginationProps) => {
  return (
    <Flex mt={6} justify="center">
      <HStack gap={2}>
        <Button
          onClick={onPrevPage}
          disabled={page === 0}
          colorPalette="blue"
          variant="ghost"
          size="sm"
        >
          ← Previous
        </Button>
        <Text fontSize="sm" color="fg.muted" px={4}>
          Page {page + 1} of {totalPages}
        </Text>
        <Button
          onClick={onNextPage}
          disabled={page + 1 >= totalPages}
          colorPalette="blue"
          variant="ghost"
          size="sm"
        >
          Next →
        </Button>
      </HStack>
    </Flex>
  );
};
