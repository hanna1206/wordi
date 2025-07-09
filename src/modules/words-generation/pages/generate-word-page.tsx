'use client';

import { useState } from 'react';

import { Box, Center, Container, Text } from '@chakra-ui/react';

import { AppHeader } from '@/components/app-header';
import { Sidebar } from '@/components/sidebar';
import { GenerateWordForm } from '@/modules/words-generation/components/generate-word-form';

export const GenerateWordPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

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
        {/* Sidebar content */}
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Navigation
        </Text>
        <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
          Sidebar content will go here
        </Text>
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
