'use client';

import { useState } from 'react';

import { Card, Center } from '@chakra-ui/react';

import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';

type AuthMode = 'login' | 'signup';

export const AuthSwitcher = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const isLogin = mode === 'login';

  const handleSwitchToSignup = () => setMode('signup');
  const handleSwitchToLogin = () => setMode('login');

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
          <Card.Title>{isLogin ? 'Sign in' : 'Create account'}</Card.Title>
          <Card.Description>
            {isLogin
              ? 'Fill in the form below to log in to your account'
              : 'Fill in the form below to create your new account'}
          </Card.Description>
        </Card.Header>

        {isLogin ? (
          <LoginForm onSwitchToSignup={handleSwitchToSignup} />
        ) : (
          <SignupForm onSwitchToLogin={handleSwitchToLogin} />
        )}
      </Card.Root>
    </Center>
  );
};
