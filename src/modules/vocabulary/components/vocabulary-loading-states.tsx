import { Box, Flex, Spinner, Text } from '@chakra-ui/react';

export const VocabularyInitialLoader = () => (
  <Flex align="center" justify="center" minH="60vh">
    <Spinner size="lg" colorPalette="blue" />
  </Flex>
);

export const VocabularyError = ({ error }: { error: string }) => (
  <Flex align="center" justify="center" minH="60vh">
    <Text color="red.500">{error}</Text>
  </Flex>
);

export const VocabularyLoadMoreSpinner = () => (
  <Flex justify="center" py={4}>
    <Spinner size="md" colorPalette="blue" />
  </Flex>
);

export const VocabularyEndMessage = () => (
  <Flex justify="center" py={4}>
    <Text fontSize="sm" color="fg.muted">
      You have reached the end of your vocabulary.
    </Text>
  </Flex>
);

export const VocabularyWordLoadingOverlay = () => (
  <Flex
    position="fixed"
    top={0}
    left={0}
    right={0}
    bottom={0}
    bg="blackAlpha.300"
    align="center"
    justify="center"
    zIndex={9999}
  >
    <Spinner size="xl" colorPalette="blue" />
  </Flex>
);

export const VocabularyScrollSentinel = ({
  sentinelRef,
}: {
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}) => <Box ref={sentinelRef} w="full" h="1px" />;
