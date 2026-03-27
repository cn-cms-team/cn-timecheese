import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface MusicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MusicModal = ({ open, onOpenChange }: MusicModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Music</DialogTitle>
        </DialogHeader>

        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Music modal is ready. You can plug playlist and player controls here.
        </div>

        <DialogFooter showCloseButton>
          <></>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MusicModal;
