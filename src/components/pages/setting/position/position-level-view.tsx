import { LabelGroup } from '@/components/ui/custom/form';
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
    <div className="flex flex-col gap-3">
      {levels.map((level, index) => (
        <div key={index} className="w-full h-full border rounded-md py-5 px-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <div className="bg-yellow-500 h-6 w-6 rounded-md text-white text-center">
                {index + 1}
              </div>
              <h1 className="font-semibold text-lg">Level</h1>
            </div>
          </div>
          <div className="text-sm mt-5">
            <LabelGroup label="ชื่อระดับ" value={level.name} />
          </div>
          <div className="text-sm mt-5">
            <LabelGroup label="คำอธิบาย" value={level.description || '-'} />
          </div>
        </div>
      ))}
    </div>
  );
};
export default PositionLevelView;
