'use client';

import { LuPanelLeftClose, LuX } from 'react-icons/lu';

import { Box, Heading, IconButton, useBreakpointValue } from '@chakra-ui/react';

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
            h="100svh"
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
          display="flex"
          flexDirection="column"
        >
          <Box p={2} display="flex" justifyContent="flex-end" flexShrink={0}>
            <IconButton
              aria-label="Close sidebar"
              size="md"
              variant="ghost"
              onClick={onClose}
            >
              <LuX />
            </IconButton>
          </Box>
          <Box flex="1" overflow="hidden" display="flex" flexDirection="column">
            {children}
          </Box>
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
      h="100svh"
      w={isOpen ? '260px' : '57px'}
      bg={isOpen ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)'}
      backdropFilter="blur(10px)"
      borderRight="1px solid"
      borderColor="rgba(255, 255, 255, 0.2)"
      boxShadow={
        isOpen
          ? '0 8px 32px rgba(0, 0, 0, 0.1)'
          : '0 4px 12px rgba(0, 0, 0, 0.05)'
      }
      transition="all 0.3s ease"
      zIndex={isOpen ? 1001 : 100}
      display="flex"
      flexDirection="column"
    >
      <Heading
        position="absolute"
        top={4}
        left={6}
        fontSize="3xl"
        opacity={isOpen ? 1 : 0}
        transform={isOpen ? 'translateX(0)' : 'translateX(-12px)'}
        transition="opacity 0.2s ease, transform 0.2s ease"
        transitionDelay={isOpen ? '0.3s' : '0s'}
        pointerEvents="none"
      >
        Wordi
      </Heading>
      {/* Collapse/Expand Button */}
      <Box
        position="absolute"
        top={2}
        right={isOpen ? 2 : '50%'}
        transform={isOpen ? 'none' : 'translateX(50%)'}
        transition="all 0.3s ease"
        zIndex={1}
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
      <Box
        pt={16}
        flex="1"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        alignItems={isOpen ? 'flex-start' : 'center'}
      >
        <Box
          flex="1"
          overflow="hidden"
          display="flex"
          flexDirection="column"
          w="full"
          alignItems={isOpen ? 'flex-start' : 'center'}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
