'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TitleGroup from '@/components/ui/custom/cev/title-group';
import LabelGroup from '@/components/ui/custom/form/label-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getIsActive } from '@/lib/functions/enum-mapping';
import { TeamApiResponse, TeamMember } from '@/types/setting/team';
import { ITeam } from '@/types/setting/team';
import { useEffect, useState } from 'react';

const TeamViewDetail = ({ id }: { id: string }): React.ReactNode => {
  const [teamData, setTeamData] = useState<ITeam>();
  const [membersOrder, setMembersOrder] = useState<TeamMember[]>([]);
  useEffect(() => {
    const fetchTeamData = async (teamId: string) => {
      try {
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
                checked={teamData?.isActive as boolean}
                aria-readonly
                disabled
                className="disabled:opacity-80"
                id="is-team-active"
              />
              <Label htmlFor="is-team-active" className="peer-disabled:opacity-80 text-base">
                {getIsActive(teamData?.isActive as boolean)}
              </Label>
            </div>
          </LabelGroup>{' '}
        </div>
        <LabelGroup label="คำอธิบาย" value={teamData?.description} />
        {id && (
          <div>
            <h2 className="font-medium text-lg mb-0">การจัดการสมาชิก</h2>
            <hr className="mt-2 mb-5" />
            <Card className="w-full max-w-full">
              <CardHeader>
                <CardTitle>ทีม</CardTitle>
                <hr className="mt-2 mb-5" />
                <CardContent>
                  <div className="overflow-x-auto">
                    {membersOrder.length === 0 ? (
                      <p className="text-center text-gray-400 font-semibold text-lg">
                        ไม่มีสมาชิกในทีมนี้
                      </p>
                    ) : (
                      <table className="w-full table-auto border-collapse">
                        <thead>
                          <tr className="">
                            <th className="text-left px-3 py-2 border-b w-[80%]">ชื่อสมาชิก</th>
                            <th className="text-center px-3 py-2 border-b w-[20%]">จัดการสมาชิก</th>
                          </tr>
                        </thead>
                        <tbody>
                          {membersOrder.map((item) => (
                            <tr key={item.id} className="odd:bg-card even:bg-card/50">
                              <td className="px-3 py-2 align-middle w-[80%]">
                                <span className="font-medium">{item.name}</span>
                                <div className="text-sm text-muted-foreground">
                                  {teamData?.name}
                                </div>
                              </td>
                              <td className="px-3 py-2 align-middle text-center w-[20%]">
                                <label className="inline-flex items-center space-x-2 justify-end">
                                  <Switch
                                    checked={item.isManager}
                                    aria-readonly
                                    disabled
                                    className="disabled:opacity-80"
                                    id="is-team-active"
                                  />
                                </label>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
export default TeamViewDetail;
