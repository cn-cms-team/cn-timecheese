import { SidebarTrigger } from '@/components/ui/sidebar';

type HeaderProps = {
  children: React.ReactNode;
};

const Header = ({ children }: HeaderProps) => {
  return (
    <div className="flex flex-row items-center px-4 gap-2 h-13 shrink-0 bg-white shadow-sm sticky top-0 z-1">
      <SidebarTrigger className="-ml-1 md:hidden flex" />
      <div className="flex-1 flex items-center justify-between">{children}</div>
    </div>
  );
};

export default Header;
