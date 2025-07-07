import { Card, Container, Text, VStack } from '@chakra-ui/react';

import { AppHeader } from '@/components/app-header';
import { getAuthenticatedUser } from '@/modules/auth/auth.service';

import { getUserSettings } from '../user-settings.service';

export const UserSettings = async () => {
  const { user } = await getAuthenticatedUser();

  if (!user) {
    return (
      <>
        <AppHeader />
        <Container maxW="4xl" py={8}>
          <Card.Root>
            <Card.Body>
              <Text>User not found</Text>
            </Card.Body>
          </Card.Root>
        </Container>
      </>
    );
  }

  const { data: userSettings } = await getUserSettings(user.id);

  if (!userSettings) {
    return (
      <>
        <AppHeader />
        <Container maxW="4xl" py={8}>
          <Card.Root>
            <Card.Body>
              <Text>User settings not found</Text>
            </Card.Body>
          </Card.Root>
        </Container>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <Container maxW="4xl" py={8}>
        <Card.Root>
          <Card.Header>
            <Card.Title>User settings</Card.Title>
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
                {new Date(userSettings.updated_at).toLocaleDateString()}
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Container>
    </>
  );
};
