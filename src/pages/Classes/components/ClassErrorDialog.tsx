
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface ClassErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage: string;
  onInitializeDatabase: () => Promise<void>;
}

const ClassErrorDialog: React.FC<ClassErrorDialogProps> = ({ 
  open, 
  onOpenChange, 
  errorMessage, 
  onInitializeDatabase 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lỗi</DialogTitle>
          <DialogDescription>
            {errorMessage}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={onInitializeDatabase}>Khởi tạo lại cơ sở dữ liệu</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClassErrorDialog;
