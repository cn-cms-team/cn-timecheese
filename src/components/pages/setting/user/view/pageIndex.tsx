'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { UserList } from '../user-list';
import { createColumns } from '../user-list-columns';
import { useEffect, useState } from 'react';
import { IUser } from '@/types/setting/user';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

const UserButton = (): React.ReactNode => {
  return (
    <div>
      <Button className="btn btn-outline-primary font-bold" onClick={() => console.log('Add User')}>
        <UserPlus className="w-4 h-4" />
        เพิ่มผู้ใช้งาน
      </Button>
    </div>
  );
};

const UserListView = () => {
  const fetchUsersUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/user`;
  const [userList, setUserList] = useState<IUser[]>([]);
  const getUsers = async () => {
    const response = await fetch(fetchUsersUrl);
    const result = await response.json();
    return result.data;
  };

  useEffect(() => {
    getUsers().then((data) => {
      console.log('Fetched users:', data);
      setUserList(data);
    });
  }, []);

  const handleOpenDialog = (
    mode: 'edit' | 'delete',
    isActive: boolean,
    id: string,
    data: { email: string }
  ) => {
    if (mode === 'edit') {
      console.log('edit', id, data);
    } else {
      console.log('delete', id, data);
    }
  };

  const columns = createColumns({
    onOpenDialog: handleOpenDialog,
  });

  return (
    <ModuleLayout
      headerTitle={'ผู้ใช้งาน'}
      headerButton={<UserButton />}
      content={<UserList columns={columns} data={userList} />}
    ></ModuleLayout>
  );
};
export default UserListView;
