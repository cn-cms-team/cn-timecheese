import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

type ButtonEditProps = {
  editLink?: string;
  onClick?: () => void;
};
const ButtonEdit = ({ editLink, onClick = () => {} }: ButtonEditProps) => {
  return !editLink ? (
    <Button variant="outline" className="bg-white hover:bg-gray-100" onClick={onClick}>
      <Pencil />
    </Button>
  ) : (
    <Link href={editLink}>
      <Button variant="outline" className="bg-white hover:bg-gray-100">
        <Pencil />
      </Button>
    </Link>
  );
};

export default ButtonEdit;
