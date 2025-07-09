'use client';

import { Button, Card, Center, HStack, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';

import { ForgotPasswordForm } from '../components/forgot-password-form';

export const ForgotPasswordPage = () => {
  return (
    <Center h="100dvh">
      <VStack gap={6} maxW="md" mx="auto" mt={10}>
        <VStack gap={1} textAlign="center">
          <Text fontSize="2xl" fontWeight="bold">
            Forgot Password
          </Text>
          <Text color="gray.600" fontSize="sm">
            Enter your email to get a password reset link
          </Text>
        </VStack>

        <Card.Root w="full" p={6} variant="elevated" boxShadow="lg">
          <ForgotPasswordForm />
        </Card.Root>

        <HStack justifyContent="center">
          <Text fontSize="0.875em" color="gray.600">
            Remember your password?
          </Text>
          <Link href="/login">
            <Button
              type="button"
              variant="plain"
              color="primary"
              fontSize="0.875em"
              w="min-content"
              px={0}
              _hover={{ textDecoration: 'underline' }}
            >
              Log in
            </Button>
          </Link>
        </HStack>
      </VStack>
    </Center>
  );
};
