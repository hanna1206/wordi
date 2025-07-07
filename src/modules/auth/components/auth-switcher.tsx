'use client';

import { useState } from 'react';

import { Button, Card, Center, HStack, Text, VStack } from '@chakra-ui/react';

import { EmailVerification } from './email-verification';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';

type AuthMode = 'login' | 'signup' | 'verification';

export const AuthSwitcher = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const isLogin = mode === 'login';
  const isVerification = mode === 'verification';

  const handleSwitchToSignup = () => setMode('signup');
  const handleSwitchToLogin = () => setMode('login');
  const handleShowVerification = () => setMode('verification');

  // Show email verification screen
  if (isVerification) {
    return <EmailVerification />;
  }

  return (
    <Center h="100vh">
      <VStack gap={6} maxW="md" mx="auto" mt={10}>
        {/* Title and Description outside the card */}
        <VStack gap={1} textAlign="center">
          <Text fontSize="2xl" fontWeight="bold">
            {isLogin ? 'Sign in' : 'Create account'}
          </Text>
          <Text color="gray.600" fontSize="sm">
            {isLogin
              ? 'Fill in the form below to log in to your account'
              : 'Fill in the form below to create your new account'}
          </Text>
        </VStack>

        {/* Card with only form content */}
        <Card.Root w="full" p={6} variant="elevated" boxShadow="lg">
          {isLogin ? (
            <LoginForm />
          ) : (
            <SignupForm onVerificationNeeded={handleShowVerification} />
          )}
        </Card.Root>

        {/* Form switching outside the card */}
        <HStack justifyContent="center">
          <Text fontSize="0.875em" color="gray.600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </Text>
          <Button
            type="button"
            variant="plain"
            color="primary"
            fontSize="0.875em"
            w="min-content"
            px={0}
            _hover={{ textDecoration: 'underline' }}
            onClick={isLogin ? handleSwitchToSignup : handleSwitchToLogin}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </Button>
        </HStack>
      </VStack>
    </Center>
  );
};
