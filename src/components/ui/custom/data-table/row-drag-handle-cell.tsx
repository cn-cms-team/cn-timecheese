'use client';

import { useSortable } from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';

const RowDragHandleCell = ({ rowId }: { rowId: string | number }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });
  return (
    <button className="cursor-grab" {...attributes} {...listeners}>
      <GripVertical />
    </button>
  );
};

export default RowDragHandleCell;
