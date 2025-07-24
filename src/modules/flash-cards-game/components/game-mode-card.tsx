import { IconType } from 'react-icons';

import { Box, Flex, Icon, Text } from '@chakra-ui/react';

type GameModeCardProps = {
  icon: IconType;
  title: string;
  description: string;
  onClick: () => void;
};

export const GameModeCard = (props: GameModeCardProps) => {
  const { icon, title, description, onClick } = props;

  return (
    <Box
      w="full"
      borderWidth={1}
      borderColor="gray.200"
      borderRadius="lg"
      overflow="hidden"
      _hover={{
        cursor: 'pointer',
        borderColor: 'blue.500',
        boxShadow: 'lg',
      }}
      transition="all 0.2s"
      onClick={onClick}
      p={4}
    >
      <Flex align="center">
        <Icon as={icon} boxSize={8} color="blue.500" mr={4} />
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {description}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
