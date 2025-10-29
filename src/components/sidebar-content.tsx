'use client';

import { type ReactNode } from 'react';
import { LuBrain, LuHouse, LuLibrary } from 'react-icons/lu';

import { Box, Button, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarNavigationItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  isSidebarOpen: boolean;
}

const SidebarNavigationItem = ({
  href,
  icon,
  label,
  isActive,
  isSidebarOpen,
}: SidebarNavigationItemProps) => (
  <Link href={href}>
    <Button
      variant={isActive ? 'subtle' : 'ghost'}
      py={2}
      m={0.5}
      px={2}
      justifyContent="start"
      width="100%"
      textDecoration="none"
    >
      <Flex justifyContent="flex-start" gap={2}>
        {icon}
        <Text display={isSidebarOpen ? 'block' : 'none'}>{label}</Text>
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

interface SidebarContentProps {
  isSidebarOpen: boolean;
}

export const SidebarContent = ({ isSidebarOpen }: SidebarContentProps) => {
  const pathname = usePathname();

  return (
    <Box
      pt={2}
      pb={8}
      px={2}
      display="flex"
      flexDirection="column"
      overflow="hidden"
      alignItems="stretch"
      width="100%"
    >
      {NAV_ITEMS.map((item) => (
        <SidebarNavigationItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          isActive={isNavItemActive(pathname, item.href)}
          isSidebarOpen={isSidebarOpen}
        />
      ))}
    </Box>
  );
};
