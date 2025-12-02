import { Suspense } from 'react';

import { Center, Container, Spinner } from '@chakra-ui/react';

import { getUserCollections } from '@/modules/collection/collections.actions';
import type { CollectionWithCount } from '@/modules/collection/collections.types';
import { GenerateLinguisticItemForm } from '@/modules/linguistics/components/generate-linguistic-item-form';

const MainPageContent = async () => {
  let collections: CollectionWithCount[] = [];
  const collectionsResult = await getUserCollections();

  if (collectionsResult.success && collectionsResult.data) {
    collections = collectionsResult.data;
  }

  return <GenerateLinguisticItemForm collections={collections} />;
};

export const MainPage = () => {
  return (
    <Center h="full">
      <Container maxW="4xl" w="full">
        <Suspense
          fallback={
            <Center h="200px">
              <Spinner size="xl" />
            </Center>
          }
        >
          <MainPageContent />
        </Suspense>
      </Container>
    </Center>
  );
};
