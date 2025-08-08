'use client';

import { useEffect, useState } from 'react';

import { Box, Center, Container } from '@chakra-ui/react';

import { AppHeader } from '@/components/app-header';
import { GradientBackground } from '@/components/gradient-background';
import { InstallPrompt } from '@/components/install-prompt';
import { Sidebar } from '@/components/sidebar';
import { SidebarContent } from '@/modules/main/components/sidebar-content';
import { GenerateWordForm } from '@/modules/words-generation/components/generate-word-form';
import { fetchUserSavedWords } from '@/modules/words-persistence/words-persistence.actions';
import type { SavedWord } from '@/modules/words-persistence/words-persistence.types';

export const MainPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [isLoadingWords, setIsLoadingWords] = useState(true);

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

  // Load user's saved words when component mounts
  const loadUserWords = async () => {
    try {
      setIsLoadingWords(true);
      const result = await fetchUserSavedWords();

      if (result.success && result.data) {
        setSavedWords(result.data);
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to load user words:', result.error);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading user words:', error);
    } finally {
      setIsLoadingWords(false);
    }
  };

  useEffect(() => {
    loadUserWords();
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
          <SidebarContent
            savedWords={savedWords}
            isLoadingWords={isLoadingWords}
            onWordDeleted={loadUserWords}
          />
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
                <GenerateWordForm onWordSaved={loadUserWords} />
              </Container>
            </Center>
          </Box>
          <InstallPrompt />
        </Box>
      </Box>
    </GradientBackground>
  );
};
