'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useBreakpointValue } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

interface SidebarContextValue {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined,
);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const lastDesktopStateRef = useRef(true);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const pathname = usePathname();

  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isMobile === undefined) {
      return;
    }

    if (isMobile) {
      setIsSidebarOpen(false);
      return;
    }

    setIsSidebarOpen((prev) => {
      if (prev === lastDesktopStateRef.current) {
        return prev;
      }

      return lastDesktopStateRef.current;
    });
  }, [isMobile]);

  useEffect(() => {
    if (isMobile || isMobile === undefined) {
      return;
    }

    lastDesktopStateRef.current = isSidebarOpen;
  }, [isSidebarOpen, isMobile]);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    setIsSidebarOpen(false);
  }, [pathname, isMobile]);

  const value = useMemo(
    () => ({ isSidebarOpen, openSidebar, closeSidebar, toggleSidebar }),
    [isSidebarOpen, openSidebar, closeSidebar, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }

  return context;
};
