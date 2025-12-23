'use client';

import { cn } from '@/lib/utils';
import { Button } from '../../button';
import { Search } from 'lucide-react';

interface IProps {
  title?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onClick: () => void;
}
const SearchButton = ({
  title = 'ค้นหา',
  className = '',
  size = 'default',
  onClick = () => {},
}: IProps) => {
  return (
    <Button type="button" size={size} variant="default" onClick={onClick}>
      <Search />
      {title}
    </Button>
  );
};

export default SearchButton;
