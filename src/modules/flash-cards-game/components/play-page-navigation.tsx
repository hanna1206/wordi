'use client';

import { FaArrowLeft, FaTimes } from 'react-icons/fa';

import { Flex, IconButton, Text } from '@chakra-ui/react';
import Link from 'next/link';

interface PlayPageNavigationProps {
  currentIndex: number;
  totalCount: number;
}

export const PlayPageNavigation = ({
  currentIndex,
  totalCount,
}: PlayPageNavigationProps) => {
  return (
    <Flex align="center" justify="space-between" mb={4}>
      <IconButton
        asChild
        aria-label="Back to game selection"
        variant="ghost"
        size="lg"
      >
        <Link href="/flash-cards-game">
          <FaArrowLeft />
        </Link>
      </IconButton>
      <Text fontSize="sm" color="gray.500">
        {currentIndex + 1} / {totalCount}
      </Text>
      <IconButton asChild aria-label="Back to home" variant="ghost" size="lg">
        <Link href="/">
          <FaTimes />
        </Link>
      </IconButton>
    </Flex>
  );
};
