'use client';

import React, { useEffect, useState } from 'react';
import { LuCookie } from 'react-icons/lu';

import {
  Box,
  Button,
  HStack,
  Icon,
  Link,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';

const COOKIE_CONSENT_KEY = 'cookie-consent';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
  };

  // Don't render until client-side hydration is complete
  if (!isClient || !isVisible) {
    return null;
  }

  return (
    <Portal>
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={1000}
        bg="white"
        borderTop="1px"
        borderColor="gray.200"
        shadow="lg"
        p={{ base: 4, md: 6 }}
        _dark={{
          bg: 'gray.800',
          borderColor: 'gray.600',
        }}
      >
        <Box maxW="7xl" mx="auto">
          <VStack
            gap={{ base: 4, md: 0 }}
            align="stretch"
            direction={{ base: 'column', md: 'row' }}
          >
            {/* Content */}
            <HStack flex={1} align="start" gap={3} mb={{ base: 0, md: 0 }}>
              <Icon
                as={LuCookie}
                boxSize={5}
                color="blue.500"
                mt={0.5}
                flexShrink={0}
              />
              <VStack align="start" gap={2} flex={1}>
                <Text
                  fontSize={{ base: 'sm', md: 'md' }}
                  fontWeight="semibold"
                  color="gray.800"
                  _dark={{ color: 'gray.100' }}
                >
                  We use cookies
                </Text>
                <Text
                  fontSize={{ base: 'xs', md: 'sm' }}
                  color="gray.600"
                  _dark={{ color: 'gray.400' }}
                  lineHeight="1.5"
                >
                  This website uses cookies to enhance your browsing experience,
                  analyze site usage, and provide personalized content. By
                  continuing to use this site, you consent to our use of
                  cookies.{' '}
                  <Link
                    href="/privacy-policy"
                    color="blue.500"
                    textDecoration="underline"
                    _hover={{ color: 'blue.600' }}
                  >
                    Privacy Policy
                  </Link>{' '}
                  |{' '}
                  <Link
                    href="/terms-of-service"
                    color="blue.500"
                    textDecoration="underline"
                    _hover={{ color: 'blue.600' }}
                  >
                    Terms of Service
                  </Link>
                </Text>
              </VStack>
            </HStack>

            {/* Actions */}
            <HStack
              gap={3}
              justify={{ base: 'stretch', md: 'flex-end' }}
              align="center"
              flexShrink={0}
            >
              <Button
                variant="ghost"
                size={{ base: 'sm', md: 'md' }}
                onClick={handleDecline}
                _dark={{ color: 'gray.400' }}
                _hover={{
                  bg: 'gray.100',
                  _dark: { bg: 'gray.700' },
                }}
                flex={{ base: 1, md: 'none' }}
              >
                Decline
              </Button>
              <Button
                size={{ base: 'sm', md: 'md' }}
                onClick={handleAccept}
                flex={{ base: 1, md: 'none' }}
                _hover={{
                  transform: 'translateY(-1px)',
                  shadow: 'md',
                }}
                transition="all 0.2s"
                variant="solid"
              >
                Accept
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Portal>
  );
};
