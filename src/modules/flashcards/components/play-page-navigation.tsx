'use client';

import { FaTimes } from 'react-icons/fa';

import { Box, Button, Flex, HStack, IconButton } from '@chakra-ui/react';
import Link from 'next/link';

interface PlayPageNavigationProps {
  currentIndex: number;
  totalCount: number;
  onUndo?: () => void;
  canUndo?: boolean;
  onClose?: () => void;
}

export const PlayPageNavigation = ({
  currentIndex,
  totalCount,
  onUndo,
  canUndo = false,
  onClose,
}: PlayPageNavigationProps) => {
  const progress = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;

  return (
    <Box mb={4}>
      <Flex
        align="center"
        justify="flex-end"
        mb={2}
        gap={2}
        position="relative"
      >
        {/* <Text
          position="absolute"
          fontSize="sm"
          color="gray.600"
          minW="72px"
          textAlign="center"
        >
          {currentIndex + 1} / {totalCount}
        </Text> */}

        <HStack gap={2}>
          {onUndo && (
            <Button
              onClick={onUndo}
              size="sm"
              variant="outline"
              disabled={!canUndo}
            >
              Undo
            </Button>
          )}
          <IconButton
            asChild
            aria-label="Back to home"
            variant="ghost"
            size="lg"
            onClick={onClose}
          >
            <Link href="/">
              <FaTimes />
            </Link>
          </IconButton>
        </HStack>
      </Flex>

      {/* Thin progress bar */}
      <Box
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        h="1px"
        w="full"
        bg="gray.200"
        borderRadius="full"
        overflow="hidden"
      >
        <Box h="full" w={`${progress}%`} />
      </Box>
    </Box>
  );
};
