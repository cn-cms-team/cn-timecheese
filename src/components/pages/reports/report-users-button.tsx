import UserAvatar, { UserAvatarProps } from '@/components/ui/custom/avatar/user-avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
    <>
      <div className="hidden gap-3 md:flex">
        {userList.map((user, index) => (
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                key={index}
                size="icon"
                className="rounded-full"
                onClick={() => onClick(user.value as string)}
              >
                <UserAvatar name={user.name} image={user.image} is_active={user.is_active} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex md:hidden">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="rounded-full bg-primary/50">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {userList.map((user, index) => (
              <div
                className="flex items-center gap-2 p-2 cursor-pointer"
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  onClick(user.value as string);
                }}
              >
                <UserAvatar name={user.name} image={user.image} is_active={user.is_active} />
                <span className="text-truncate">{user.name}</span>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
export default ReportUsersButton;
