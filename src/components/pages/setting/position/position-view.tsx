import { useEffect, useState } from 'react';
import PositionLevelView from './position-level-view';
import { IPosition } from '@/types/setting/position';
import { LabelGroup } from '@/components/ui/custom/form';
import { TitleGroup } from '@/components/ui/custom/cev';

const PositionViewDetail = ({
  id,
  onDataLoaded,
}: {
  id: string;
  onDataLoaded: (name: string) => void;
}): React.ReactNode => {
  const [positionData, setPositionData] = useState<IPosition>();
  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        const response = await fetch(`/api/v1/setting/position/${id}`, { method: 'GET' });
        if (response.ok) {
          const result = await response.json();
          const data = result.data;
          setPositionData(data);
          onDataLoaded(data.name);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    if (id) {
      fetchPositionData();
    }
  }, []);
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:px-10 lg:py-10">
      <div className="w-full h-fit border px-6 py-5 rounded-lg shadow-sm">
        <TitleGroup title="ข้อมูลตำแหน่ง" />
        <div className="flex flex-col gap-5 mt-4">
          <LabelGroup label="ชื่อตำแหน่ง" value={positionData?.name} />
          <LabelGroup label="คำอธิบาย" value={positionData?.description} />
        </div>
      </div>
      <div className="w-full h-full border px-6 py-5 rounded-lg shadow-sm">
        <TitleGroup title="ระดับตำแหน่ง" />
        <PositionLevelView levels={positionData?.levels || []} />
      </div>
    </div>
  );
};
export default PositionViewDetail;
