'use client';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../../avatar';
import { getFirstCharacter } from '@/lib/functions/string-format';

export type UserAvatarProps = {
  id?: string;
  name: string;
  is_active: boolean;
  size?: 'default' | 'sm' | 'lg';
  className?: string;
};

const UserAvatar = ({ name, is_active = false, size = 'lg', className }: UserAvatarProps) => {
  return (
    <Avatar size={size} className={cn('cursor-pointer hover:scale-110 ', className)}>
      <AvatarImage src={`${process.env.NEXT_PUBLIC_DICEBEAR_URL}${name.trim()}`} alt={name} />
      <AvatarFallback className={is_active ? 'bg-primary' : 'bg-muted'}>
        {getFirstCharacter(name)}
      </AvatarFallback>
    </Avatar>
  );
};
export default UserAvatar;
