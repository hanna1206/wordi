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
  isDialog?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const SidebarNavigationItem = ({
  href,
  icon,
  label,
  isActive,
  isSidebarOpen,
  isDialog,
  onClick,
}: SidebarNavigationItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (isDialog && onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
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
};

const NAV_ITEMS = [
  { href: '/', icon: <LuHouse />, label: 'Home' },
  { href: '/vocabulary', icon: <LuLibrary />, label: 'Vocabulary' },
  {
    href: '/flash-cards-game',
    icon: <LuBrain />,
    label: 'Flashcards',
    isDialog: true,
  },
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
  onFlashCardsClick?: (e: React.MouseEvent) => void;
}

export const SidebarContent = ({
  isSidebarOpen,
  onFlashCardsClick,
}: SidebarContentProps) => {
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
          isDialog={item.isDialog}
          onClick={item.isDialog ? onFlashCardsClick : undefined}
        />
      ))}
    </Box>
  );
};
