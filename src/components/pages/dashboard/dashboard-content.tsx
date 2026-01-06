'use client';

import { useDashboardContext } from './view/dashboard-use-context';

import DashboardBarChart from './dashboard-bar-chart';
import DonutChartTimesheet from '@/components/ui/custom/report/donut-chart-timesheet';
import TableListTimesheet from '@/components/ui/custom/report/table-list-timesheet';
import CardProjectInfo from '@/components/ui/custom/report/card-project-info';
import { IProjectInfoByUser } from '@/types/report';

const DashboardContent = () => {
  const mockTimeSheetDonutChart = [
    {
      task_type: 'Frontend Development',
      tracked_hours: 172800,
    },
    {
      task_type: 'Backend Development',
      tracked_hours: 216000,
    },
    {
      task_type: 'Bug Fixing',
      tracked_hours: 108900,
    },
    {
      task_type: 'Code Review',
      tracked_hours: 54000,
    },
    {
      task_type: 'Testing & QA',
      tracked_hours: 72500,
    },
    {
      task_type: 'DevOps / Deployment',
      tracked_hours: 36500,
    },
    {
      task_type: 'Meeting & Planning',
      tracked_hours: 90000,
    },
  ];

  return (
    <div className="w-full gap-3 flex flex-col">
      <DashboardBarChart />
      <CardProjectInfo project={{} as IProjectInfoByUser} />
      <DonutChartTimesheet donutLabel={mockTimeSheetDonutChart} donutHeight={250} />
      <TableListTimesheet />
    </div>
  );
};

export default DashboardContent;
