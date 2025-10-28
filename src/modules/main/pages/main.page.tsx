'use client';

import { useEffect, useState } from 'react';

import { Box, Center, Container } from '@chakra-ui/react';

import { AppHeader } from '@/components/app-header';
import { GradientBackground } from '@/components/gradient-background';
import { InstallPrompt } from '@/components/install-prompt';
import { Sidebar } from '@/components/sidebar';
import { SidebarContent } from '@/components/sidebar-content';
import { GenerateLinguisticItemForm } from '@/modules/linguistics/components/generate-linguistic-item-form';

export const MainPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  // Prevent page scroll when this component is mounted
  useEffect(() => {
    // Store original overflow value
    const originalOverflow = document.body.style.overflow;

    // Prevent page scroll
    document.body.style.overflow = 'hidden';

    // Restore original overflow when component unmounts
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <GradientBackground variant="primary">
      <Box h="100svh" overflow="hidden">
        <AppHeader
          onSidebarToggle={handleSidebarToggle}
          showSidebarToggle={true}
        />

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
          <Box h="full" overflow="auto">
            <Center h="full">
              <Container maxW="4xl" w="full">
                <GenerateLinguisticItemForm />
              </Container>
            </Center>
          </Box>
          <InstallPrompt />
        </Box>
      </Box>
    </GradientBackground>
  );
};
