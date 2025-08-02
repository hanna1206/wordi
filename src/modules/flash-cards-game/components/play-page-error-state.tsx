'use client';

import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';

interface PlayPageErrorStateProps {
  error: string;
}

export const PlayPageErrorState = ({ error }: PlayPageErrorStateProps) => {
  return (
    <Flex direction="column" h="100svh" align="center" justify="center" p={4}>
      <Heading as="h2" size="lg" color="red.500">
        Error
      </Heading>
      <Text mt={2}>{error}</Text>
      <Link href="/flash-cards-game" passHref>
        <Button as="a" mt={4} colorScheme="blue">
          Go Back
        </Button>
      </Link>
    </Flex>
  );
};
