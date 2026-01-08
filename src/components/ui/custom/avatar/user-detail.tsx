'use client';
import { calcTotalYearAndMonth } from '@/lib/functions/date-format';
import { numberWithCommas } from '@/lib/functions/number-format';
import { Skeleton } from '../../skeleton';

export type UserAvatarDetailProps = {
  name: string;
  position: string;
  code: string;
  start_date: string;
  salary_range?: string;
  loading?: boolean;
};

const AvatarDetail = ({
  name,
  position,
  code,
  start_date,
  salary_range,
  loading = false,
}: UserAvatarDetailProps) => {
  return (
    <div className="flex w-full px-4 py-3 gap-4">
      {loading ? (
        <Skeleton className="w-32 h-32 rounded-full bg-gray-400" />
      ) : (
        <img
          className="w-32 h-32 rounded-full bg-gray-400"
          src={`${process.env.NEXT_PUBLIC_DICEBEAR_URL}${name.trim()}`}
          loading="lazy"
        />
      )}
      <div className="flex flex-col justify-between gap-3">
        <div className="flex flex-col">
          {loading ? (
            <Skeleton className="w-28 h-6 bg-gray-400 mb-3" />
          ) : (
            <div className="text-lg font-bold">{name}</div>
          )}
          {loading ? (
            <Skeleton className="w-20 h-4 bg-gray-400" />
          ) : (
            <div className="text-normal font-medium text-gray-500">{position || '-'}</div>
          )}
        </div>
        {loading ? (
          <Skeleton className="w-36 h-4 bg-gray-400"></Skeleton>
        ) : (
          <div className="flex gap-3 text-normal  font-bold">
            <span>{code}</span>
            <span>
              {start_date ? calcTotalYearAndMonth(start_date, new Date().toISOString()) : '-'}
            </span>
          </div>
        )}
      </div>
      {salary_range && !loading && (
        <div className="flex flex-col justify-end ms-auto">
          <div className="text-normal mb-3 font-bold">เงินเดือนโดยประมาณ</div>
          <div className="text-normal font-bold">{numberWithCommas(Number(salary_range))}</div>
        </div>
      )}
    </div>
  );
};
export default AvatarDetail;
