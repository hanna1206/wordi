import { ReactNode } from 'react';

import { Box, Flex, Heading, Text } from '@chakra-ui/react';

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export const PageHeader = ({
  title,
  description,
  actions,
}: PageHeaderProps) => {
  return (
    <Box mb={8}>
      <Flex align="center" gap={4} mb={description ? 4 : 0}>
        <Heading size="2xl" fontWeight="bold" flex="1">
          {title}
        </Heading>
        {actions}
      </Flex>
      {description ? (
        <Text color="fg.muted" fontSize="md">
          {description}
        </Text>
      ) : null}
    </Box>
  );
};
