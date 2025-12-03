'use client';

import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';

interface ResetProgressDialogProps {
  isOpen: boolean;
  vocabularyText: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetProgressDialog = ({
  isOpen,
  vocabularyText,
  isLoading,
  onClose,
  onConfirm,
}: ResetProgressDialogProps) => {
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open && !isLoading) {
          onClose();
        }
      }}
      size={{ mdDown: 'full', md: 'md' }}
    >
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent borderRadius={{ base: 0, md: 'lg' }}>
            <DialogHeader>
              <DialogTitle>Reset Progress?</DialogTitle>
              {!isLoading && <DialogCloseTrigger />}
            </DialogHeader>

            <DialogBody py={{ base: 4, md: 3 }}>
              <VStack gap={4} align="flex-start">
                <Text fontSize="md" color="gray.700">
                  Are you sure you want to reset the learning progress for{' '}
                  <strong>&ldquo;{vocabularyText}&rdquo;</strong>?
                </Text>
                <Text fontSize="sm" color="red.600" fontWeight="medium">
                  Warning: All learning progress will be permanently lost.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  This will restore the vocabulary item to its initial state as
                  if it were newly added. This action cannot be undone.
                </Text>
              </VStack>
            </DialogBody>

            <DialogFooter
              pt={3}
              gap={2}
              flexDirection={{ base: 'column-reverse', md: 'row' }}
            >
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                size={{ base: 'lg', md: 'md' }}
                width={{ base: 'full', md: 'auto' }}
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                loading={isLoading}
                colorScheme="red"
                size={{ base: 'lg', md: 'md' }}
                width={{ base: 'full', md: 'auto' }}
              >
                Reset Progress
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
};
