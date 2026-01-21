import { useEffect, useState } from 'react';
import PositionLevelView from './position-level-view';
import { IPosition } from '@/types/setting/position';
import { LabelGroup } from '@/components/ui/custom/form';
import { TitleGroup } from '@/components/ui/custom/cev';
import { useAccount, useLoading } from '@/components/context/app-context';
import { createColumns } from './position-list-columns';
import { createLevelListColumns } from './position-level-list-column';

const PositionViewDetail = ({
  id,
  onDataLoaded,
}: {
  id: string;
  onDataLoaded: (name: string) => void;
}): React.ReactNode => {
  const { setIsLoading } = useLoading();
  const [positionData, setPositionData] = useState<IPosition>();
  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/setting/position/${id}`, { method: 'GET' });
        if (response.ok) {
          const result = await response.json();
          const data = result.data;
          setPositionData(data);
          onDataLoaded(data.name);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchPositionData();
    }
  }, []);

  const columns = createLevelListColumns();

  return (
    <div className="w-full grid grid-cols-1 ">
      <div className="w-full px-6 py-5 ">
        <TitleGroup title="ข้อมูลตำแหน่ง" />
        <div className="flex flex-col gap-5 mt-4">
          <LabelGroup label="ชื่อตำแหน่ง" value={positionData?.name} />
          <LabelGroup label="คำอธิบาย">
            <span className="whitespace-break-spaces">{positionData?.description}</span>
          </LabelGroup>
        </div>
      </div>
      <div className="w-full h-full px-6 py-5 ">
        <TitleGroup title="ระดับตำแหน่ง" />
        <PositionLevelView levels={positionData?.levels || []} columns={columns} />
      </div>
    </div>
  );
};
export default PositionViewDetail;
