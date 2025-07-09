'use client';

import { LuAlignLeft, LuPanelLeft, LuPowerOff } from 'react-icons/lu';

import { Box, HStack, IconButton, useBreakpointValue } from '@chakra-ui/react';

import { logout } from '@/modules/auth/auth.actions';

interface AppHeaderProps {
  onSidebarToggle?: () => void;
  showSidebarToggle?: boolean;
}

export const AppHeader = ({
  onSidebarToggle,
  showSidebarToggle = false,
}: AppHeaderProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={showSidebarToggle ? 1000 : 100}
      p={{ base: 4, md: 2 }}
    >
      <HStack justify="space-between" w="full">
        {/* Left side - Sidebar toggle (only show if prop is true) */}
        <Box>
          {showSidebarToggle && onSidebarToggle && (
            <IconButton
              aria-label="Toggle sidebar"
              variant="ghost"
              size="md"
              onClick={onSidebarToggle}
            >
              {isMobile ? <LuAlignLeft size={16} /> : <LuPanelLeft size={16} />}
            </IconButton>
          )}
        </Box>

        {/* Right side - Logout */}
        <Box>
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
        </Box>
      </HStack>
    </Box>
  );
};
