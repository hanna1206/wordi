import { type ReactNode } from 'react';
import { LuBrain, LuHouse, LuLibrary } from 'react-icons/lu';

import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';

interface SidebarNavigationItemProps {
  href: string;
  icon: ReactNode;
  label: string;
}

const SidebarNavigationItem = ({
  href,
  icon,
  label,
}: SidebarNavigationItemProps) => (
  <Link href={href} textDecoration="none">
    <Button variant="ghost" width="250px" p={2} justifyContent="start">
      <Flex justifyContent="start" align="center" gap={2}>
        {icon}
        <Text>{label}</Text>
      </Flex>
    </Button>
  </Link>
);

export const SidebarContent = () => (
  <Box
    pt={2}
    pb={8}
    pl={4}
    flex="1"
    display="flex"
    flexDirection="column"
    overflow="hidden"
  >
    <Flex direction="column">
      <SidebarNavigationItem href="/" icon={<LuHouse />} label="Home" />
      <SidebarNavigationItem
        href="/vocabulary"
        icon={<LuLibrary />}
        label="Vocabulary"
      />
      <SidebarNavigationItem
        href="/flash-cards-game"
        icon={<LuBrain />}
        label="Flash Cards Game"
      />
    </Flex>
  </Box>
);
