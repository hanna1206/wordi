import { Button, Card, Flex, HStack, Text } from '@chakra-ui/react';

import { PAGE_SIZE_OPTIONS } from '../vocabulary.const';

interface VocabularyPageControlsProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export const VocabularyPageControls = ({
  pageSize,
  onPageSizeChange,
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
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};
