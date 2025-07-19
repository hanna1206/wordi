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

  useEffect(() => {
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

  if (!isVisible) {
    return null;
  }

  return (
    <Portal>
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        borderTopWidth="1px"
        borderColor="gray.200"
        p={4}
        zIndex={1000}
        shadow="lg"
      >
        <VStack gap={3} maxW="4xl" mx="auto">
          <HStack gap={2} color="gray.600">
            <Icon asChild>
              <LuCookie />
            </Icon>
            <Text fontSize="sm" textAlign={{ base: 'center', md: 'left' }}>
              We use cookies to enhance your experience. By continuing to visit
              this site you agree to our use of cookies.{' '}
              <Link href="/privacy-policy" color="blue.500" fontWeight="medium">
                Learn more
              </Link>
            </Text>
          </HStack>
          <HStack gap={2} justify="center">
            <Button size="sm" variant="outline" onClick={handleDecline}>
              Decline
            </Button>
            <Button size="sm" onClick={handleAccept}>
              Accept
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Portal>
  );
};
