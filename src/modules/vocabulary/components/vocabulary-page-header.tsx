import { Box, Flex, Heading, Text } from '@chakra-ui/react';

export const VocabularyPageHeader = () => {
  return (
    <Box mb={8}>
      <Flex align="center" gap={4} mb={4}>
        <Heading size="2xl" fontWeight="bold" flex="1">
          Vocabulary
        </Heading>
      </Flex>
      <Text color="fg.muted" fontSize="md">
        Track and review all the words you&apos;ve learned
      </Text>
    </Box>
  );
};
