'use client';

import { Center, Text, VStack } from '@chakra-ui/react';

export const EmailVerification = () => {
  return (
    <Center h="100svh">
      <VStack gap={4} maxW="lg" mx="auto" px={6} textAlign="center">
        <Text fontSize="3xl" fontWeight="bold" color="green.500">
          Check your email! 📧
        </Text>
        <Text fontSize="lg" color="gray.700" lineHeight="relaxed">
          Almost there! We&apos;ve sent a verification link to your email.
          Please check your inbox and click the link to activate your account
          and start your German learning journey.
        </Text>
        <Text fontSize="sm" color="gray.500" mt={2}>
          Don&apos;t see the email? Check your spam folder or try signing up
          again.
        </Text>
      </VStack>
    </Center>
  );
};
