import {
  LuArrowRight,
  LuBook,
  LuGraduationCap,
  LuSparkles,
} from 'react-icons/lu';

import {
  Button,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';

import { generateWordCard } from '@/modules/words/words.actions';

export const CreateWordForm = () => (
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
    <form action={generateWordCard}>
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
              type="submit"
              name="word"
              value="das Buch"
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
              type="submit"
              name="word"
              value="lernen"
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
              type="submit"
              name="word"
              value="wunderbar"
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
);
