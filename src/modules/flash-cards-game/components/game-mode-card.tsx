import { ReactNode, useCallback, useId } from 'react';
import { IconType } from 'react-icons';
import { FaChevronRight } from 'react-icons/fa';

import { Box, Flex, Icon, Spinner, Text } from '@chakra-ui/react';

type GameModeCardProps = {
  icon: IconType;
  title: string | ReactNode;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  subtext?: string;
  isLoading?: boolean;
};

export const GameModeCard = (props: GameModeCardProps) => {
  const {
    icon,
    title,
    description,
    onClick,
    disabled = false,
    subtext,
    isLoading = false,
  } = props;

  const descriptionId = useId();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled || isLoading) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
    [disabled, isLoading, onClick],
  );

  return (
    <Box
      as="button"
      w="full"
      textAlign="left"
      borderWidth={2}
      borderColor={disabled || isLoading ? 'gray.100' : 'gray.200'}
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.2s ease"
      onClick={disabled || isLoading ? undefined : onClick}
      onKeyDown={handleKeyDown}
      p={5}
      opacity={disabled ? 0.6 : 1}
      cursor={disabled || isLoading ? 'not-allowed' : 'pointer'}
      minH="120px"
      _hover={
        disabled || isLoading
          ? {}
          : {
              transform: 'translateY(-2px)',
              borderColor: 'blue.600',
              boxShadow: 'xl',
            }
      }
      _focus={{
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.3)',
      }}
      aria-describedby={descriptionId}
      bg="white"
    >
      <Flex align="flex-start" gap={4} h="full">
        <Flex
          align="center"
          justify="center"
          boxSize={10}
          borderRadius="full"
          bg={disabled || isLoading ? 'gray.100' : 'blue.50'}
          border="1px solid"
          borderColor={disabled || isLoading ? 'gray.200' : 'blue.200'}
          flexShrink={0}
        >
          {isLoading ? (
            <Spinner size="sm" color="blue.500" />
          ) : (
            <Icon
              as={icon}
              boxSize={5}
              color={disabled ? 'gray.400' : 'blue.600'}
              aria-hidden
            />
          )}
        </Flex>
        <Flex direction="column" gap={1} flex={1} minW={0}>
          <Box fontSize="xl" fontWeight="bold" color="gray.900">
            {typeof title === 'string' ? <Text>{title}</Text> : title}
          </Box>
          <Text
            id={descriptionId}
            fontSize="sm"
            color={disabled ? 'gray.400' : 'gray.700'}
          >
            {description}
          </Text>
          {subtext && (
            <Text fontSize="xs" color="gray.500" mt={1}>
              {subtext}
            </Text>
          )}
        </Flex>
        <Flex align="center" justify="center" ml="auto" pl={2} flexShrink={0}>
          <Icon
            as={FaChevronRight}
            boxSize={4}
            color={disabled ? 'gray.300' : 'gray.500'}
            aria-hidden
          />
        </Flex>
      </Flex>
    </Box>
  );
};
