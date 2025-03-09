
import React, { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/ui/DataTable";
import DetailPanel from "@/components/ui/DetailPanel";
import { GENDERS, STATUS_COLORS } from "@/lib/constants";
import { Student } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, Phone, MapPin, School, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { studentService } from "@/lib/supabase/student-service";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await studentService.getAll();
      console.log("Students data received:", data);
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách học sinh. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
    setDetailOpen(true);
  };

  const handleAddStudent = () => {
    navigate("/students/add");
  };

  const handleEditStudent = () => {
    if (selectedStudent) {
      navigate(`/students/edit/${selectedStudent.id}`);
    }
  };

  const columns = [
    {
      title: "Học sinh",
      key: "ten_hoc_sinh",
      render: (value: string, record: Student) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={record.hinh_anh_hoc_sinh} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {value.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">ID: {record.id}</div>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      title: "Chương trình học",
      key: "ct_hoc",
      render: (value: string) => (
        <span className="font-medium">{value || "-"}</span>
      ),
      sortable: true
    },
    {
      title: "Phụ huynh",
      key: "ten_PH",
      render: (value: string, record: Student) => (
        <div>
          <div>{value || "-"}</div>
          <div className="text-xs text-muted-foreground">{record.sdt_ph1 || "-"}</div>
        </div>
      ),
      sortable: true
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      render: (value: string) => (
        <Badge className={cn(STATUS_COLORS[value as keyof typeof STATUS_COLORS] || STATUS_COLORS.default)}>
          {value === "active" && "Đang học"}
          {value === "inactive" && "Nghỉ học"}
          {value === "pending" && "Chờ xác nhận"}
          {!value && "-"}
        </Badge>
      ),
      width: "120px",
      sortable: true
    },
    {
      title: "Hạn học phí",
      key: "han_hoc_phi",
      render: (value: string) => {
        if (!value) return <span>-</span>;
        
        const date = new Date(value);
        const now = new Date();
        const isExpired = date < now;
        
        return (
          <div className={cn(
            "text-sm font-medium",
            isExpired ? "text-red-500" : "text-green-500"
          )}>
            {new Date(value).toLocaleDateString("vi-VN")}
          </div>
        );
      },
      width: "120px",
      sortable: true
    }
  ];

  return (
    <>
      <PageHeader
        title="Học sinh"
        description="Quản lý danh sách học sinh trong hệ thống."
        action={{
          label: "Thêm học sinh",
          onClick: handleAddStudent
        }}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <DataTable
          data={students}
          columns={columns}
          onRowClick={handleRowClick}
          searchPlaceholder="Tìm học sinh theo tên, ID..."
          isLoading={isLoading}
        />
      )}
      
      {selectedStudent && (
        <DetailPanel
          title="Thông tin học sinh"
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          footerContent={
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={handleEditStudent}>Sửa thông tin</Button>
              <Button>Ghi danh lớp mới</Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={selectedStudent.hinh_anh_hoc_sinh} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {selectedStudent.ten_hoc_sinh.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <h3 className="mt-4 text-xl font-bold">{selectedStudent.ten_hoc_sinh}</h3>
              
              <div className="mt-1 flex items-center">
                <Badge className={cn(STATUS_COLORS[selectedStudent.trang_thai as keyof typeof STATUS_COLORS] || STATUS_COLORS.default)}>
                  {selectedStudent.trang_thai === "active" && "Đang học"}
                  {selectedStudent.trang_thai === "inactive" && "Nghỉ học"}
                  {selectedStudent.trang_thai === "pending" && "Chờ xác nhận"}
                  {!selectedStudent.trang_thai && "-"}
                </Badge>
              </div>
              
              <p className="mt-2 text-sm text-muted-foreground">
                ID: {selectedStudent.id}
              </p>
            </div>
            
            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="classes">Lớp học</TabsTrigger>
                <TabsTrigger value="attendance">Điểm danh</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm text-muted-foreground">Ngày sinh</p>
                      <p className="font-medium">
                        {selectedStudent.ngay_sinh 
                          ? new Date(selectedStudent.ngay_sinh).toLocaleDateString("vi-VN")
                          : "-"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="rounded-full p-2 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                      <School className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm text-muted-foreground">Chương trình học</p>
                      <p className="font-medium">{selectedStudent.ct_hoc || "-"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="rounded-full p-2 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm text-muted-foreground">Hạn học phí</p>
                      <p className="font-medium">
                        {selectedStudent.han_hoc_phi 
                          ? new Date(selectedStudent.han_hoc_phi).toLocaleDateString("vi-VN")
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="mb-4 text-sm font-semibold">Thông tin phụ huynh</h4>
                  <div className="grid gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Tên phụ huynh</p>
                      <p>{selectedStudent.ten_PH || "-"}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <p>{selectedStudent.sdt_ph1 || "-"}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <p>{selectedStudent.email_ph1 || "-"}</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <p>{selectedStudent.dia_chi || "-"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="classes" className="pt-4">
                <div className="rounded-lg border">
                  <div className="p-4">
                    <h4 className="font-medium">Lớp đang học</h4>
                  </div>
                  <div className="p-8 text-center text-muted-foreground">
                    <p>Chưa có thông tin về lớp học</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/enrollments/add")}>
                      Ghi danh lớp học
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="attendance" className="pt-4">
                <div className="rounded-lg border">
                  <div className="flex items-center justify-between p-4">
                    <h4 className="font-medium">Điểm danh gần đây</h4>
                    <Button variant="outline" size="sm">Xem tất cả</Button>
                  </div>
                  <div className="p-8 text-center text-muted-foreground">
                    <p>Chưa có thông tin điểm danh</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DetailPanel>
      )}
    </>
  );
};

export default Students;
