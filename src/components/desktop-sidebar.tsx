'use client';

import { LuPanelLeftClose } from 'react-icons/lu';

import { Box, Heading, IconButton } from '@chakra-ui/react';

import { SidebarContent } from './sidebar-content';

interface DesktopSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  onFlashCardsClick?: (e: React.MouseEvent) => void;
}

export const DesktopSidebar = ({
  isOpen,
  onToggle,
  onFlashCardsClick,
}: DesktopSidebarProps) => {
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
      display={{ base: 'none', md: 'flex' }}
      flexDirection="column"
    >
      <Heading
        position="absolute"
        top={4}
        left={4}
        fontSize="3xl"
        opacity={isOpen ? 1 : 0}
        transform={isOpen ? 'translateX(0)' : 'translateX(-12px)'}
        transition="opacity 0.2s ease, transform 0.2s ease"
        transitionDelay={isOpen ? '0.3s' : '0s'}
        pointerEvents="none"
      >
        Wordi
      </Heading>

      {/* Collapse Button */}
      <Box
        position="absolute"
        top={2}
        right={0}
        opacity={isOpen ? 1 : 0}
        pointerEvents={isOpen ? 'auto' : 'none'}
        transition="opacity 0.3s ease"
        zIndex={1}
      >
        <IconButton size="md" variant="ghost" onClick={onToggle}>
          <LuPanelLeftClose />
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
          <SidebarContent
            isSidebarOpen={isOpen}
            onFlashCardsClick={onFlashCardsClick}
          />
        </Box>
      </Box>
    </Box>
  );
};
