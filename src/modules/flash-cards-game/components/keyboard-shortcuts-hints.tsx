'use client';

import { Flex, HStack, Kbd, Text } from '@chakra-ui/react';

export const KeyboardShortcutsHints = () => {
  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      justify="center"
      align="center"
      gap={6}
      color="gray.600"
      fontSize="sm"
      mb={2}
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
