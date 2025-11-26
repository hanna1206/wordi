import { Center, Container } from '@chakra-ui/react';

import { getUserCollections } from '@/modules/collection/collections.actions';
import type { CollectionWithCount } from '@/modules/collection/collections.types';
import { GenerateLinguisticItemForm } from '@/modules/linguistics/components/generate-linguistic-item-form';

export const MainPage = async () => {
  let collections: CollectionWithCount[] = [];
  const collectionsResult = await getUserCollections();

  if (collectionsResult.success && collectionsResult.data) {
    collections = collectionsResult.data;
  }

  return (
    <Center h="full">
      <Container maxW="4xl" w="full">
        <GenerateLinguisticItemForm collections={collections} />
      </Container>
    </Center>
  );
};
