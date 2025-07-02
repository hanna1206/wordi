'use client';

import { useState } from 'react';
import {
  LuArrowRight,
  LuBook,
  LuGraduationCap,
  LuSparkles,
} from 'react-icons/lu';

import {
  Button,
  Dialog,
  Heading,
  HStack,
  IconButton,
  Input,
  Portal,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

import { translateWord } from '@/modules/words/words.actions';

export const CreateWordForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [word, setWord] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (wordToTranslate: string) => {
    if (!wordToTranslate.trim()) return;

    setWord(wordToTranslate);
    setIsOpen(true);
    setIsLoading(true);
    setTranslation(null);
    setError(null);

    try {
      const result = await translateWord(wordToTranslate.trim());
      if (result.success && result.data?.translation) {
        setTranslation(result.data.translation);
      } else {
        setError(result.error || 'Failed to translate word');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const wordValue = formData.get('word') as string;
    handleSubmit(wordValue);
  };

  const onClose = () => {
    setIsOpen(false);
    setWord('');
    setTranslation(null);
    setError(null);
  };

  return (
    <>
      <VStack gap={12} align="stretch" py={8}>
        {/* Main heading */}
        <VStack gap={3} textAlign="center">
          <Heading
            size="3xl"
            fontWeight="500"
            color="gray.800"
            letterSpacing="-0.02em"
            _dark={{ color: 'gray.100' }}
          >
            What German word would you like to learn today?
          </Heading>
        </VStack>

        {/* Input form */}
        <form onSubmit={onFormSubmit}>
          <VStack gap={6}>
            <HStack
              w="full"
              maxW="2xl"
              mx="auto"
              bg="white"
              border="1px"
              borderColor="gray.200"
              borderRadius="2xl"
              p={2}
              shadow="sm"
              transition="all 0.2s"
              _dark={{
                bg: 'gray.800',
                borderColor: 'gray.600',
              }}
              _hover={{
                shadow: 'md',
                borderColor: 'gray.300',
                _dark: { borderColor: 'gray.500' },
              }}
              _focusWithin={{
                shadow: 'lg',
                borderColor: 'blue.400',
              }}
            >
              <Input
                name="word"
                placeholder="Enter any German word..."
                size="lg"
                fontSize="lg"
                border="none"
                outline="none"
                px={4}
                py={3}
                required
                flex={1}
                _placeholder={{
                  color: 'gray.400',
                  _dark: { color: 'gray.500' },
                }}
                _focus={{ boxShadow: 'none' }}
              />
              <IconButton
                type="submit"
                aria-label="Generate word card"
                bg="blue.500"
                color="white"
                borderRadius="xl"
                size="lg"
                transition="all 0.15s"
                _hover={{
                  bg: 'blue.600',
                  transform: 'scale(1.05)',
                }}
                _active={{
                  transform: 'scale(0.95)',
                }}
              >
                <LuArrowRight />
              </IconButton>
            </HStack>

            {/* Quick action chips */}
            <VStack gap={4} mt={4}>
              <Text
                fontSize="sm"
                color="gray.500"
                fontWeight="medium"
                _dark={{ color: 'gray.400' }}
              >
                Try these
              </Text>
              <HStack gap={3} flexWrap="wrap" justify="center">
                <Button
                  type="button"
                  onClick={() => handleSubmit('das Buch')}
                  variant="outline"
                  size="sm"
                  borderRadius="full"
                  borderColor="gray.200"
                  color="gray.600"
                  bg="white"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  _dark={{
                    borderColor: 'gray.600',
                    color: 'gray.300',
                    bg: 'gray.800',
                  }}
                  _hover={{
                    bg: 'gray.50',
                    borderColor: 'gray.300',
                    _dark: {
                      bg: 'gray.700',
                      borderColor: 'gray.500',
                    },
                  }}
                >
                  <LuBook size={14} />
                  das Buch
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSubmit('lernen')}
                  variant="outline"
                  size="sm"
                  borderRadius="full"
                  borderColor="gray.200"
                  color="gray.600"
                  bg="white"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  _dark={{
                    borderColor: 'gray.600',
                    color: 'gray.300',
                    bg: 'gray.800',
                  }}
                  _hover={{
                    bg: 'gray.50',
                    borderColor: 'gray.300',
                    _dark: {
                      bg: 'gray.700',
                      borderColor: 'gray.500',
                    },
                  }}
                >
                  <LuGraduationCap size={14} />
                  lernen
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSubmit('wunderbar')}
                  variant="outline"
                  size="sm"
                  borderRadius="full"
                  borderColor="gray.200"
                  color="gray.600"
                  bg="white"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  _dark={{
                    borderColor: 'gray.600',
                    color: 'gray.300',
                    bg: 'gray.800',
                  }}
                  _hover={{
                    bg: 'gray.50',
                    borderColor: 'gray.300',
                    _dark: {
                      bg: 'gray.700',
                      borderColor: 'gray.500',
                    },
                  }}
                >
                  <LuSparkles size={14} />
                  wunderbar
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </form>
      </VStack>

      {/* Translation Modal */}
      <Dialog.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="md" mx="auto">
              <Dialog.Header>
                <Dialog.Title>Translating &quot;{word}&quot;</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {isLoading ? (
                  <VStack gap={4} py={8}>
                    <Spinner size="lg" color="blue.500" />
                    <Text color="gray.500" _dark={{ color: 'gray.400' }}>
                      Getting translation...
                    </Text>
                  </VStack>
                ) : error ? (
                  <VStack gap={4} py={4}>
                    <Text color="red.500" textAlign="center">
                      {error}
                    </Text>
                  </VStack>
                ) : translation ? (
                  <VStack gap={4} py={4}>
                    <Text fontSize="lg" fontWeight="medium" textAlign="center">
                      {translation}
                    </Text>
                  </VStack>
                ) : null}
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </Dialog.ActionTrigger>
                {translation && (
                  <Button colorScheme="blue" ml={3}>
                    Save to Collection
                  </Button>
                )}
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
