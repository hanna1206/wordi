import {
  Alert,
  Box,
  Button,
  Center,
  Heading,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';

import { GradientBackground } from '@/components/gradient-background';

export const WordsPage = () => {
  return (
    <GradientBackground variant="primary">
      <Center py={20}>
        <Alert.Root status="info" borderRadius="lg" maxWidth="600px">
          <Alert.Indicator />
          <VStack align="start" gap={4}>
            <Heading size="md">Your Word Collection is Coming Soon! 📚</Heading>
            <Text>
              We&apos;re working hard to bring you an amazing space where you
              can browse and review all your saved words.
            </Text>
            <Text>
              In the meantime, we&apos;d love to hear your thoughts! Feel free
              to share your ideas and suggestions using the feedback widget.
            </Text>
            <Box mt={5}>
              <Link href="/">
                <Button>Back to Main Page</Button>
              </Link>
            </Box>
          </VStack>
        </Alert.Root>
      </Center>
    </GradientBackground>
  );
};
