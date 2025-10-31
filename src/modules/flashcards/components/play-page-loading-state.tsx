'use client';

import { Flex, Spinner, Text } from '@chakra-ui/react';

export const PlayPageLoadingState = () => {
  return (
    <Flex direction="column" h="100svh" align="center" justify="center" p={4}>
      <Spinner size="xl" />
      <Text mt={4}>Loading your words...</Text>
    </Flex>
  );
};
