'use client';

import { Card, Center, Text, VStack } from '@chakra-ui/react';

import { CookieConsent } from '@/components/cookie-consent';
import { GradientBackground } from '@/components/gradient-background';

import { ResetPasswordForm } from '../components/reset-password-form';

export const ResetPasswordPage = () => {
  return (
    <GradientBackground variant="primary">
      <Center h="100svh">
        <VStack gap={6} maxW="md" mx="auto" mt={10}>
          <VStack gap={1} textAlign="center">
            <Text fontSize="2xl" fontWeight="bold">
              Reset Your Password
            </Text>
            <Text color="gray.600" fontSize="sm">
              Enter and confirm your new password below.
            </Text>
          </VStack>

          <Card.Root w="full" p={6} variant="elevated" boxShadow="lg">
            <ResetPasswordForm />
          </Card.Root>
        </VStack>
      </Center>
      <CookieConsent />
    </GradientBackground>
  );
};
