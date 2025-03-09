
import React, { useState, useEffect } from "react";
import { FileSignature, Plus, RotateCw } from "lucide-react";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import RequestForm from "./RequestForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";
import RequestsTable from "./RequestsTable";

interface Request {
  id: string;
  title?: string;
  description?: string;
  requester?: string;
  status?: string;
  priority?: string;
  noi_dung: string;
  ly_do?: string;
  nguoi_de_xuat_id: string;
  trang_thai: string;
  ngay_de_xuat: string;
  created_at: string;
}

const Requests = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('requests')
        .select('*');
      
      if (requestsError) throw requestsError;
      
      // Fetch employees for requester names
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('id, ten_nhan_su');
      
      if (employeesError) throw employeesError;
      
      // Map employee names to requests
      const formattedRequests = (requestsData || []).map((req: any) => {
        const employee = employeesData?.find(e => e.id === req.nguoi_de_xuat_id);
        return {
          ...req,
          requester: employee?.ten_nhan_su || 'Unknown',
          title: req.noi_dung, // Map noi_dung to title for table display
          status: req.trang_thai || 'pending',
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
      // Prepare data for Supabase insert
      const requestData = {
        noi_dung: data.title,
        ly_do: data.description,
        nguoi_de_xuat_id: data.requester,
        trang_thai: 'pending',
        ngay_de_xuat: new Date().toISOString().split('T')[0],
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
      fetchData(); // Refresh the data
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
          </DialogHeader>
          <RequestForm onSubmit={handleAddRequest} employees={employees} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Requests;
