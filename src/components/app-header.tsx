'use client';

import { LuPowerOff } from 'react-icons/lu';

import { Box, HStack, IconButton } from '@chakra-ui/react';

import { logout } from '@/modules/auth/auth.actions';

export const AppHeader = () => {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box as="header" position="fixed" top={0} right={0} zIndex={1000} p={4}>
      <HStack>
        <IconButton
          aria-label="Logout"
          variant="outline"
          size="sm"
          onClick={handleLogout}
          bg="white"
          borderColor="gray.300"
          _hover={{
            bg: 'red.50',
            borderColor: 'red.300',
            color: 'red.600',
          }}
          _dark={{
            bg: 'gray.800',
            borderColor: 'gray.600',
            _hover: {
              bg: 'red.900',
              borderColor: 'red.600',
              color: 'red.300',
            },
          }}
        >
          <LuPowerOff size={16} />
        </IconButton>
      </HStack>
    </Box>
  );
};
