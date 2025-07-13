import { LuTrash2 } from 'react-icons/lu';

import { Button, Dialog } from '@chakra-ui/react';

interface ModalFooterProps {
  showDeleteConfirm: boolean;
  isDeleting: boolean;
  onDeleteClick: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  onClose: () => void;
}

export const ModalFooter = ({
  showDeleteConfirm,
  isDeleting,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel,
  onClose,
}: ModalFooterProps) => {
  return (
    <Dialog.Footer
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 4 }}
      borderTopWidth="1px"
      borderColor="gray.100"
      bg="gray.100"
      mt="auto"
      display="flex"
      gap={3}
      flexDirection={{ base: 'column', md: 'row' }}
      alignItems="stretch"
    >
      {!showDeleteConfirm ? (
        <>
          <Button
            variant="subtle"
            colorScheme="red"
            onClick={onDeleteClick}
            size={{ base: 'lg', md: 'lg' }}
            h={{ base: '48px', md: '44px' }}
            px={{ base: 6, md: 8 }}
            fontWeight="medium"
            flex={{ base: 'none', md: '1' }}
          >
            <LuTrash2 />
            Delete
          </Button>
          <Dialog.ActionTrigger asChild>
            <Button
              variant="subtle"
              onClick={onClose}
              w={{ base: 'full', md: 'auto' }}
              flex={{ base: 'none', md: '1' }}
              size={{ base: 'lg', md: 'lg' }}
              h={{ base: '48px', md: '44px' }}
              px={{ base: 6, md: 8 }}
              fontWeight="medium"
            >
              Close
            </Button>
          </Dialog.ActionTrigger>
        </>
      ) : (
        <>
          <Button
            variant="subtle"
            onClick={onDeleteCancel}
            size={{ base: 'lg', md: 'lg' }}
            h={{ base: '48px', md: '44px' }}
            px={{ base: 6, md: 8 }}
            fontWeight="medium"
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={onDeleteConfirm}
            loading={isDeleting}
            w="full"
            size={{ base: 'lg', md: 'lg' }}
            h={{ base: '48px', md: '44px' }}
            px={{ base: 6, md: 8 }}
            borderRadius={{ base: 'xl', md: 'md' }}
            fontWeight="medium"
          >
            {isDeleting ? 'Deleting...' : 'Delete Word'}
          </Button>
        </>
      )}
    </Dialog.Footer>
  );
};
