import { SvgIconProps } from '@/types/ui';

const SvgIcon = ({ width, height, children, className }: SvgIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
    >
      {children}
    </svg>
  );
};

export default SvgIcon;
