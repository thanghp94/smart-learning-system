
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { eventService } from "@/lib/database";
import { Event } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import EventForm from "./EventForm";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await eventService.getAll();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách sự kiện",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    console.log("Opening add event form dialog");
    setShowAddForm(true);
  };

  const handleAddFormCancel = () => {
    console.log("Closing add event form dialog");
    setShowAddForm(false);
  };

  const handleAddFormSubmit = async (formData: Partial<Event>) => {
    try {
      console.log("Submitting event data:", formData);
      await eventService.create(formData);
      toast({
        title: "Thành công",
        description: "Thêm sự kiện mới thành công",
      });
      setShowAddForm(false);
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm sự kiện mới: " + (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      title: "Tên sự kiện",
      key: "ten_su_kien",
      sortable: true,
    },
    {
      title: "Loại",
      key: "loai_su_kien",
      sortable: true,
    },
    {
      title: "Địa điểm",
      key: "dia_diem",
    },
    {
      title: "Ngày bắt đầu",
      key: "ngay_bat_dau",
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      sortable: true,
      render: (value: string) => (
        <Badge variant={
          value === "completed" ? "success" : 
          value === "canceled" ? "destructive" : 
          value === "pending" ? "warning" : 
          "secondary"
        }>
          {value === "completed" ? "Hoàn thành" : 
          value === "canceled" ? "Hủy" : 
          value === "pending" ? "Chờ xử lý" : value}
        </Badge>
      ),
    },
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchEvents}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={handleAddClick}>
        <Plus className="h-4 w-4 mr-1" /> Thêm sự kiện
      </Button>
    </div>
  );

  if (events.length === 0 && !isLoading) {
    return (
      <>
        <PlaceholderPage
          title="Sự Kiện"
          description="Quản lý các sự kiện và lịch trình"
          icon={<Calendar className="h-16 w-16 text-muted-foreground/40" />}
          addButtonAction={handleAddClick}
        />
        
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Thêm Sự Kiện Mới</DialogTitle>
              <DialogDescription>
                Điền thông tin sự kiện mới và nhấn lưu để tạo sự kiện.
              </DialogDescription>
            </DialogHeader>
            <EventForm 
              onSubmit={handleAddFormSubmit}
              onCancel={handleAddFormCancel}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <TablePageLayout
        title="Sự Kiện"
        description="Quản lý các sự kiện và lịch trình"
        actions={tableActions}
      >
        <DataTable
          columns={columns}
          data={events}
          isLoading={isLoading}
          searchable={true}
          searchPlaceholder="Tìm kiếm sự kiện..."
        />
      </TablePageLayout>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm Sự Kiện Mới</DialogTitle>
            <DialogDescription>
              Điền thông tin sự kiện mới và nhấn lưu để tạo sự kiện.
            </DialogDescription>
          </DialogHeader>
          <EventForm 
            onSubmit={handleAddFormSubmit}
            onCancel={handleAddFormCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Events;
