import { Card, Center } from '@chakra-ui/react';

import { LoginForm } from '@/modules/auth/components/login-form';

export const LoginPage = () => (
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
        <Card.Title>Sign up</Card.Title>
        <Card.Description>
          Fill in the form below to log in to your account
        </Card.Description>
      </Card.Header>
      <LoginForm />
    </Card.Root>
  </Center>
);
