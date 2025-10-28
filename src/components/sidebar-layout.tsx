'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { Box, type BoxProps } from '@chakra-ui/react';

import { AppHeader } from '@/components/app-header';
import { GradientBackground } from '@/components/gradient-background';
import { InstallPrompt } from '@/components/install-prompt';
import { Sidebar } from '@/components/sidebar';
import { SidebarContent } from '@/components/sidebar-content';

interface SidebarLayoutProps {
  children: ReactNode;
  /**
   * Optional props for the scrollable content container. Useful for adding paddings or spacing.
   */
  contentProps?: BoxProps;
}

export const SidebarLayout = ({
  children,
  contentProps,
}: SidebarLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <GradientBackground variant="primary">
      <Box h="100svh" overflow="hidden">
        <AppHeader onSidebarToggle={handleSidebarToggle} showSidebarToggle />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          onToggle={handleSidebarToggle}
        >
          <SidebarContent />
        </Sidebar>

        <Box
          ml={{ base: 0, md: isSidebarOpen ? '280px' : '60px' }}
          transition="margin-left 0.3s ease"
          h="100svh"
          pt="72px"
          overflow="hidden"
          position="relative"
        >
          <Box h="full" overflow="auto" {...contentProps}>
            {children}
          </Box>
          <InstallPrompt />
        </Box>
      </Box>
    </GradientBackground>
  );
};
