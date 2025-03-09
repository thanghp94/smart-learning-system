
import React, { useState, useEffect } from "react";
import { Plus, FileDown, Filter, RotateCw, Edit, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { enrollmentService, classService, studentService } from "@/lib/supabase";
import { Enrollment, Student, Class } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import { Badge } from "@/components/ui/badge";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import EnrollmentForm from "./EnrollmentForm";
import { supabase } from "@/lib/supabase/client";
import DetailPanel from "@/components/ui/DetailPanel";

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch enrollments with detailed information
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('student_enrollments_with_details')
        .select('*');
      
      if (enrollmentsError) {
        console.error("Error fetching enrollments:", enrollmentsError);
        throw enrollmentsError;
      }
      
      // Fetch students
      const studentsData = await studentService.getAll();
      
      // Fetch classes
      const classesData = await classService.getAll();
      
      setEnrollments(enrollmentsData || []);
      setStudents(studentsData || []);
      setClasses(classesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu ghi danh",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openAddSheet = () => {
    setIsAddSheetOpen(true);
  };

  const closeAddSheet = () => {
    setIsAddSheetOpen(false);
  };
  
  const openEditSheet = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsEditSheetOpen(true);
  };
  
  const closeEditSheet = () => {
    setIsEditSheetOpen(false);
    setSelectedEnrollment(null);
  };
  
  const openDetailPanel = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsDetailPanelOpen(true);
  };
  
  const closeDetailPanel = () => {
    setIsDetailPanelOpen(false);
    setSelectedEnrollment(null);
  };

  const handleAddEnrollment = async (data: Partial<Enrollment>) => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!data.hoc_sinh_id || !data.lop_chi_tiet_id) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn học sinh và lớp học",
          variant: "destructive"
        });
        return;
      }
      
      const newEnrollment = await enrollmentService.create(data);
      
      toast({
        title: "Thành công",
        description: "Thêm ghi danh mới thành công",
      });
      
      fetchData(); // Reload data
      closeAddSheet();
    } catch (error) {
      console.error("Error in handleAddEnrollment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm ghi danh mới",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateEnrollment = async (data: Partial<Enrollment>) => {
    try {
      setIsSubmitting(true);
      
      if (!selectedEnrollment?.id) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy ID ghi danh",
          variant: "destructive"
        });
        return;
      }
      
      await enrollmentService.update(selectedEnrollment.id, data);
      
      toast({
        title: "Thành công",
        description: "Cập nhật ghi danh thành công",
      });
      
      fetchData(); // Reload data
      closeEditSheet();
    } catch (error) {
      console.error("Error in handleUpdateEnrollment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật ghi danh",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowClick = (enrollment: Enrollment) => {
    openDetailPanel(enrollment);
  };

  const columns = [
    {
      title: "Học sinh",
      key: "ten_hoc_sinh",
      sortable: true,
      render: (value: string) => <span>{value}</span>
    },
    {
      title: "Lớp",
      key: "ten_lop_full",
      sortable: true,
      render: (value: string) => <span>{value}</span>
    },
    {
      title: "Chương trình học",
      key: "ct_hoc",
      sortable: true,
      render: (value: string) => <span>{value || "-"}</span>
    },
    {
      title: "Trạng thái điểm danh",
      key: "tinh_trang_diem_danh",
      sortable: true,
      render: (value: string) => (
        <Badge variant={
          value === "present" ? "success" : 
          value === "absent" ? "destructive" : 
          value === "late" ? "warning" : 
          "secondary"
        }>
          {value === "present" ? "Có mặt" : 
           value === "absent" ? "Vắng mặt" : 
           value === "late" ? "Đi trễ" : value || "Chưa điểm danh"}
        </Badge>
      )
    },
    {
      title: "Ghi chú",
      key: "ghi_chu",
      render: (value: string) => <span>{value || "-"}</span>
    },
    {
      title: "",
      key: "actions",
      width: "100px",
      render: (_: any, record: Enrollment) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            openEditSheet(record);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )
    }
  ];

  const tableActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={fetchData}>
        <RotateCw className="h-4 w-4 mr-1" /> Làm Mới
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="h-4 w-4 mr-1" /> Lọc
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <FileDown className="h-4 w-4 mr-1" /> Xuất
      </Button>
      <Button size="sm" className="h-8" onClick={openAddSheet}>
        <Plus className="h-4 w-4 mr-1" /> Thêm Ghi Danh
      </Button>
    </div>
  );

  if (enrollments.length === 0 && !isLoading) {
    return (
      <PlaceholderPage
        title="Ghi Danh"
        description="Quản lý danh sách ghi danh học sinh vào lớp học"
        addButtonAction={openAddSheet}
      />
    );
  }

  return (
    <TablePageLayout
      title="Ghi Danh"
      description="Quản lý danh sách ghi danh học sinh vào lớp học"
      actions={tableActions}
    >
      <DataTable
        columns={columns}
        data={enrollments}
        isLoading={isLoading}
        searchable={true}
        searchPlaceholder="Tìm kiếm ghi danh..."
        onRowClick={handleRowClick}
      />

      {/* Add Enrollment Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Thêm Ghi Danh Mới</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <EnrollmentForm 
              onSubmit={handleAddEnrollment} 
              students={students}
              classes={classes}
              isLoading={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Edit Enrollment Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Sửa Thông Tin Ghi Danh</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {selectedEnrollment && (
              <EnrollmentForm 
                initialData={selectedEnrollment}
                onSubmit={handleUpdateEnrollment} 
                students={students}
                classes={classes}
                isLoading={isSubmitting}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Detail Panel */}
      {selectedEnrollment && (
        <DetailPanel
          title="Chi tiết ghi danh"
          isOpen={isDetailPanelOpen}
          onClose={closeDetailPanel}
          footerContent={
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  closeDetailPanel();
                  openEditSheet(selectedEnrollment);
                }}
              >
                <Edit className="h-4 w-4 mr-1" /> Sửa thông tin
              </Button>
            </div>
          }
          items={[
            { 
              label: "Học sinh", 
              value: selectedEnrollment.ten_hoc_sinh || selectedEnrollment.hoc_sinh_id 
            },
            { 
              label: "Lớp học", 
              value: selectedEnrollment.ten_lop_full || selectedEnrollment.lop_chi_tiet_id 
            },
            { 
              label: "Chương trình học", 
              value: selectedEnrollment.ct_hoc || "-" 
            },
            { 
              label: "Trạng thái điểm danh", 
              value: (
                <Badge variant={
                  selectedEnrollment.tinh_trang_diem_danh === "present" ? "success" : 
                  selectedEnrollment.tinh_trang_diem_danh === "absent" ? "destructive" : 
                  selectedEnrollment.tinh_trang_diem_danh === "late" ? "warning" : 
                  "secondary"
                }>
                  {selectedEnrollment.tinh_trang_diem_danh === "present" ? "Có mặt" : 
                   selectedEnrollment.tinh_trang_diem_danh === "absent" ? "Vắng mặt" : 
                   selectedEnrollment.tinh_trang_diem_danh === "late" ? "Đi trễ" : 
                   selectedEnrollment.tinh_trang_diem_danh || "Chưa điểm danh"}
                </Badge>
              )
            },
            { 
              label: "Ghi chú", 
              value: selectedEnrollment.ghi_chu || "-" 
            },
          ]}
        />
      )}
    </TablePageLayout>
  );
};

export default Enrollments;
