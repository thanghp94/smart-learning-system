
import React, { useState } from "react";
import { Enrollment } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import TablePageLayout from "@/components/common/TablePageLayout";
import PlaceholderPage from "@/components/common/PlaceholderPage";
import EnrollmentTable from "./components/EnrollmentTable";
import EnrollmentDetailPanel from "./components/EnrollmentDetailPanel";
import EnrollmentActions from "./components/EnrollmentActions";
import EnrollmentSheets from "./components/EnrollmentSheets";
import EnrollmentFilters from "./components/EnrollmentFilters";
import { useEnrollmentData } from "./hooks/useEnrollmentData";
import { enrollmentService } from "@/lib/supabase";

const Enrollments = () => {
  const { 
    filteredEnrollments, 
    isLoading, 
    isSubmitting, 
    students, 
    classes, 
    filters,
    setIsSubmitting,
    fetchData, 
    handleFilterChange, 
    handleResetFilters 
  } = useEnrollmentData();
  
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const { toast } = useToast();

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
  if (filteredEnrollments.length === 0 && !isLoading) {
    return (
      <PlaceholderPage
        title="Ghi Danh"
        description="Quản lý danh sách ghi danh học sinh vào lớp học"
        addButtonAction={openAddSheet}
      />
    );
  }

  const renderActions = () => (
    <div className="flex items-center space-x-2">
      <EnrollmentFilters 
        onFilterChange={handleFilterChange} 
        filters={filters} 
        onReset={handleResetFilters} 
      />
      <EnrollmentActions onRefresh={fetchData} onAdd={openAddSheet} />
    </div>
  );

  return (
    <TablePageLayout
      title="Ghi Danh"
      description="Quản lý danh sách ghi danh học sinh vào lớp học"
      actions={renderActions()}
    >
      <EnrollmentTable 
        enrollments={filteredEnrollments}
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
