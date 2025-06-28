import {
  Button,
  Card,
  Field,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';

import { login, signup } from '@/modules/auth/auth.actions';

export const LoginForm = () => (
  <form>
    <Card.Body>
      <VStack gap="4" w="full">
        <Field.Root>
          <Field.Label htmlFor="email">Email:</Field.Label>
          <Input id="email" name="email" type="email" required />
        </Field.Root>
        <Field.Root>
          <Field.Label htmlFor="password">Password:</Field.Label>
          <Input id="password" name="password" type="password" required />
        </Field.Root>
      </VStack>
    </Card.Body>
    <Card.Footer pt={4}>
      <VStack w="full" justifyContent="space-between" gap={4}>
        <Button formAction={login} type="submit" bg="primary" w="full">
          Log in
        </Button>
        <HStack w="full" justifyContent="center">
          <Text fontSize="0.875em">Don&apos;t have an account?</Text>
          <Button
            formAction={signup}
            type="submit"
            variant="plain"
            color="primary"
            fontSize="0.875em"
            w="min-content"
            px={0}
            _hover={{ textDecoration: 'underline' }}
          >
            Sign up
          </Button>
        </HStack>
      </VStack>
    </Card.Footer>
  </form>
);
