'use client';

import React from 'react';
import { LuBrain, LuInfo, LuRefreshCw } from 'react-icons/lu';

import {
  Button,
  Dialog,
  HStack,
  Icon,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';

interface AIInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  showContinueButton?: boolean;
  onContinue?: () => void;
}

export const AIInfoModal: React.FC<AIInfoModalProps> = ({
  isOpen,
  onClose,
  title = 'About AI-Generated Content',
  showContinueButton = false,
  onContinue,
}) => {
  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    }
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.600" />
        <Dialog.Positioner
          position="fixed"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Dialog.Content
            maxW="md"
            w="full"
            shadow="lg"
            borderRadius="lg"
            bg="white"
          >
            <Dialog.Header
              pb={4}
              borderBottomWidth="1px"
              borderColor="gray.100"
            >
              <HStack gap={3}>
                <Icon color="blue.500" boxSize={6}>
                  <LuBrain />
                </Icon>
                <Dialog.Title fontSize="lg" fontWeight="semibold">
                  {title}
                </Dialog.Title>
              </HStack>
            </Dialog.Header>

            <Dialog.Body py={6}>
              <VStack gap={5} align="start">
                <VStack gap={3} align="start">
                  <HStack gap={2}>
                    <Icon color="orange.500" boxSize={5}>
                      <LuInfo />
                    </Icon>
                    <Text fontWeight="medium" color="gray.800">
                      Important to know about AI
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.600" lineHeight="relaxed">
                    Our app uses artificial intelligence to generate information
                    about German words. AI can sometimes make mistakes or
                    &quot;hallucinate&quot; - creating inaccurate information.
                  </Text>
                </VStack>

                <VStack gap={3} align="start">
                  <HStack gap={2}>
                    <Icon color="blue.500" boxSize={5}>
                      <LuRefreshCw />
                    </Icon>
                    <Text fontWeight="medium" color="gray.800">
                      What to do?
                    </Text>
                  </HStack>
                  <VStack gap={2} align="start" fontSize="sm" color="gray.600">
                    <Text>
                      • <strong>Double-check information</strong> - especially
                      important grammar details
                    </Text>
                    <Text>
                      • <strong>Use &quot;Regenerate&quot;</strong> - if the
                      result seems inaccurate
                    </Text>
                    <Text>
                      • <strong>Check spelling</strong> - typos can lead to
                      inaccurate results
                    </Text>
                    <Text>
                      • <strong>Use as a starting point</strong> for learning,
                      not as the only source
                    </Text>
                  </VStack>
                </VStack>

                <VStack gap={2} align="start">
                  <Text fontSize="sm" color="gray.500" fontStyle="italic">
                    We&apos;re constantly working to improve accuracy, but we
                    recommend always verifying information from reliable sources
                    for important cases.
                  </Text>
                </VStack>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer
              pt={4}
              borderTopWidth="1px"
              borderColor="gray.100"
              display="flex"
              gap={3}
              justifyContent="flex-end"
            >
              {showContinueButton && (
                <Button onClick={handleContinue} size="sm">
                  Got it, continue
                </Button>
              )}
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onClose} size="sm">
                  Close
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
