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
      bgColor="#fcfcfc"
      backdropFilter="blur(10px)"
      borderRight="1px solid"
      borderColor="gray.200"
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
        <IconButton size="md" variant="ghost" onClick={onToggle} mr={2}>
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
