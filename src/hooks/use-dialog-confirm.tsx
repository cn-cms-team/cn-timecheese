'use client';
import { useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/components/context/app-context';

export enum ConfirmType {
  SUBMIT = 'SUBMIT',
  DELETE = 'DELETE',
  ACCEPT = 'ACCEPT',
}
interface IDialogConfirmProps {
  title?: string | React.ReactNode;
  message?: string | React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  confirmType?: ConfirmType;
}

const createPromise = async (): Promise<[Promise<boolean>, (value: boolean) => void]> => {
  let resolver: (value: boolean) => void = undefined!;
  return [
    new Promise<boolean>((resolve) => {
      resolver = resolve;
    }),
    resolver,
  ];
};

const useDialogConfirm = () => {
  const { isLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<{ title: string; message: string }>({
    title: '',
    message: '',
  });
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const getConfirmation = async ({ title, message }: { title?: string; message?: string } = {}) => {
    setState({ title: title ?? '', message: message ?? '' });
    setOpen(true);

    const [promise, resolve] = await createPromise();
    setResolver(() => resolve);
    return promise;
  };

  const onConfirm = (status: boolean) => {
    setOpen(false);
    resolver?.(status);
  };

  const Confirmation = ({
    title,
    message,
    size,
    confirmType = ConfirmType.SUBMIT,
  }: IDialogConfirmProps) => {
    const sizeClass = size ? `sm:max-w-${size}` : 'sm:max-w-md';

    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            onConfirm(false);
          } else {
            setOpen(true);
          }
        }}
      >
        <DialogContent
          className={`p-0 ${sizeClass}`}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader className="p-3 rounded-t bg-gray-300">
            <DialogTitle>{title !== '' && title ? title : state.title}</DialogTitle>
          </DialogHeader>
          <div className="text-start px-3 my-4">
            <div className="text-sm whitespace-pre-wrap break-words">
              {message !== '' && message ? message : state.message}
            </div>
          </div>
          <DialogFooter className="p-3 border-t-1">
            {confirmType !== ConfirmType.ACCEPT && (
              <DialogClose asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onConfirm(false)}
                  disabled={isLoading}
                >
                  ยกเลิก
                </Button>
              </DialogClose>
            )}
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onConfirm(true)}
              disabled={isLoading}
            >
              {confirmType === ConfirmType.DELETE
                ? 'ลบ'
                : confirmType === ConfirmType.ACCEPT
                ? 'ตกลง'
                : 'ยืนยัน'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return [getConfirmation, Confirmation] as const;
};

export default useDialogConfirm;
