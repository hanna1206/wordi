import { Card, Center, Text } from '@chakra-ui/react';

export const HomePage = () => {
  return (
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
  );
};
