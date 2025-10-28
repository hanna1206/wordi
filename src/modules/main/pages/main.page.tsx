'use client';

import { Center, Container } from '@chakra-ui/react';

import { SidebarLayout } from '@/components/sidebar-layout';
import { GenerateLinguisticItemForm } from '@/modules/linguistics/components/generate-linguistic-item-form';

export const MainPage = () => {
  return (
    <SidebarLayout>
      <Center h="full">
        <Container maxW="4xl" w="full">
          <GenerateLinguisticItemForm />
        </Container>
      </Center>
    </SidebarLayout>
  );
};
