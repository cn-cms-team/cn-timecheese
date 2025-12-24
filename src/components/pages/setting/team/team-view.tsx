'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LabelGroup from '@/components/ui/custom/form/label-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getIsActive } from '@/lib/functions/enum-mapping';
import { ITeam } from '@/types/setting/team';
import { useEffect, useState } from 'react';

const TeamViewDetail = ({ id }: { id: string }): React.ReactNode => {
  const [teamData, setTeamData] = useState<ITeam>();

  const [membersOrder, setMembersOrder] = useState<
    Array<{ id: string; name: string; isManager: boolean; team: string; team_id: string }>
  >([]);
  const [leadList, setLeadList] = useState<string[]>([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(`/api/v1/setting/team/${id}`, { method: 'GET' });
        if (response.ok) {
          const result = await response.json();
          const teamData = result.data;
          setTeamData(teamData);
          if (teamData) {
            const users: any[] = teamData.users ?? [];
            const teamLeaders: any[] = teamData.teamLeaders ?? [];
            const leaderIds = teamLeaders
              .map((item: any) => {
                if (!item) return null;
                if (typeof item === 'string') return item;
                return item.user_id ?? item.id ?? null;
              })
              .filter(Boolean);

            let mapped = users.map((u: any) => ({
              id: u.id,
              name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim(),
              isManager: leaderIds.includes(u.id),
              team: teamData.name ?? '',
              team_id: teamData.id ?? '',
            }));

            mapped = mapped.sort(
              (a, b) => (b.isManager === true ? 1 : 0) - (a.isManager === true ? 1 : 0)
            );

            setMembersOrder(mapped);
            setLeadList(leaderIds);
          }
        }
      } catch (error) {
        console.error('Failed to fetch Team data:', error);
      }
    };
    if (id) {
      fetchTeamData();
    }
  }, [id]);

  return (
    <div className="flex flex-col px-5">
      <h2 className="font-medium text-lg mb-0">ข้อมูลทีม</h2>
      <hr className="mt-2 mb-5" />
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
                          {membersOrder
                            .slice()
                            .sort(
                              (a, b) =>
                                (leadList.includes(b.id) ? 1 : 0) -
                                (leadList.includes(a.id) ? 1 : 0)
                            )
                            .map((item) => (
                              <tr key={item.id} className="odd:bg-card even:bg-card/50">
                                <td className="px-3 py-2 align-middle w-[80%]">
                                  <span className="font-medium">{item.name}</span>
                                  <div className="text-sm text-muted-foreground">{item.team}</div>
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
