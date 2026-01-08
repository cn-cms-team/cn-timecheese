import { Badge } from '@/components/ui/badge';

type BadgeTableProps = {
  text: string;
  type: 'activate' | 'deactivate';
};
const BadgeTable = ({ text, type }: BadgeTableProps) => {
  let bgStatusClass = 'bg-green-500';
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'activate': {
        bgStatusClass = 'bg-green-500';
        return 'text-green-700 bg-green-50 border-green-200';
      }
      case 'deactivate': {
        bgStatusClass = 'bg-gray-500';
        return '';
      }
      default: {
        bgStatusClass = '';
        return '';
      }
    }
  };

  const badgeColor = getBadgeColor(type);
  const fullClass = `rounded-md ${badgeColor}`;
  return (
    <Badge variant={'outline'} className={fullClass}>
      <div className={`w-2 h-2 rounded-sm ${bgStatusClass}`} />
      {text}
    </Badge>
  );
};

export default BadgeTable;
