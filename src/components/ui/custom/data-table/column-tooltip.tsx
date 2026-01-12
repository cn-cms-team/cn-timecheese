import React from 'react';
import Tooltips from '../tooltip/tooltip';

type ColumnTooltipProps = {
  children: React.ReactNode;
  minWidth?: number;
};
const ColumnTooltip = ({ children, minWidth = 120 }: ColumnTooltipProps) => {
  if (children === '-') {
    return <div className={`min-w-[${minWidth}px] max-w-[400px]`}>-</div>;
  }
  return (
    <div
      className={`min-w-[${minWidth}px] max-w-[400px] whitespace-normal wrap-break-words line-clamp-2`}
    >
      <Tooltips triggerNode={<div>{children}</div>} contentNode={<p>{children}</p>} />
    </div>
  );
};

export default ColumnTooltip;
