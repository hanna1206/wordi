'use client';

import { useEffect, useRef, useState } from 'react';
import { LuPlus, LuShare } from 'react-icons/lu';

import { HStack, Text } from '@chakra-ui/react';

import { toaster } from './toaster';

export const InstallPrompt = () => {
  const [hasShownToast, setHasShownToast] = useState(false);
  const isScheduledRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate toasts
    if (hasShownToast || isScheduledRef.current) return;

    // Only show the toast once per session for iOS users who haven't installed the app
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream: unknown }).MSStream;
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)',
    ).matches;

    if (isIOS && !isStandalone && !hasShownToast) {
      // Mark as scheduled to prevent duplicates
      isScheduledRef.current = true;

      // Show toast after a short delay to avoid overwhelming the user immediately
      const timer = setTimeout(() => {
        toaster.create({
          title: 'Install App',
          description: (
            <HStack gap="1" align="center" wrap="wrap" mt="2">
              <Text fontSize="sm">Tap</Text>
              <HStack
                as="span"
                display="inline-flex"
                alignItems="center"
                bg="bg.subtle"
                px="2"
                py="1"
                borderRadius="md"
                fontSize="sm"
              >
                <LuShare size="14" />
              </HStack>
              <Text fontSize="sm">then</Text>
              <HStack
                as="span"
                display="inline-flex"
                alignItems="center"
                bg="bg.subtle"
                px="2"
                py="1"
                borderRadius="md"
                fontSize="sm"
                gap="1"
              >
                <LuPlus size="12" />
                <Text>Add to Home Screen</Text>
              </HStack>
            </HStack>
          ),
          action: {
            label: 'Got it',
            onClick: () => {}, // No additional action needed, toast will close automatically
          },
          type: 'info',
          duration: 8000, // 8 seconds
          closable: true,
        });
        setHasShownToast(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [hasShownToast]);

  // This component doesn't render anything visible in the DOM
  return null;
};
