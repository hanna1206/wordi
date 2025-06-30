import { Card, Text, VStack } from '@chakra-ui/react';

import { getCurrentUser } from '../user.actions';

export const UserProfile = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Card.Root>
        <Card.Body>
          <Text>User not found</Text>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>User profile</Card.Title>
      </Card.Header>
      <Card.Body>
        <VStack align="start" gap={2}>
          <Text>
            <strong>ID:</strong> {user.id}
          </Text>
          <Text>
            <strong>Email:</strong> {user.email}
          </Text>
          <Text>
            <strong>Created:</strong>{' '}
            {new Date(user.created_at).toLocaleDateString()}
          </Text>
          <Text>
            <strong>Updated:</strong>{' '}
            {new Date(user.updated_at).toLocaleDateString()}
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
