'use client';

import { Suspense } from 'react';

import { Button, Card, Center, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const ErrorContent = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Sorry, something went wrong';

  return (
    <Center h="100dvh">
      <Card.Root
        maxW="md"
        mx="auto"
        mt={10}
        p={6}
        variant="elevated"
        boxShadow="lg"
      >
        <Card.Header gap={1}>
          <Card.Title color="red.500">Error</Card.Title>
        </Card.Header>
        <Card.Body>
          <VStack gap={4}>
            <Text textAlign="center">{message}</Text>
            <Link href="/login">
              <Button variant="outline" w="full">
                Go back to login
              </Button>
            </Link>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Center>
  );
};

const ErrorPage = () => {
  return (
    <Suspense
      fallback={
        <Center h="100dvh">
          <Card.Root
            maxW="md"
            mx="auto"
            mt={10}
            p={6}
            variant="elevated"
            boxShadow="lg"
          >
            <Card.Header gap={1}>
              <Card.Title color="red.500">Error</Card.Title>
            </Card.Header>
            <Card.Body>
              <VStack gap={4}>
                <Text textAlign="center">Loading...</Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        </Center>
      }
    >
      <ErrorContent />
    </Suspense>
  );
};

export default ErrorPage;
