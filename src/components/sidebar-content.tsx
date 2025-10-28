'use client';

import { type ReactNode } from 'react';
import { LuBrain, LuHouse, LuLibrary } from 'react-icons/lu';

import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

interface SidebarNavigationItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarNavigationItem = ({
  href,
  icon,
  label,
  isActive,
}: SidebarNavigationItemProps) => (
  <Link
    href={href}
    textDecoration="none"
    aria-current={isActive ? 'page' : undefined}
  >
    <Button
      variant={isActive ? 'subtle' : 'ghost'}
      width="90%"
      p={2}
      m={0.5}
      justifyContent="start"
    >
      <Flex justifyContent="start" align="center" gap={2}>
        {icon}
        <Text>{label}</Text>
      </Flex>
    </Button>
  </Link>
);

const NAV_ITEMS = [
  { href: '/', icon: <LuHouse />, label: 'Home' },
  { href: '/vocabulary', icon: <LuLibrary />, label: 'Vocabulary' },
  { href: '/flash-cards-game', icon: <LuBrain />, label: 'Flash Cards Game' },
];

const isNavItemActive = (pathname: string | null, href: string) => {
  if (!pathname) {
    return false;
  }

  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export const SidebarContent = () => {
  const pathname = usePathname();

  return (
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
        {NAV_ITEMS.map((item) => (
          <SidebarNavigationItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={isNavItemActive(pathname, item.href)}
          />
        ))}
      </Flex>
    </Box>
  );
};
