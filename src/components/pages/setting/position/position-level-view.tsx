import { IPositionLevel } from '@/types/setting/position';
import { Inbox } from 'lucide-react';

const PositionLevelView = ({ levels }: { levels: IPositionLevel[] }) => {
  if (!levels || levels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Inbox size={48} strokeWidth={1} className="mb-2 opacity-50" />
        <p className="text-sm">ไม่มีข้อมูลระดับตำแหน่ง</p>
      </div>
    );
  }
  return (
    <div>
      {levels.map((level, index) => (
        <div key={index} className="w-full h-full border rounded-sm py-5 px-5 mt-10">
          <div className="flex items-center justify-between0">
            <div className="flex gap-2">
              <span className="bg-yellow-500 px-2 rounded-md text-white">{index + 1}</span>
              <h1>Level</h1>
            </div>
          </div>
          <div className="text-sm mt-5">
            <h1 className="text-gray-500">ชื่อระดับ</h1>
            <p>{level.name}</p>
          </div>
          <div className="text-sm mt-5">
            <h1 className="text-gray-500 mt-5 ">คำอธิบาย</h1>
            <p className="whitespace-pre-wrap">{level.description || '-'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default PositionLevelView;
