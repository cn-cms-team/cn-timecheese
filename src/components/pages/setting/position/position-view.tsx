import { useEffect, useState } from 'react';
import PositionLevelView from './position-level-view';
import { IPosition } from '@/types/setting/position';

const PositionViewDetail = ({ id, onDataLoaded }: { id: string, onDataLoaded: (name: string) => void }): React.ReactNode => {
  const [positionData, setPositionData] = useState<IPosition>();
  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        const response = await fetch(`/api/v1/setting/position/${id}`, { method: 'GET' });
        if (response.ok) {
          const result = await response.json();
          const data = result.data;
          setPositionData(data);
          onDataLoaded(data.name)
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
      <div className="w-full h-fit border px-7 py-5 rounded-sm text-lg">
        <div>
          <h1 className="font-semibold">ข้อมูลตำแหน่ง</h1>
        </div>
        <hr className="mt-1" />
        <div>
          <div>
            <h1 className="text-gray-500 mt-10">ชื่อตำแหน่ง</h1>
            <p>{positionData?.name}</p>
          </div>
          <div>
            <h1 className="text-gray-500 mt-10">คำอธิบาย</h1>
            <p className="whitespace-pre-wrap">{positionData?.description || '-'}</p>
          </div>
        </div>
      </div>
      <div className="w-full h-full border px-10 py-5 rounded-sm text-lg">
        <div>
          <h1 className="font-semibold">ระดับตำแหน่ง</h1>
        </div>
        <hr className="mt-1" />
        <PositionLevelView levels={positionData?.levels || []} />
      </div>
    </div>
  );
};
export default PositionViewDetail;
