import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type LabelGroupProps = {
  label: string;
  value: string | number | null | undefined;
  className?: string;
  children?: React.ReactNode;
};
const LabelGroup = ({ label, value, children, className = '' }: LabelGroupProps) => {
  return (
    <div className={cn('flex flex-col w-full', className)}>
      <Label className="text-label text-sm text-[#999999]">{label}</Label>
      {children ? (
        (children as React.ReactNode)
      ) : (
        <Label className="select-text break-all flex-wrap text-base">{value || '-'}</Label>
      )}
    </div>
  );
};

export default LabelGroup;
