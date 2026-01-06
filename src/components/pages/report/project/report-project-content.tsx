import Dropdown from '@/components/ui/custom/input/dropdown';

import { IOptions } from '@/types/dropdown';
import { useEffect, useState } from 'react';

const ReportProjectContent = () => {
  const [projectId, setProjectId] = useState<string>(null!);
  const [projectOptions, setProjectOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch('/api/v1/report/project/project-list');
      const data = await response.json();
      setProjectOptions(data.data as IOptions[]);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await fetch(`/api/v1/report/project/member-list?project_id=${projectId}`);
      const data = await response.json();
      setProjectOptions(data.data as IOptions[]);
    };
    fetchMembers();
  }, [projectId]);

  return (
    <div className="flex flex-col gap-3">
      <div className="w-1/3">
        <Dropdown
          value={projectId}
          options={projectOptions}
          canSearch
          onChange={(value) => setProjectId(value)}
          isAllPlaceHolder={false}
          placeholder="เลือกโครงการ"
        />
      </div>
    </div>
  );
};
export default ReportProjectContent;
