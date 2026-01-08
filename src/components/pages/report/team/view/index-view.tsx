'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import ReportTeamDetail from '../report-team-detail';
import { UserAvatarProps } from '@/components/ui/custom/avatar/user-avatar';
import { useEffect, useState } from 'react';
import { IOption } from '@/types/option';
import { fetcher } from '@/lib/fetcher';
import { useSession } from 'next-auth/react';
import { IReportTeam } from '@/types/report/team';
import ReportUsersButton from '../../report-users-button';
import { useRouter } from 'next/navigation';

const ReportTeamView = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [userList, setUserList] = useState<(IOption & UserAvatarProps)[]>([]);
  const [userReport, setUserReport] = useState<IReportTeam | null>(null);

  useEffect(() => {
    const fetchTeamsOptions = async () => {
      try {
        const prefix = process.env.NEXT_PUBLIC_APP_URL;
        const user = await fetcher<(IOption & UserAvatarProps)[]>(
          `${prefix}/api/v1/master/team/member`
        );
        setUserList(
          user.map((item) => ({
            ...item,
            name: item.label,
            image: '',
            is_active: item.value === session?.user.id,
          }))
        );

        getUserReport(session?.user.id as string);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchTeamsOptions();
  }, []);

  const getUserReport = async (id: string) => {
    try {
      const params = new URLSearchParams();
      params.set('user_id', id || '');
      const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/report/team?${params.toString()}`;
      const data = await fetcher<IReportTeam>(url);
      if (data) {
        setUserReport(data);
      }
    } catch (error) {
      router.push('/');
    }
  };

  const onClickUser = (id: string) => {
    setUserList(
      userList.map((u) => ({
        ...u,
        is_active: u.value === id,
      }))
    );
    getUserReport(id);
  };

  return (
    <ModuleLayout
      headerTitle={'รายงานสรุปทีม'}
      headerButton={<ReportUsersButton onClick={onClickUser} userList={userList} />}
      content={userReport ? <ReportTeamDetail {...userReport!} /> : <></>}
    ></ModuleLayout>
  );
};
export default ReportTeamView;
