'use client';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Header, HeaderTitle } from '../ui/custom/header';

interface LayoutProps {
  headerTitle: string;
  leaveUrl?: string | undefined;
  headerButton: React.ReactNode;
  content: React.ReactNode;
}
const ModuleLayout: React.FC<LayoutProps> = ({ headerTitle, leaveUrl, headerButton, content }) => {
  return (
    <div className="p-3">
      <Card className="w-full p-0">
        <CardTitle>
          <Header>
            <HeaderTitle title={headerTitle} leaveUrl={leaveUrl} />
            {headerButton}
          </Header>
        </CardTitle>
        <CardContent className="p-3 pb-10">{content}</CardContent>
      </Card>
    </div>
  );
};
export default ModuleLayout;
