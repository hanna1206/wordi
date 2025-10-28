import { Badge, Box, Flex, Heading, Text } from '@chakra-ui/react';

interface VocabularyPageHeaderProps {
  total: number;
}

export const VocabularyPageHeader = ({ total }: VocabularyPageHeaderProps) => {
  return (
    <Box mb={8}>
      <Flex align="center" gap={4} mb={4}>
        <Heading
          size="2xl"
          fontWeight="bold"
          bgGradient="to-r"
          gradientFrom="blue.500"
          gradientTo="purple.500"
          bgClip="text"
          flex="1"
        >
          Vocabulary
        </Heading>
        <Badge
          size="lg"
          colorPalette="purple"
          variant="solid"
          px={3}
          py={1}
          borderRadius="full"
        >
          {total} {total === 1 ? 'word' : 'words'}
        </Badge>
      </Flex>
      <Text color="fg.muted" fontSize="lg" ml={{ base: 0, md: 14 }}>
        Track and review all the words you&apos;ve learned
      </Text>
    </Box>
  );
};
