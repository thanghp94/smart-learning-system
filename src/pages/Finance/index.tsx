
import React, { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import FinanceForm from "./FinanceForm";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Finance = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const handleAddFinance = (data: any) => {
    console.log("Adding finance entry:", data);
    
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

  const renderFinanceForm = () => {
    return <FinanceForm onSubmit={handleAddFinance} />;
  };

  return (
    <>
      <PlaceholderPage
        title="Tài Chính"
        description="Quản lý thu chi tài chính"
        icon={<CreditCard className="h-16 w-16 text-muted-foreground/40" />}
        addButtonAction={handleAddClick}
      />
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm mới khoản thu chi</DialogTitle>
          </DialogHeader>
          {renderFinanceForm()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Finance;
