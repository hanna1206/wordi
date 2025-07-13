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
            variant="outline"
            colorScheme="red"
            onClick={onDeleteClick}
            size={{ base: 'lg', md: 'lg' }}
            h={{ base: '48px', md: '44px' }}
            px={{ base: 6, md: 8 }}
            borderRadius={{ base: 'xl', md: 'md' }}
            fontWeight="medium"
            flex={{ base: 'none', md: '0 0 auto' }}
          >
            <LuTrash2 />
            Delete
          </Button>
          <Dialog.ActionTrigger asChild>
            <Button
              variant="outline"
              onClick={onClose}
              w="full"
              size={{ base: 'lg', md: 'lg' }}
              h={{ base: '48px', md: '44px' }}
              px={{ base: 6, md: 8 }}
              borderRadius={{ base: 'xl', md: 'md' }}
              fontWeight="medium"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              _hover={{
                bg: 'gray.100',
                borderColor: 'gray.300',
              }}
              _active={{
                bg: 'gray.100',
              }}
            >
              Close
            </Button>
          </Dialog.ActionTrigger>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={onDeleteCancel}
            size={{ base: 'lg', md: 'lg' }}
            h={{ base: '48px', md: '44px' }}
            px={{ base: 6, md: 8 }}
            borderRadius={{ base: 'xl', md: 'md' }}
            fontWeight="medium"
            border="1px solid"
            borderColor="gray.200"
            bg="white"
            _hover={{
              bg: 'gray.100',
              borderColor: 'gray.300',
            }}
            _active={{
              bg: 'gray.100',
            }}
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
