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
          <Button type="button" variant={'default'}>
            <User className="h-4 w-4" />
            เลือกสมาชิกในทีม
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full max-h-87.5 overflow-y-auto">
          {userList.map((user, index) => (
            <div
              className="flex items-center gap-2 p-2 cursor-pointer"
              key={index}
              onClick={() => {
                setIsOpen(false);
                onClick(user.value as string);
              }}
            >
              <UserAvatar
                id={user.value as string}
                name={user.name}
                is_active={user.is_active}
                size="sm"
              />
              <span className="text-truncate">{user.name}</span>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ReportUsersButton;
