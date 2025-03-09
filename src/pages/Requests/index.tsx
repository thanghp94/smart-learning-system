
import React, { useState } from "react";
import { FileSignature, Plus } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import RequestForm from "./RequestForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const Requests = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const handleAddRequest = (data: any) => {
    console.log("Adding request:", data);
    // Here you would call the service to add the request
    // requestService.create(data).then(() => {
    //   // Handle success, refresh data, etc.
    // });
    toast({
      title: "Thành công",
      description: "Đã thêm đề xuất mới",
    });
    setShowDialog(false);
  };

  const renderRequestForm = () => {
    return <RequestForm onSubmit={handleAddRequest} />;
  };

  return (
    <PlaceholderPage
      title="Đề Xuất"
      description="Quản lý các đề xuất xin phép"
      icon={<FileSignature className="h-16 w-16 text-muted-foreground/40" />}
      renderForm={renderRequestForm}
    />
  );
};

export default Requests;
