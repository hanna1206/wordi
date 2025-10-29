'use client';

import { LuX } from 'react-icons/lu';

import { Box, IconButton } from '@chakra-ui/react';

import { SidebarContent } from './sidebar-content';

interface MobileSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export const MobileSidebar = ({ isOpen, onToggle }: MobileSidebarProps) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100svh"
          bg="blackAlpha.400"
          zIndex={998}
          onClick={onToggle}
          display={{ base: 'block', md: 'none' }}
        />
      )}

      {/* Mobile Sidebar */}
      <Box
        position="fixed"
        left={0}
        top={0}
        h="100svh"
        w="280px"
        borderRight="1px solid"
        borderColor="white/20"
        transform={isOpen ? 'translateX(0)' : 'translateX(-100%)'}
        transition="transform 0.3s ease"
        zIndex={1001}
        bg="rgba(255, 255, 255, 0.95)"
        backdropFilter="blur(10px)"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
        display={{ base: 'flex', md: 'none' }}
        flexDirection="column"
      >
        <Box p={2} display="flex" justifyContent="flex-end" flexShrink={0}>
          <IconButton
            aria-label="Close sidebar"
            size="md"
            variant="ghost"
            onClick={onToggle}
          >
            <LuX />
          </IconButton>
        </Box>
        <Box flex="1" overflow="hidden" display="flex" flexDirection="column">
          <SidebarContent isSidebarOpen={isOpen} />
        </Box>
      </Box>
    </>
  );
};
