'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IOptions } from '@/types/dropdown';
import { TaskOptions } from '@/types/setting/project';
import { UseFormReturn } from 'react-hook-form';
import { CreateProjectSchemaType, EditProjectSchemaType } from './schema';
import { MultiSelect } from '@/components/ui/multi-select';
import { useEffect, useState } from 'react';

export interface ProjectMemberTableProps {
  form: UseFormReturn<EditProjectSchemaType | CreateProjectSchemaType>;
  typeOption: IOptions[];
  taskOption: TaskOptions[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModalAddMultipleTask({
  form,
  typeOption,
  taskOption,
  open,
  onOpenChange,
}: ProjectMemberTableProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const groupedOptions = typeOption
    .map((type) => ({
      heading: type.label,
      value: type.value,
      options: taskOption
        .filter((task) => task.type === type.value)
        .map((task) => ({
          label: task.label,
          value: task.value,
        })),
    }))
    .filter((e) => e.options.length > 0);

  const handleAddMultipleTaskType = () => {
    form.setValue('main_task_type', []);
    selectedValues.forEach((value) => {
      const task = taskOption.find((task) => task.value === value);
      if (task) {
        const type = typeOption.find((type) => type.value === task.type);
        if (type) {
          const taskType = {
            name: task.label,
            type: task.type,
            task_type_id: task.value,
            description: '',
          };
          form.setValue('main_task_type', [...form.getValues('main_task_type'), taskType]);
        }
      }
    });
    onOpenChange(false);
  };

  useEffect(() => {
    if (form.getValues('main_task_type') && form.getValues('main_task_type').length > 0)
      setSelectedValues(form.getValues('main_task_type').map((e) => e.task_type_id!));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>เพิ่มข้อมูล</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">เพิ่มข้อมูลประเภทงาน</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <MultiSelect
            variant={'secondary'}
            options={groupedOptions}
            placeholder="เลือกประเภทงาน..."
            className="w-full"
            deduplicateOptions={true}
            modalPopover={true}
            onValueChange={setSelectedValues}
            defaultValue={selectedValues}
            value={selectedValues}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">ยกเลิก</Button>
          </DialogClose>
          <Button onClick={handleAddMultipleTaskType}>บันทึก</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
