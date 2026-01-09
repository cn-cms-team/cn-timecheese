import UserAvatar, { UserAvatarProps } from '@/components/ui/custom/avatar/user-avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';
import { useState } from 'react';
import { IOption } from '@/types/option';

const ReportUsersButton = ({
  userList,
  onClick,
}: {
  userList: (IOption & UserAvatarProps)[];
  onClick: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!userList || userList.length === 0) return null;
  return (
    <div className="flex">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="rounded-full bg-primary/50">
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full max-h-[350px] overflow-y-auto">
          {userList.map((user, index) => (
            <div
              className="flex items-center gap-2 p-2 cursor-pointer"
              key={index}
              onClick={() => {
                setIsOpen(false);
                onClick(user.value as string);
              }}
            >
              <UserAvatar name={user.name} is_active={user.is_active} />
              <span className="text-truncate">{user.name}</span>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ReportUsersButton;
