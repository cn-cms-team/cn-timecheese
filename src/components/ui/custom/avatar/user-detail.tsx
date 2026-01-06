import { formatDate } from '@/lib/functions/date-format';
import { numberWithCommas } from '@/lib/functions/number-format';
import { getFirstCharacter } from '@/lib/functions/string-format';

export type UserAvatarDetailProps = {
  name: string;
  image: string;
  position: string;
  code: string;
  start_date: string;
  salary_range?: string;
};

const AvatarDetail = ({
  name,
  image,
  position,
  code,
  start_date,
  salary_range,
}: UserAvatarDetailProps) => {
  return (
    <div className="flex w-full px-4 py-3 gap-4">
      {image ? (
        <img className="w-32 h-32 rounded-full" src={image} alt={name} />
      ) : (
        <div className="flex w-32 h-32 rounded-full font-bold text-6xl items-center justify-center border-2 text-primary-foreground bg-primary">
          {getFirstCharacter(name)}
        </div>
      )}
      <div className="flex flex-col justify-between gap-3">
        <div className="text-lg">{name}</div>
        <div className="text-normal">{position || '-'}</div>
        <div className="flex gap-3 text-normal">
          <span>{code}</span>
          <span>{start_date ? formatDate(start_date) : '-'}</span>
        </div>
      </div>
      {salary_range && (
        <div className="flex flex-col justify-end ms-auto">
          <div className="text-normal mb-3">เงินเดือนโดยประมาณ</div>
          <div className="text-normal">{numberWithCommas(Number(salary_range))}</div>
        </div>
      )}
    </div>
  );
};
export default AvatarDetail;
