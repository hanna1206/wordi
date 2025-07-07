import { Center, Container } from '@chakra-ui/react';

import { AppHeader } from '@/components/app-header';
import { CreateWordForm } from '@/modules/words/components/create-word-form';

export const CreateWordPage = () => (
  <>
    <AppHeader />
    <Center h="100vh" bg="white" _dark={{ bg: 'gray.900' }}>
      <Container maxW="4xl" w="full">
        <CreateWordForm />
      </Container>
    </Center>
  </>
);
