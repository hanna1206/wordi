import { useEffect, useState } from 'react';
import { LuX } from 'react-icons/lu';

import { Box, Container, HStack, IconButton, Text } from '@chakra-ui/react';

export const InstallPrompt = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as unknown as { MSStream: unknown }).MSStream,
    );

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone || !isOpen) {
    return null;
  }

  return (
    <>
      {isIOS && (
        <Box
          borderTopWidth="1px"
          bg="bg.panel"
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          zIndex={1000}
        >
          <Container py="1">
            <HStack
              gap={{ base: '3', md: '4' }}
              justify={{ base: 'start', md: 'space-between' }}
            >
              <Box boxSize="8" display={{ base: 'none', md: 'block' }} />
              <Text fontWeight="medium" fontSize="xs">
                <strong>Add to Home Screen. </strong> To install this app on
                your iOS device, tap the share button
                <span role="img" aria-label="share icon">
                  {' '}
                  ⎋{' '}
                </span>
                and then &quot;Add to Home Screen&quot;
                <span role="img" aria-label="plus icon">
                  {' '}
                  ➕{' '}
                </span>
                .
              </Text>
              <IconButton
                variant="ghost"
                aria-label="Close banner"
                colorPalette="gray"
                onClick={() => setIsOpen(false)}
              >
                <LuX />
              </IconButton>
            </HStack>
          </Container>
        </Box>
      )}
    </>
  );
};
