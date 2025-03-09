
import React, { useState, useEffect } from "react";
import { FileSignature, Plus } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import RequestForm from "./RequestForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { requestService } from "@/lib/supabase";
import RequestsTable from "./RequestsTable";

const Requests = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await requestService.getAll();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu đề xuất",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRequest = async (data) => {
    try {
      const requestData = {
        title: data.title,
        description: data.description,
        requester: data.requester,
        priority: data.priority,
        status: "Pending",
      };

      await requestService.create(requestData);
      
      toast({
        title: "Thành công",
        description: "Đã thêm đề xuất mới",
      });
      
      setShowDialog(false);
      fetchRequests(); // Refresh the data
    } catch (error) {
      console.error("Error adding request:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm đề xuất mới",
        variant: "destructive",
      });
    }
  };

  const renderRequestForm = () => {
    return <RequestForm onSubmit={handleAddRequest} />;
  };

  return (
    <>
      {requests.length === 0 ? (
        <PlaceholderPage
          title="Đề Xuất"
          description="Quản lý các đề xuất xin phép"
          icon={<FileSignature className="h-16 w-16 text-muted-foreground/40" />}
          renderForm={renderRequestForm}
        />
      ) : (
        <RequestsTable 
          requests={requests} 
          isLoading={isLoading} 
          onAddRequest={() => setShowDialog(true)}
        />
      )}
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm mới đề xuất</DialogTitle>
          </DialogHeader>
          {renderRequestForm()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Requests;
