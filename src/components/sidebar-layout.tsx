'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { Box } from '@chakra-ui/react';

import { AppHeader } from '@/components/app-header';
import { GradientBackground } from '@/components/gradient-background';
import { InstallPrompt } from '@/components/install-prompt';
import { useSidebar } from '@/contexts/sidebar-context';

import { DesktopSidebar } from './desktop-sidebar';
import { MobileSidebar } from './mobile-sidebar';

interface SidebarLayoutProps {
  children: ReactNode;
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const { isDesktopSidebarOpen, isMobileSidebarOpen, toggleSidebar } =
    useSidebar();

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
        <AppHeader onSidebarToggle={toggleSidebar} />

        <>
          <MobileSidebar
            isOpen={isMobileSidebarOpen}
            onToggle={toggleSidebar}
          />
          <DesktopSidebar
            isOpen={isDesktopSidebarOpen}
            onToggle={toggleSidebar}
          />
        </>

        <Box
          ml={{ base: 0, md: isDesktopSidebarOpen ? '280px' : '60px' }}
          transition="margin-left 0.3s ease"
          h="100svh"
          pt="72px"
          overflow="hidden"
          position="relative"
        >
          <Box h="full" overflow="auto" data-scroll-container="true">
            {children}
          </Box>
          <InstallPrompt />
        </Box>
      </Box>
    </GradientBackground>
  );
};
