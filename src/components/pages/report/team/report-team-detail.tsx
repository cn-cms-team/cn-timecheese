import AvatarDetail from '@/components/ui/custom/avatar/user-detail';
import ReportTeamProject from './report-team-project';
import { IReportTeam, IUserReportProject } from '@/types/report/team';
import Image from 'next/image';

const ReportTeamDetail = ({ user, projects }: IReportTeam) => {
  return (
    <div className="flex flex-col gap-5">
      <AvatarDetail
        name={`${user.first_name} ${user.last_name}`}
        position={user.position_level?.name}
        code={user?.code}
        start_date={user?.start_date}
        salary_range={user?.salary_range}
      />
      <div className="flex flex-col gap-4 border-t py-4">
        <h3 className="text-lg font-medium">โครงการที่รับผิดชอบ</h3>
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 justify-start gap-3">
            {projects.map((project: IUserReportProject, index: number) => (
              <ReportTeamProject key={index} {...project} />
            ))}
          </div>
        ) : (
          <div className="flex border w-full h-60 items-center justify-center">
            <Image
              src="/img/general/md-no-data.png"
              width={150}
              height={150}
              alt="Nodata"
              className="mx-auto opacity-60"
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default ReportTeamDetail;
