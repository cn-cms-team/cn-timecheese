import ModuleLayout from '@/components/layouts/ModuleLayout';

const UserButton = (): React.ReactNode => {
  return <div>Button</div>;
};

const UserContent = (): React.ReactNode => {
  return <div>Content</div>;
};

const UserListView = () => {
  return (
    <ModuleLayout
      headerTitle={'ผู้ใช้งาน'}
      headerButton={<UserButton />}
      content={<UserContent />}
    ></ModuleLayout>
  );
};
export default UserListView;
