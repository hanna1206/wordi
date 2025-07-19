'use client';

import { useState } from 'react';
import { LuAlignLeft, LuInfo, LuPanelLeft, LuPowerOff } from 'react-icons/lu';

import { Box, HStack, IconButton, useBreakpointValue } from '@chakra-ui/react';

import { logout } from '@/modules/auth/auth.actions';

import { AIInfoModal } from './ai-info-modal';

interface AppHeaderProps {
  onSidebarToggle?: () => void;
  showSidebarToggle?: boolean;
}

export const AppHeader = ({
  onSidebarToggle,
  showSidebarToggle = false,
}: AppHeaderProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [showAIInfoModal, setShowAIInfoModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      // Reset loading state if logout fails (though logout() usually redirects)
      setIsLoggingOut(false);
      // eslint-disable-next-line no-console
      console.error('Logout error:', error);
    }
  };

  const handleShowAIInfo = () => {
    setShowAIInfoModal(true);
  };

  const handleCloseAIInfo = () => {
    setShowAIInfoModal(false);
  };

  return (
    <>
      <Box
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={showSidebarToggle ? 1000 : 100}
        p={{ base: 4, md: 2 }}
      >
        <HStack justify="space-between" w="full">
          {/* Left side - Sidebar toggle (only show if prop is true) */}
          <Box>
            {showSidebarToggle && onSidebarToggle && (
              <IconButton
                aria-label="Toggle sidebar"
                variant="ghost"
                size="md"
                onClick={onSidebarToggle}
              >
                {isMobile ? (
                  <LuAlignLeft size={16} />
                ) : (
                  <LuPanelLeft size={16} />
                )}
              </IconButton>
            )}
          </Box>

          {/* Right side - Help and Logout */}
          <HStack gap={1}>
            <IconButton
              aria-label="Help - About AI"
              variant="ghost"
              size="sm"
              onClick={handleShowAIInfo}
            >
              <LuInfo size={16} />
            </IconButton>
            <IconButton
              aria-label="Logout"
              variant="subtle"
              size="sm"
              onClick={handleLogout}
              loading={isLoggingOut}
              disabled={isLoggingOut}
            >
              <LuPowerOff size={16} />
            </IconButton>
          </HStack>
        </HStack>
      </Box>

      <AIInfoModal
        isOpen={showAIInfoModal}
        onClose={handleCloseAIInfo}
        title="AI Information"
        showContinueButton={false}
      />
    </>
  );
};
