'use client';
import { useLoading } from '@/components/context/app-context';
import { calcTotalYearAndMonth } from '@/lib/functions/date-format';
import { numberWithCommas } from '@/lib/functions/number-format';

export type UserAvatarDetailProps = {
  name: string;
  position: string;
  code: string;
  start_date: string;
  salary_range?: string;
};

const AvatarDetail = ({
  name,
  position,
  code,
  start_date,
  salary_range,
}: UserAvatarDetailProps) => {
  return (
    <div className="flex w-full px-4 py-3 gap-4">
      <img
        className="w-32 h-32 rounded-full bg-gray-400"
        src={name != '' ? `${process.env.NEXT_PUBLIC_DICEBEAR_URL}${name.trim()}` : ''}
        loading="lazy"
      />
      <div className="flex flex-col justify-between gap-3">
        <div className="flex flex-col">
          <div className="text-lg font-bold">{name}</div>
          <div className="text-normal font-medium text-gray-500">{position || '-'}</div>
        </div>
        <div className="flex gap-3 text-normal  font-bold">
          <span>{code}</span>
          <span>
            {start_date ? calcTotalYearAndMonth(start_date, new Date().toISOString()) : '-'}
          </span>
        </div>
      </div>
      {salary_range && (
        <div className="flex flex-col justify-end ms-auto">
          <div className="text-normal mb-3 font-bold">เงินเดือนโดยประมาณ</div>
          <div className="text-normal font-bold">{numberWithCommas(Number(salary_range))}</div>
        </div>
      )}
    </div>
  );
};
export default AvatarDetail;
