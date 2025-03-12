import React, { useState, useEffect } from "react";
import { FileSignature, Plus, RotateCw } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import RequestForm from "./RequestForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";
import RequestsTable from "./RequestsTable";

interface RequestData {
  id: string;
  title: string;
  description?: string;
  requester: string;
  status: string;
  priority?: string;
  created_at: string;
  noi_dung?: string;
  ly_do?: string;
  nguoi_de_xuat_id?: string;
  trang_thai?: string;
  ngay_de_xuat?: string;
  request_type?: string;
  type?: string;
}

const Requests = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const { data: requestsData, error: requestsError } = await supabase
        .from('requests')
        .select('*');
      
      if (requestsError) throw requestsError;
      
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('id, ten_nhan_su');
      
      if (employeesError) throw employeesError;
      
      const formattedRequests = (requestsData || []).map((req: any) => {
        const employee = employeesData?.find(e => e.id === req.nguoi_de_xuat_id);
        return {
          ...req,
          requester: employee?.ten_nhan_su || 'Unknown',
          title: req.noi_dung || 'No title',
          description: req.ly_do,
          status: req.trang_thai || 'pending',
          priority: req.priority || 'Medium',
          request_type: req.request_type || 'other'
        };
      });
      
      setRequests(formattedRequests);
      setEmployees(employeesData || []);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu đề xuất",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRequest = async (data: any) => {
    try {
      const requestData = {
        noi_dung: data.title,
        ly_do: data.description,
        nguoi_de_xuat_id: data.requester,
        trang_thai: 'pending',
        ngay_de_xuat: new Date().toISOString().split('T')[0],
        request_type: data.request_type,
        priority: data.priority
      };

      const { error } = await supabase
        .from('requests')
        .insert(requestData);
      
      if (error) throw error;
      
      toast({
        title: "Thành công",
        description: "Đã thêm đề xuất mới",
      });
      
      setShowDialog(false);
      fetchData();
    } catch (error) {
      console.error("Error adding request:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm đề xuất mới",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleAddClick = () => {
    setShowDialog(true);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <>
      {requests.length === 0 && !isLoading ? (
        <PlaceholderPage
          title="Đề Xuất"
          description="Quản lý các đề xuất xin phép"
          icon={<FileSignature className="h-16 w-16 text-muted-foreground/40" />}
          addButtonAction={handleAddClick}
        />
      ) : (
        <RequestsTable 
          requests={requests} 
          isLoading={isLoading} 
          onAddRequest={handleAddClick}
          onRefresh={handleRefresh}
        />
      )}
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm mới đề xuất</DialogTitle>
            <DialogDescription>Điền thông tin đề xuất của bạn vào mẫu dưới đây</DialogDescription>
          </DialogHeader>
          <RequestForm onSubmit={handleAddRequest} employees={employees} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Requests;
