'use client';

import React, { useEffect, useState } from 'react';
import { LuCookie, LuX } from 'react-icons/lu';

import { Box, Button, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'cookie-consent';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasDeclined, setHasDeclined] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
      // Prevent body scroll when modal is visible
      document.body.style.overflow = 'hidden';
    } else if (consent === 'declined') {
      setIsVisible(true);
      setHasDeclined(true);
      // Keep body scroll disabled for declined state
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
    setHasDeclined(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setHasDeclined(true);
    // Keep modal visible and body scroll disabled
  };

  const handleReconsider = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setHasDeclined(false);
    // Modal stays visible for new choice
  };

  if (!isVisible) {
    return null;
  }

  // Show declined state
  if (hasDeclined) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.900"
        backdropFilter="blur(4px)"
        zIndex={9999}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <Box
          bg="white"
          borderRadius="xl"
          p={{ base: 6, md: 8 }}
          maxW="lg"
          w="full"
          shadow="2xl"
          border="1px"
          borderColor="red.200"
        >
          <VStack gap={6} textAlign="center">
            {/* Warning Icon and Title */}
            <VStack gap={3}>
              <Box p={3} bg="red.50" borderRadius="full" color="red.500">
                <Icon size="lg">
                  <LuX />
                </Icon>
              </Box>
              <VStack gap={2}>
                <Text fontSize="xl" fontWeight="bold" color="red.600">
                  Access Denied
                </Text>
                <Text fontSize="sm" color="gray.600" lineHeight="1.5">
                  You have declined cookie consent
                </Text>
              </VStack>
            </VStack>

            {/* Content */}
            <VStack gap={4}>
              <Text
                fontSize="sm"
                color="gray.700"
                lineHeight="1.6"
                textAlign="left"
              >
                Unfortunately, we cannot provide our services without your
                consent to process cookies and similar technologies. This is
                required for:
              </Text>

              <Box
                as="ul"
                fontSize="sm"
                color="gray.600"
                textAlign="left"
                pl={4}
              >
                <li>• Essential website functionality</li>
                <li>• Error monitoring and security</li>
                <li>• User authentication and sessions</li>
                <li>• Legal compliance and data protection</li>
              </Box>

              <Text fontSize="xs" color="gray.500" textAlign="left">
                You can review our{' '}
                <Link href="/privacy-policy" color="blue.500">
                  Privacy Policy
                </Link>{' '}
                for more details about our data practices.
              </Text>
            </VStack>

            {/* Action Buttons */}
            <VStack gap={3} w="full">
              <Button
                size="md"
                onClick={handleReconsider}
                w="full"
                bg="blue.500"
                color="white"
                _hover={{ bg: 'blue.600' }}
              >
                Reconsider & Accept Cookies
              </Button>

              <Text fontSize="xs" color="gray.400" textAlign="center">
                Or close this browser tab to leave our website
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Box>
    );
  }

  // Show initial consent request
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.800"
      backdropFilter="blur(4px)"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="white"
        borderRadius="xl"
        p={{ base: 6, md: 8 }}
        maxW="lg"
        w="full"
        shadow="2xl"
        border="1px"
        borderColor="gray.200"
      >
        <VStack gap={6} textAlign="center">
          {/* Cookie Icon and Title */}
          <VStack gap={3}>
            <Box p={3} bg="blue.50" borderRadius="full" color="blue.500">
              <Icon size="lg">
                <LuCookie />
              </Icon>
            </Box>
            <VStack gap={2}>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Cookie Consent Required
              </Text>
              <Text fontSize="sm" color="gray.600" lineHeight="1.5">
                We need your consent before you can continue using our service.
              </Text>
            </VStack>
          </VStack>

          {/* Content */}
          <VStack gap={4}>
            <Text
              fontSize="sm"
              color="gray.700"
              lineHeight="1.6"
              textAlign="left"
            >
              We use cookies and similar technologies to enhance your
              experience, provide essential functionality, and analyze usage
              patterns. By clicking &ldquo;Accept&rdquo;, you consent to our use
              of cookies.
            </Text>

            <Text fontSize="xs" color="gray.500" textAlign="left">
              <Link href="/privacy-policy" color="blue.500">
                Learn more about our privacy practices
              </Link>{' '}
              and how we handle your data.
            </Text>
          </VStack>

          {/* Action Buttons */}
          <HStack gap={3} w="full" justify="center">
            <Button
              size="md"
              variant="outline"
              onClick={handleDecline}
              flex={1}
              borderColor="red.200"
              color="red.600"
              _hover={{ bg: 'red.50', borderColor: 'red.300' }}
            >
              Decline
            </Button>
            <Button
              size="md"
              onClick={handleAccept}
              flex={1}
              bg="blue.500"
              color="white"
              _hover={{ bg: 'blue.600' }}
            >
              Accept Cookies
            </Button>
          </HStack>

          {/* Legal Notice */}
          <Text fontSize="xs" color="gray.400" textAlign="center" maxW="sm">
            You must make a choice to continue. We cannot provide our services
            without your explicit consent regarding data processing.
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};
