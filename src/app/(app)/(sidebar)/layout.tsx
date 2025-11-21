import { SidebarLayout } from '@/components/sidebar-layout';

const SidebarPagesLayout = ({ children }: { children: React.ReactNode }) => {
  return <SidebarLayout>{children}</SidebarLayout>;
};

export default SidebarPagesLayout;
