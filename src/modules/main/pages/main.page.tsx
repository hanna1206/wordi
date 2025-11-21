import { Center, Container } from '@chakra-ui/react';

import { GenerateLinguisticItemForm } from '@/modules/linguistics/components/generate-linguistic-item-form';

export const MainPage = () => {
  return (
    <Center h="full">
      <Container maxW="4xl" w="full">
        <GenerateLinguisticItemForm />
      </Container>
    </Center>
  );
};
