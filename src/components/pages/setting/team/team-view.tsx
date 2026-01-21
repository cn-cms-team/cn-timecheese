'use client';

import { useLoading } from '@/components/context/app-context';
import { Card, CardContent } from '@/components/ui/card';
import TitleGroup from '@/components/ui/custom/cev/title-group';
import LabelGroup from '@/components/ui/custom/form/label-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getIsActive } from '@/lib/functions/enum-mapping';
import { TeamApiResponse, TeamMember } from '@/types/setting/team';
import { ITeam } from '@/types/setting/team';
import { useEffect, useState } from 'react';

const TeamViewDetail = ({ id }: { id: string }): React.ReactNode => {
  const { setIsLoading } = useLoading();
  const [teamData, setTeamData] = useState<ITeam>();
  const [membersOrder, setMembersOrder] = useState<TeamMember[]>([]);
  const header = [
    { label: 'สมาชิก', className: 'text-start min-w-[300px]' },
    { label: 'สิทธิ์การเห็นข้อมูลสมาชิกในทีม', className: 'text-center' },
  ];
  useEffect(() => {
    const fetchTeamData = async (teamId: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/setting/team/${teamId}`, { method: 'GET' });
        const result = await response.json();
        if (response.ok) {
          setTeamData(result.data);
          const teamObj = result.data as TeamApiResponse | null;
          if (teamObj) {
            const users: TeamMember[] = teamObj.users ?? [];
            setMembersOrder(users);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchTeamData(id);
    }
  }, [id]);

  return (
    <div className="cev-box">
      <TitleGroup title="ข้อมูลทีม" />
      <div className="flex flex-col px-8 gap-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LabelGroup label="ชื่อ" value={teamData?.name} />
          <LabelGroup label="สถานะการใช้งาน" value="">
            <div className="flex items-center space-x-2">
              <Switch
                checked={teamData?.is_active as boolean}
                aria-readonly
                disabled
                className="disabled:opacity-80"
                id="is-team-active"
              />
              <Label htmlFor="is-team-active" className="peer-disabled:opacity-80 text-base">
                {getIsActive(teamData?.is_active as boolean)}
              </Label>
            </div>
          </LabelGroup>{' '}
        </div>
        <LabelGroup label="คำอธิบาย" value={teamData?.description} />
      </div>
      {id && (
        <div className="mt-6">
          <TitleGroup title="สมาชิกทีม" />
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f2f4f7]">
                  {header.map(({ label, className }) => (
                    <TableHead key={label} className={className}>
                      {label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!membersOrder || membersOrder.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={header.length}
                      className="h-24 text-center text-muted-foreground "
                    >
                      ไม่มีข้อมูล
                    </TableCell>
                  </TableRow>
                ) : (
                  membersOrder &&
                  membersOrder.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <span className="font-medium">{item.name}</span>
                        <div className="text-sm text-muted-foreground">
                          {item?.position_level ? item?.position_level?.name : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Switch
                            checked={item.isManager}
                            aria-readonly
                            disabled
                            className="disabled:opacity-80"
                            id="is-team-active"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};
export default TeamViewDetail;
