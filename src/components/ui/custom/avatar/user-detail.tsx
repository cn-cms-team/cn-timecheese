import { calcTotalYearAndMonth } from '@/lib/functions/date-format';
import { numberWithCommas } from '@/lib/functions/number-format';
import { getFirstCharacter } from '@/lib/functions/string-format';

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
        className="w-32 h-32 rounded-full"
        src={`${process.env.NEXT_PUBLIC_DICEBEAR_URL}${name.trim()}`}
        alt={name}
      />
      <div className="flex flex-col justify-between gap-3">
        <div className="text-lg font-bold">{name}</div>
        <div className="text-normal  font-bold">{position || '-'}</div>
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
