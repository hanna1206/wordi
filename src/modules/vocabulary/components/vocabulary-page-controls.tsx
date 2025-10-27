import { Button, Card, Flex, HStack, Text } from '@chakra-ui/react';

import { PAGE_SIZE_OPTIONS } from '../vocabulary.const';

interface VocabularyPageControlsProps {
  page: number;
  pageSize: number;
  totalPages: number;
  onPageSizeChange: (size: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const VocabularyPageControls = ({
  page,
  pageSize,
  totalPages,
  onPageSizeChange,
  onPrevPage,
  onNextPage,
}: VocabularyPageControlsProps) => {
  return (
    <Card.Root mb={6} borderWidth="1px" shadow="sm">
      <Card.Body>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={4}
          align={{ base: 'stretch', md: 'center' }}
          justify="space-between"
        >
          {/* Items per page selector */}
          <Flex align="center" gap={3} flexWrap="wrap">
            <Text fontWeight="medium" color="fg.muted" whiteSpace="nowrap">
              Items per page:
            </Text>
            <HStack gap={2}>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <Button
                  key={size}
                  size="sm"
                  variant={pageSize === size ? 'solid' : 'outline'}
                  colorPalette={pageSize === size ? 'blue' : 'gray'}
                  onClick={() => onPageSizeChange(size)}
                  minW="50px"
                >
                  {size}
                </Button>
              ))}
            </HStack>
          </Flex>

          {/* Page info and navigation */}
          <Flex
            align="center"
            gap={4}
            justify={{ base: 'space-between', md: 'flex-end' }}
          >
            <Text
              fontWeight="medium"
              color="fg.muted"
              fontSize="sm"
              whiteSpace="nowrap"
            >
              Page {page + 1} of {totalPages}
            </Text>
            <HStack gap={2}>
              <Button
                onClick={onPrevPage}
                disabled={page === 0}
                colorPalette="blue"
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={onNextPage}
                disabled={page + 1 >= totalPages}
                colorPalette="blue"
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </HStack>
          </Flex>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};
