'use client';

import { type ReactNode, useCallback, useEffect, useState } from 'react';

import { Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

import { AppHeader } from '@/components/app-header';
import { FlashCardsSettingsDialog } from '@/modules/flashcards/components/flash-cards-settings-dialog';

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
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  const [isFlashCardsDialogOpen, setIsFlashCardsDialogOpen] = useState(false);

  // Single toggle handler - the button visibility is controlled by CSS breakpoints
  const toggleSidebar = useCallback(() => {
    // Toggle desktop on desktop screens, mobile on mobile screens
    // The actual button shown is controlled by display: { base: 'block', md: 'none' }
    setIsDesktopSidebarOpen((prev) => !prev);
    setIsMobileSidebarOpen((prev) => !prev);
  }, []);

  const handleFlashCardsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFlashCardsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsFlashCardsDialogOpen(false);
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <>
      <Box h="100svh" overflow="hidden">
        <AppHeader onSidebarToggle={toggleSidebar} />

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

        <FlashCardsSettingsDialog
          isOpen={isFlashCardsDialogOpen}
          onClose={handleCloseDialog}
        />
      </Box>
    </>
  );
};
