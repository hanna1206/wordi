'use client';

import { LuPanelLeftClose, LuX } from 'react-icons/lu';

import { Box, IconButton, useBreakpointValue, VStack } from '@chakra-ui/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  children?: React.ReactNode;
}

export const Sidebar = ({
  isOpen,
  onClose,
  onToggle,
  children,
}: SidebarProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Mobile version - overlay sidebar
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <Box
            position="fixed"
            top={0}
            left={0}
            w="100vw"
            h="100vh"
            bg="blackAlpha.400"
            zIndex={998}
            onClick={onClose}
          />
        )}

        {/* Mobile Sidebar */}
        <Box
          position="fixed"
          left={0}
          top={0}
          h="100vh"
          w="280px"
          borderRight="1px"
          borderColor="gray.200"
          transform={isOpen ? 'translateX(0)' : 'translateX(-100%)'}
          transition="transform 0.3s ease"
          zIndex={1001}
          bg="white"
        >
          <Box p={4} display="flex" justifyContent="flex-end">
            <IconButton
              aria-label="Close sidebar"
              size="md"
              variant="ghost"
              onClick={onClose}
            >
              <LuX />
            </IconButton>
          </Box>
          <Box p={4}>{children}</Box>
        </Box>
      </>
    );
  }

  // Desktop version - fixed sidebar
  return (
    <Box
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      w={isOpen ? '280px' : '60px'}
      bg={isOpen ? 'gray.50' : 'white'}
      borderRight="1px solid"
      borderColor="gray.100"
      transition="width 0.3s ease"
      zIndex={isOpen ? 1001 : 100}
      _dark={{
        bg: 'gray.900',
        borderColor: 'gray.600',
      }}
    >
      {/* Collapse/Expand Button */}
      <Box
        position="absolute"
        top={2}
        right={isOpen ? 2 : '50%'}
        transform={isOpen ? 'none' : 'translateX(50%)'}
        transition="all 0.3s ease"
      >
        <IconButton
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          size="md"
          variant="ghost"
          onClick={onToggle}
        >
          {isOpen && <LuPanelLeftClose />}
        </IconButton>
      </Box>

      {/* Sidebar Content */}
      <VStack
        pt={16}
        px={isOpen ? 4 : 2}
        gap={4}
        align="stretch"
        h="full"
        overflow="hidden"
      >
        {isOpen && children}
        {!isOpen && (
          <Box textAlign="center" opacity={0.6}>
            {/* Collapsed state - could show icons only */}
          </Box>
        )}
      </VStack>
    </Box>
  );
};
