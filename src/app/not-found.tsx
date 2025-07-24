'use client';

import { LuHouse } from 'react-icons/lu';

import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <Container maxW="2xl" py={{ base: 16, md: 24 }}>
      <VStack align="center" gap={{ base: 8, md: 12 }} textAlign="center">
        {/* 404 Header */}
        <VStack gap={4}>
          <Heading
            fontSize={{ base: '6xl', md: '8xl' }}
            fontWeight="700"
            color="gray.800"
            lineHeight="1"
          >
            404
          </Heading>
          <Heading
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="600"
            color="gray.700"
          >
            Page Not Found
          </Heading>
        </VStack>

        {/* Description */}
        <VStack gap={4} maxW="md">
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="gray.600"
            lineHeight="1.6"
          >
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved, deleted, or you entered the wrong URL.
          </Text>
        </VStack>

        {/* Action Buttons */}
        <HStack gap={4} flexWrap="wrap" justify="center">
          <Link href="/">
            <Button
              size={{ base: 'md', md: 'lg' }}
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
              }}
              transition="all 0.2s"
              display="flex"
              alignItems="center"
              gap={2}
              variant="solid"
            >
              <LuHouse size={18} />
              Go Home
            </Button>
          </Link>
        </HStack>

        {/* Help Text */}
        <Text fontSize="sm" color="gray.500" mt={8}>
          If you think this is a mistake, please contact our support team.
        </Text>
      </VStack>
    </Container>
  );
};

export default NotFoundPage;
