
import React, { useState } from "react";
import { FileText, Plus } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import FileForm from "./FileForm";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Files = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const handleAddFile = (data: any) => {
    console.log("Adding file:", data);
    
    // For now just show a toast and close the dialog
    toast({
      title: "Thông báo",
      description: "Chức năng đang được phát triển",
    });
    setShowDialog(false);
  };

  const handleAddClick = () => {
    setShowDialog(true);
  };

  const renderFileForm = () => {
    return <FileForm onSubmit={handleAddFile} />;
  };

  return (
    <>
      <PlaceholderPage
        title="Hồ Sơ"
        description="Quản lý hồ sơ tài liệu"
        icon={<FileText className="h-16 w-16 text-muted-foreground/40" />}
        addButtonAction={handleAddClick}
      />
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm mới hồ sơ</DialogTitle>
          </DialogHeader>
          {renderFileForm()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Files;
