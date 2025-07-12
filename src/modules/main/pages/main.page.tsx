'use client';

import { useEffect, useState } from 'react';

import { Box, Center, Container } from '@chakra-ui/react';

import { AppHeader } from '@/components/app-header';
import { Sidebar } from '@/components/sidebar';
import { SidebarContent } from '@/modules/main/components/sidebar-content';
import { GenerateWordForm } from '@/modules/words-generation/components/generate-word-form';
import { getUserWords } from '@/modules/words-persistence/words-persistence.actions';
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

  // Load user's saved words when component mounts
  const loadUserWords = async () => {
    try {
      setIsLoadingWords(true);
      const result = await getUserWords();

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
    <>
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
        />
      </Sidebar>

      <Box
        ml={{ base: 0, md: isSidebarOpen ? '280px' : '60px' }}
        transition="margin-left 0.3s ease"
        pt="72px" // Account for fixed header
      >
        <Center h="calc(100dvh - 72px)" bg="white" _dark={{ bg: 'gray.900' }}>
          <Container maxW="4xl" w="full">
            <GenerateWordForm />
          </Container>
        </Center>
      </Box>
    </>
  );
};
