import { Center, Container } from '@chakra-ui/react';

import { AppHeader } from '@/components/app-header';
import { GenerateWordForm } from '@/modules/words-generation/components/generate-word-form';

export const GenerateWordPage = () => (
  <>
    <AppHeader />
    <Center h="100dvh" bg="white" _dark={{ bg: 'gray.900' }}>
      <Container maxW="4xl" w="full">
        <GenerateWordForm />
      </Container>
    </Center>
  </>
);
