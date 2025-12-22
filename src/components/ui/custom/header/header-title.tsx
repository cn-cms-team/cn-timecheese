'use client';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

type HeaderTitleProps = {
  title: string;
  leaveUrl?: string | undefined;
};
const HeaderTitle = ({ title, leaveUrl }: HeaderTitleProps) => {
  const router = useRouter();

  const handleCancel = async () => {
    router.push(`${leaveUrl ?? '/'}`);
  };

  return (
    <div className="flex items-center gap-2">
      {!!leaveUrl && (
        <Button
          variant={'default'}
          className="bg-primary rounded-[6px] h-8 w-8"
          onClick={handleCancel}
        >
          <ChevronLeft />
        </Button>
      )}
      <h2 className="text-2xl font-bold line-clamp-1 noto-sans">{title}</h2>
    </div>
  );
};

export default HeaderTitle;
