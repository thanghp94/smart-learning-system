
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { taskService, employeeService } from "@/lib/supabase";
import { Task, Employee } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import DetailPanel from "@/components/ui/DetailPanel";
import TaskDetail from "./TaskDetail";
import TaskForm from "./TaskForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PlaceholderPage from "@/components/common/PlaceholderPage";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách công việc",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddFormCancel = () => {
    setShowAddForm(false);
  };

  const handleAddFormSubmit = async (formData: Partial<Task>) => {
    try {
      const newTask = await taskService.create(formData);
      setTasks([...tasks, newTask]);
      toast({
        title: "Thành công",
        description: "Thêm công việc mới thành công",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm công việc mới",
        variant: "destructive"
      });
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.ten_nhan_su : 'N/A';
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const columns = [
    {
      title: "Tên Công Việc",
      key: "ten_viec",
      sortable: true,
    },
    {
      title: "Loại Việc",
      key: "loai_viec",
      sortable: true,
    },
    {
      title: "Người Phụ Trách",
      key: "nguoi_phu_trach",
      render: (value: string) => getEmployeeName(value),
      sortable: true,
    },
    {
      title: "Ngày Đến Hạn",
      key: "ngay_den_han",
      render: (value: string) => formatDate(value),
      sortable: true,
    },
    {
      title: "Cấp Độ",
      key: "cap_do",
      render: (value: string) => (
        <Badge 
          variant={
            value === "urgent" ? "destructive" : 
            value === "high" ? "destructive" :
            value === "normal" ? "secondary" : 
            "outline"
          }
        >
          {value === "urgent" ? "Khẩn cấp" : 
           value === "high" ? "Cao" : 
           value === "normal" ? "Bình thường" : 
           value === "low" ? "Thấp" : value}
        </Badge>
      ),
      sortable: true,
    },
    {
      title: "Trạng Thái",
      key: "trang_thai",
      render: (value: string) => (
        <Badge 
          variant={
            value === "completed" ? "success" : 
            value === "processing" ? "default" :
            value === "pending" ? "secondary" : 
            value === "overdue" ? "destructive" :
            "outline"
          }
        >
          {value === "completed" ? "Hoàn thành" : 
           value === "processing" ? "Đang thực hiện" : 
           value === "pending" ? "Chờ xử lý" : 
           value === "overdue" ? "Quá hạn" :
           value === "cancelled" ? "Đã hủy" : value}
        </Badge>
      ),
      sortable: true,
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchTasks}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Công Việc
      </Button>
    </div>
  );

  if (tasks.length === 0 && !isLoading) {
    return (
      <>
        <PlaceholderPage
          title="Công Việc"
          description="Quản lý danh sách công việc cần làm"
          icon={<CheckSquare className="h-16 w-16 text-muted-foreground/40" />}
          addButtonAction={handleAddClick}
        />
        
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Thêm Công Việc Mới</DialogTitle>
            </DialogHeader>
            <TaskForm 
              onSubmit={handleAddFormSubmit}
              onCancel={handleAddFormCancel}
              employees={employees}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <TablePageLayout
        title="Công Việc"
        description="Quản lý danh sách công việc cần làm"
        actions={tableActions}
      >
        <DataTable
          columns={columns}
          data={tasks}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          searchable={true}
          searchPlaceholder="Tìm kiếm công việc..."
        />
      </TablePageLayout>

      {selectedTask && (
        <DetailPanel
          title="Thông Tin Công Việc"
          isOpen={showDetail}
          onClose={closeDetail}
        >
          <TaskDetail task={selectedTask} />
        </DetailPanel>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Công Việc Mới</DialogTitle>
          </DialogHeader>
          <TaskForm 
            onSubmit={handleAddFormSubmit}
            onCancel={handleAddFormCancel}
            employees={employees}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Tasks;
