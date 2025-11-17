'use client';

import { type ReactNode } from 'react';
import { LuBrain, LuHouse, LuLibrary } from 'react-icons/lu';

import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useDueWordsCount } from '@/modules/flashcards/context/due-words-count-context';

const MAX_DUE_COUNT_BADGE = 99;

type SidebarLinkConfig = {
  type: 'link';
  href: string;
  icon: ReactNode;
  label: string;
};

type SidebarActionConfig = {
  type: 'action';
  id: string;
  icon: ReactNode;
  label: string;
};

type SidebarItemConfig = SidebarLinkConfig | SidebarActionConfig;

const NAVIGATION_ITEMS: SidebarItemConfig[] = [
  {
    type: 'link',
    href: '/',
    icon: <LuHouse />,
    label: 'Home',
  },
  {
    type: 'link',
    href: '/vocabulary',
    icon: <LuLibrary />,
    label: 'Vocabulary',
  },
  {
    type: 'action',
    id: 'flashcards',
    icon: <LuBrain />,
    label: 'Flashcards',
  },
];

const isLinkActive = (pathname: string | null, href: string) => {
  if (!pathname) {
    return false;
  }

  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

const SidebarItemContent = ({
  icon,
  label,
  isSidebarOpen,
}: {
  icon: ReactNode;
  label: string | ReactNode;
  isSidebarOpen: boolean;
}) => (
  <Flex justifyContent="flex-start" gap={2} alignItems="center" width="100%">
    {icon}
    {typeof label === 'string' ? (
      <Text display={isSidebarOpen ? 'block' : 'none'}>{label}</Text>
    ) : (
      label
    )}
  </Flex>
);

const SidebarLink = ({
  href,
  icon,
  label,
  isActive,
  isSidebarOpen,
}: {
  href: string;
  icon: ReactNode;
  label: string | ReactNode;
  isActive: boolean;
  isSidebarOpen: boolean;
}) => (
  <Link href={href}>
    <Button
      variant={isActive ? 'subtle' : 'ghost'}
      py={2}
      m={0.5}
      px={2}
      justifyContent="start"
      width="100%"
    >
      <SidebarItemContent
        icon={icon}
        label={label}
        isSidebarOpen={isSidebarOpen}
      />
    </Button>
  </Link>
);

const SidebarAction = ({
  icon,
  label,
  isActive,
  isSidebarOpen,
  onClick,
}: {
  icon: ReactNode;
  label: string | ReactNode;
  isActive: boolean;
  isSidebarOpen: boolean;
  onClick: (e: React.MouseEvent) => void;
}) => (
  <Button
    variant={isActive ? 'subtle' : 'ghost'}
    py={2}
    m={0.5}
    px={2}
    justifyContent="start"
    width="100%"
    onClick={onClick}
    position="relative"
  >
    <SidebarItemContent
      icon={icon}
      label={label}
      isSidebarOpen={isSidebarOpen}
    />
  </Button>
);

export const SidebarContent = ({
  isSidebarOpen,
  onFlashCardsClick,
}: {
  isSidebarOpen: boolean;
  onFlashCardsClick?: (e: React.MouseEvent) => void;
}) => {
  const pathname = usePathname();
  const { dueCount, isDueCountLoading } = useDueWordsCount();

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
      {NAVIGATION_ITEMS.map((item) => {
        if (item.type === 'link') {
          return (
            <SidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isLinkActive(pathname, item.href)}
              isSidebarOpen={isSidebarOpen}
            />
          );
        }

        // type === 'action' (flashcards)
        const isFlashcards = item.id === 'flashcards';
        const showBadge = isFlashcards && !isDueCountLoading && dueCount > 0;

        const labelContent = isFlashcards ? (
          <Flex
            align="center"
            gap={2}
            display={isSidebarOpen ? 'flex' : 'none'}
          >
            <Text>{item.label}</Text>
            {showBadge && (
              <Badge
                borderRadius="full"
                fontSize="xs"
                aria-label={`${dueCount} words due for review`}
              >
                {dueCount > MAX_DUE_COUNT_BADGE
                  ? `${MAX_DUE_COUNT_BADGE}+`
                  : dueCount}
              </Badge>
            )}
          </Flex>
        ) : (
          item.label
        );

        return (
          <Box key={item.id} position="relative">
            <SidebarAction
              icon={item.icon}
              label={labelContent}
              isActive={false}
              isSidebarOpen={isSidebarOpen}
              onClick={(e) => {
                if (item.id === 'flashcards' && onFlashCardsClick) {
                  onFlashCardsClick(e);
                }
              }}
            />
            {!isSidebarOpen && showBadge && (
              <Badge
                position="absolute"
                top="2px"
                right="6px"
                borderRadius="full"
                fontSize="2xs"
                minW="18px"
                h="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                aria-label={`${dueCount} words due for review`}
                pointerEvents="none"
              >
                {dueCount > MAX_DUE_COUNT_BADGE
                  ? `${MAX_DUE_COUNT_BADGE}+`
                  : dueCount}
              </Badge>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
