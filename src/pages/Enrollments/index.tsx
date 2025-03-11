
import React, { useState, useEffect, useCallback } from "react";
import { enrollmentService, classService, studentService } from "@/lib/supabase";
import { Enrollment, Student, Class } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import EnrollmentTable from "./components/EnrollmentTable";
import EnrollmentDetailPanel from "./components/EnrollmentDetailPanel";
import EnrollmentActions from "./components/EnrollmentActions";
import EnrollmentSheets from "./components/EnrollmentSheets";

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

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const enrollmentsData = await enrollmentService.getAll();
      const studentsData = await studentService.getAll();
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
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      
      if (!data.hoc_sinh_id || !data.lop_chi_tiet_id) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn học sinh và lớp học",
          variant: "destructive"
        });
        return;
      }
      
      await enrollmentService.create(data);
      
      toast({
        title: "Thành công",
        description: "Thêm ghi danh mới thành công",
      });
      
      fetchData();
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
      
      fetchData();
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

  const handleEditFromDetail = () => {
    closeDetailPanel();
    if (selectedEnrollment) {
      openEditSheet(selectedEnrollment);
    }
  };

  // Render placeholder if no data and not loading
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
      actions={<EnrollmentActions onRefresh={fetchData} onAdd={openAddSheet} />}
    >
      <EnrollmentTable 
        enrollments={enrollments}
        isLoading={isLoading}
        onRowClick={openDetailPanel}
        onEditClick={openEditSheet}
      />

      <EnrollmentSheets 
        isAddSheetOpen={isAddSheetOpen}
        setIsAddSheetOpen={setIsAddSheetOpen}
        isEditSheetOpen={isEditSheetOpen}
        setIsEditSheetOpen={setIsEditSheetOpen}
        selectedEnrollment={selectedEnrollment}
        students={students}
        classes={classes}
        isSubmitting={isSubmitting}
        onAddSubmit={handleAddEnrollment}
        onUpdateSubmit={handleUpdateEnrollment}
      />
      
      <EnrollmentDetailPanel 
        enrollment={selectedEnrollment}
        isOpen={isDetailPanelOpen}
        onClose={closeDetailPanel}
        onEditClick={handleEditFromDetail}
      />
    </TablePageLayout>
  );
};

export default Enrollments;
