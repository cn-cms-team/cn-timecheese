'use client';

import { TableHeader, TableRow, TableHead, TableBody, Table } from '@/components/ui/table';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableRow from '../position-sortable-row';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { CreatePositionSchemaType, EditPositionSchemaType } from '../schema';
import { Button } from '@/components/ui/button';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { id } from 'date-fns/locale';
import router from 'next/router';
import { toast } from 'sonner';
import { useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface IProps {
  form: UseFormReturn<CreatePositionSchemaType | EditPositionSchemaType>;
}

const PositionFormTable = ({ form }: IProps) => {
  const [confirmState, setConfirmState] = useState<{
    title: string;
    message: string;
    confirmType?: ConfirmType;
  }>({
    title: '',
    message: '',
    confirmType: ConfirmType.SUBMIT,
  });

  const { fields, move, append, remove } = useFieldArray({ control: form.control, name: 'levels' });
  const [getConfirmation, Confirmation] = useDialogConfirm();

  const onDeleteLevel = async (index: number, name: string) => {
    const level = form.getValues(`levels.${index}`);
    if (!level.id) {
      remove(index);
      return;
    }
    setConfirmState({
      title: 'ลบข้อมูล',
      message: `คุณยืนยันที่จะลบข้อมูลระดับตำแหน่ง : ${name} ใช่หรือไม่ ?`,
      confirmType: ConfirmType.DELETE,
    });
    const result = await getConfirmation();
    if (result) {
      remove(index);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);

    move(oldIndex, newIndex);
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );
  return (
    <>
      <div className="border rounded-lg overflow-x-auto overflow-y-auto max-w-full">
        <ScrollArea>
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow className="bg-[#f2f4f7]">
                  <TableHead className="w-10"></TableHead>
                  <TableHead>ระดับ</TableHead>
                  <TableHead>ชื่อระดับ</TableHead>
                  <TableHead>คำอธิบาย</TableHead>
                  <TableHead>จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={fields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {fields.map((field, index) => (
                    <SortableRow
                      key={field.id}
                      id={field.id}
                      index={index}
                      form={form}
                      onDelete={onDeleteLevel}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Button className="mt-2" type="button" onClick={() => append({ name: '', description: '' })}>
        เพิ่มระดับตำแหน่ง
      </Button>
      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </>
  );
};

export default PositionFormTable;
