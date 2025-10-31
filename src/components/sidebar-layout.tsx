'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { AppHeader } from '@/components/app-header';
import { GradientBackground } from '@/components/gradient-background';
import { useSidebar } from '@/contexts/sidebar-context';
import { FlashCardsSettingsDialog } from '@/modules/flash-cards-game/components/flash-cards-settings-dialog';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onFlashCardsClick?: (e: React.MouseEvent) => void;
}

const DesktopSidebar = dynamic<SidebarProps>(
  () =>
    import('@/components/desktop-sidebar').then((mod) => mod.DesktopSidebar),
  { ssr: false, loading: () => null },
);

const MobileSidebar = dynamic<SidebarProps>(
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

  const [isFlashCardsDialogOpen, setIsFlashCardsDialogOpen] = useState(false);

  const handleFlashCardsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFlashCardsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsFlashCardsDialogOpen(false);
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <GradientBackground variant="primary" data-debug="gradient-background">
      <Box h="100svh" overflow="hidden">
        <AppHeader onSidebarToggle={toggleSidebar} />

        <>
          <MobileSidebar
            isOpen={isMobileSidebarOpen}
            onToggle={toggleSidebar}
            onFlashCardsClick={handleFlashCardsClick}
          />
          <DesktopSidebar
            isOpen={isDesktopSidebarOpen}
            onToggle={toggleSidebar}
            onFlashCardsClick={handleFlashCardsClick}
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
          <Box
            h="full"
            overflow="auto"
            data-scroll-container="true"
            maxW="1256px"
            mx="auto"
          >
            {children}
          </Box>
          <InstallPrompt />
        </Box>
      </Box>
      <FlashCardsSettingsDialog
        isOpen={isFlashCardsDialogOpen}
        onClose={handleCloseDialog}
      />
    </GradientBackground>
  );
};
