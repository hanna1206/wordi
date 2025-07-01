import { LuPower } from 'react-icons/lu';

import { Box, Card, Center, IconButton, Text } from '@chakra-ui/react';

import { logout } from '@/modules/auth/auth.actions';

export const HomePage = () => {
  return (
    <Box h="100vh" position="relative">
      {/* Logout button in top right corner of the page */}
      <form action={logout}>
        <IconButton
          type="submit"
          aria-label="Logout"
          variant="ghost"
          size="md"
          position="absolute"
          top={4}
          right={4}
          color="gray.500"
          _hover={{
            color: 'red.500',
            bg: 'red.50',
          }}
          zIndex={10}
        >
          <LuPower />
        </IconButton>
      </form>

      <Center h="100vh">
        <Card.Root
          maxW="md"
          mx="auto"
          mt={10}
          p={6}
          variant="elevated"
          boxShadow="lg"
        >
          <Card.Header gap={1}>
            <Card.Title>Welcome to Wordi</Card.Title>
          </Card.Header>
          <Card.Body>
            <Text>Explore the features and functionalities of Wordi.</Text>
          </Card.Body>
        </Card.Root>
      </Center>
    </Box>
  );
};
