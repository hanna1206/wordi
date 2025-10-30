'use client';

import { type ReactNode, useEffect } from 'react';

import { Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { AppHeader } from '@/components/app-header';
import { GradientBackground } from '@/components/gradient-background';
import { useSidebar } from '@/contexts/sidebar-context';

const DesktopSidebar = dynamic<{ isOpen: boolean; onToggle: () => void }>(
  () =>
    import('@/components/desktop-sidebar').then((mod) => mod.DesktopSidebar),
  { ssr: false, loading: () => null },
);

const MobileSidebar = dynamic<{ isOpen: boolean; onToggle: () => void }>(
  () => import('@/components/mobile-sidebar').then((mod) => mod.MobileSidebar),
  { ssr: false, loading: () => null },
);

const InstallPrompt = dynamic(
  () => import('@/components/install-prompt').then((mod) => mod.InstallPrompt),
  { ssr: false, loading: () => null },
);

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
