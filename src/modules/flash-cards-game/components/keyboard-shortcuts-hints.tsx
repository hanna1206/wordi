'use client';

import { Flex, HStack, Kbd, Text, useMediaQuery } from '@chakra-ui/react';

export const KeyboardShortcutsHints = () => {
  const [isDesktopWidth] = useMediaQuery(['(min-width: 992px)']);
  const [hasFinePointer] = useMediaQuery([
    '(hover: hover) and (pointer: fine)',
  ]);

  if (!isDesktopWidth || !hasFinePointer) {
    return null;
  }

  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      justify="center"
      align="center"
      gap={6}
      color="gray.600"
      fontSize="sm"
      mt={4}
    >
      <HStack gap={2}>
        <Text fontWeight="600">Flip:</Text>
        <HStack gap={1}>
          <Kbd>Space</Kbd>
          <Text>/</Text>
          <Kbd>Enter</Kbd>
          <Text>/</Text>
          <Kbd>↑</Kbd>
          <Text>/</Text>
          <Kbd>↓</Kbd>
        </HStack>
      </HStack>
      <HStack gap={2}>
        <Text fontWeight="600">Rate:</Text>
        <HStack gap={1}>
          <Kbd>1</Kbd>
          <Text>= Hard</Text>
          <Text>·</Text>
          <Kbd>2</Kbd>
          <Text>= Good</Text>
          <Text>·</Text>
          <Kbd>3</Kbd>
          <Text>= Easy</Text>
        </HStack>
      </HStack>
      <HStack gap={2}>
        <Text fontWeight="600">Next:</Text>
        <Kbd>→</Kbd>
        <Text>(Good)</Text>
      </HStack>
    </Flex>
  );
};
