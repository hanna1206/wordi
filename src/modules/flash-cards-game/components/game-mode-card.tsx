import { ReactNode } from 'react';
import { IconType } from 'react-icons';

import { Box, Flex, Icon, Text } from '@chakra-ui/react';

type GameModeCardProps = {
  icon: IconType;
  title: string | ReactNode;
  description: string;
  onClick: () => void;
  disabled?: boolean;
};

export const GameModeCard = (props: GameModeCardProps) => {
  const { icon, title, description, onClick, disabled = false } = props;

  return (
    <Box
      w="full"
      borderWidth={1}
      borderColor={disabled ? 'gray.100' : 'gray.200'}
      borderRadius="lg"
      overflow="hidden"
      _hover={
        disabled
          ? {}
          : {
              cursor: 'pointer',
              borderColor: 'blue.500',
              boxShadow: 'lg',
            }
      }
      transition="all 0.2s"
      onClick={disabled ? undefined : onClick}
      p={4}
      opacity={disabled ? 0.5 : 1}
      cursor={disabled ? 'not-allowed' : 'pointer'}
    >
      <Flex align="center">
        <Icon
          as={icon}
          boxSize={8}
          color={disabled ? 'gray.400' : 'blue.500'}
          mr={4}
        />
        <Box>
          <Box fontSize="lg" fontWeight="bold">
            {typeof title === 'string' ? <Text>{title}</Text> : title}
          </Box>
          <Text fontSize="sm" color={disabled ? 'gray.400' : 'gray.600'}>
            {description}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
