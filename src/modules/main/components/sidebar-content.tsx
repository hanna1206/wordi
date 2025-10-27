import { LuBrain, LuLibrary } from 'react-icons/lu';

import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';

export const SidebarContent = () => (
  <>
    <Box
      pt={2}
      pb={8}
      pl={4}
      flex="1"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <Flex direction="column">
        <Link href="/vocabulary">
          <Button variant="ghost" width="250px" p={2} justifyContent="start">
            <Flex justifyContent="start" align="center" gap={2}>
              <LuLibrary />
              <Text>All saved words</Text>
            </Flex>
          </Button>
        </Link>
        <Link href="/flash-cards-game">
          <Button variant="ghost" width="250px" p={2} justifyContent="start">
            <Flex justifyContent="start" align="center" gap={2}>
              <LuBrain />
              <Text>Practice with Flash Cards</Text>
            </Flex>
          </Button>
        </Link>
      </Flex>
    </Box>
  </>
);
